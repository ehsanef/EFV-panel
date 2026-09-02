/* EFV-panel — JWT auth via jose. Pattern from BPB-Worker-Panel (GPL-3.0).
   HS256, cookie `efv-token`, 12h expiry, secret auto-generated in KV. */

import { HttpStatus, respond } from '@common';
import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'efv-token';
const SESSION_HOURS = 12;

export function logout(): Response {
    return respond(true, HttpStatus.OK, 'Successfully logged out!', null, {
        'Set-Cookie': `${COOKIE_NAME}=; Path=/; Secure; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        'Content-Type': 'text/plain'
    });
}

export async function generateJWTToken(request: Request, env: Env): Promise<{ cookieHeader: Record<string, string> }> {
    let secretKey = await env.kv.get('secretKey');
    if (!secretKey) {
        secretKey = generateSecretKey();
        await env.kv.put('secretKey', secretKey);
    }

    const secret = new TextEncoder().encode(secretKey);
    const jwtToken = await new SignJWT({ sub: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_HOURS}h`)
        .sign(secret);

    return {
        cookieHeader: {
            'Set-Cookie': `${COOKIE_NAME}=${jwtToken}; Path=/; HttpOnly; Secure; Max-Age=${SESSION_HOURS * 60 * 60}; SameSite=Strict`
        }
    };
}

export async function authenticate(request: Request, env: Env): Promise<boolean> {
    try {
        const secretKey = await env.kv.get('secretKey');
        if (secretKey === null) {
            console.log('Secret key not found in KV.');
            return false;
        }

        const secret = new TextEncoder().encode(secretKey);
        const cookie = request.headers.get('Cookie')?.match(/(^|;\s*)efv-token=([^;]*)/);
        const token = cookie ? cookie[2] : null;
        if (!token) {
            console.log('Unauthorized: Token not available!');
            return false;
        }

        await jwtVerify(token, secret);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function resetPassword(request: Request, env: Env): Promise<Response> {
    const auth = await authenticate(request, env);
    const storedHash = await env.kv.get('adminPasswordHash');
    if (storedHash && !auth) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized.');
    }

    const data = await request.json() as { password?: string };
    const password = data.password ?? '';

    if (!password) {
        return respond(false, HttpStatus.BAD_REQUEST, 'Password is required.');
    }

    const hash = await sha256Hex(password);
    if (hash === storedHash) {
        return respond(false, HttpStatus.BAD_REQUEST, 'Please enter a new password.');
    }

    await env.kv.put('adminPasswordHash', hash);
    return respond(true, HttpStatus.OK, 'Password changed successfully.');
}

function generateSecretKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(text: string): Promise<string> {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}
