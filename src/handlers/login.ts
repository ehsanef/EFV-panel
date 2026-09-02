/* EFV-panel — login handler. Adapted from BPB-Worker-Panel (GPL-3.0).
   GET  /{securePath}/login       → login page (first run = setup screen)
   POST /{securePath}/login       → { password } JSON (or form-encoded);
                                    first run stores hash, else verifies.
   GET  /{securePath}/login/ok    → 204 if a password is set (frontend probes). */

import { generateJWTToken } from '@auth';
import { decompressGzipBase64, respond, HttpStatus, safeError } from '@common';
import { getGlobals } from '@settings';
import { getAdminPasswordHash, putAdminPasswordHash } from '@kv';
import { fallback } from './utils';

export async function handleLogin(request: Request, env: Env): Promise<Response> {
    const { pathname } = getGlobals();
    const parts = pathname.split('/');
    const path = parts.slice(2).join('/');

    switch (path) {
        case 'login':
            if (request.method === 'GET') return renderLogin(request, env);
            if (request.method === 'POST') return submitLogin(request, env);
            if (request.method === 'HEAD') {
                // Probe used by the login page: 204 = fresh install (setup mode), 401 = password already set.
                const storedHash = await getAdminPasswordHash(env);
                return storedHash
                    ? respond(false, HttpStatus.UNAUTHORIZED, 'Password is set.')
                    : new Response(null, { status: 204 });
            }
            return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');

        default:
            return fallback(request);
    }
}

async function renderLogin(request: Request, env: Env): Promise<Response> {
    const html = await decompressGzipBase64(LOGIN_HTML_CONTENT);
    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

async function submitLogin(request: Request, env: Env): Promise<Response> {
    try {
        let password = '';
        const contentType = request.headers.get('Content-Type') || '';

        if (contentType.includes('application/json')) {
            const body = await request.json() as { password?: string };
            password = body.password ?? '';
        } else {
            const form = await request.formData();
            password = String(form.get('password') ?? '');
        }

        if (!password) return respond(false, HttpStatus.BAD_REQUEST, 'Password is required.');

        const storedHash = await getAdminPasswordHash(env);

        if (!storedHash) {
            // First run: set the admin password.
            const hash = await sha256Hex(password);
            await putAdminPasswordHash(env, hash);
            const token = await generateJWTToken(request, env);
            return respond(true, HttpStatus.OK, 'Password set.', undefined, token.cookieHeader);
        }

        const hash = await sha256Hex(password);
        if (hash !== storedHash) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Wrong password.');
        }

        const token = await generateJWTToken(request, env);
        return respond(true, HttpStatus.OK, 'Logged in.', undefined, token.cookieHeader);
    } catch (error) {
        console.log(error);
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, safeError(error));
    }
}

async function sha256Hex(text: string): Promise<string> {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}
