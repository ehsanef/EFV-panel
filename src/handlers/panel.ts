/* EFV-panel — panel handler. Adapted from BPB-Worker-Panel (GPL-3.0).
   Contract routes: GET panel, panel/settings, POST update-settings, reset-settings,
   reset-password, my-ip (GET, text), logout. */

import { PanelSettings } from '#types/settings';
import { authenticate, logout, resetPassword } from '@auth';
import { decompressGzipBase64, respond, HttpStatus, safeError } from '@common';
import { getKvSettings, putKvSettings, getEmbeddedSettings, putEmbeddedSettings } from '@kv';
import { DEFAULT_KV_SETTINGS } from '@settings/defaults';
import { getGlobals } from '@settings';
import { validateSettings } from '@settings/validators';
import { fallback } from './utils';

export async function handlePanel(request: Request, env: Env): Promise<Response> {
    const { pathname } = getGlobals();
    const parts = pathname.split('/');
    const path = parts.slice(2).join('/');

    switch (path) {
        case 'panel':
            return renderPanel(request, env);

        case 'panel/settings':
            return getPanelSettings(request, env);

        case 'panel/update-settings':
            return updatePanelSettings(request, env);

        case 'panel/reset-settings':
            return resetPanelSettings(request, env);

        case 'panel/reset-password':
            return resetPassword(request, env);

        case 'panel/my-ip':
            return getMyIP(request);

        case 'panel/logout':
            return logout();

        default:
            return fallback(request);
    }
}

async function renderPanel(request: Request, env: Env): Promise<Response> {
    const pwdHash = await env.kv.get('adminPasswordHash');
    if (pwdHash) {
        const auth = await authenticate(request, env);
        if (!auth) {
            const url = new URL('./login', request.url);
            return Response.redirect(url.toString(), 302);
        }
    }

    const html = await decompressGzipBase64(PANEL_HTML_CONTENT);
    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

async function getPanelSettings(request: Request, env: Env): Promise<Response> {
    const isPassSet = Boolean(await env.kv.get('adminPasswordHash'));

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.', { isPassSet });
        }

        const kvSettings = await getKvSettings(env);
        const embedded = await getEmbeddedSettings(env);
        const panelSettings: PanelSettings = {
            ...kvSettings,
            ...embedded
        };

        return new Response(JSON.stringify(panelSettings), {
            status: HttpStatus.OK,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    } catch (error) {
        console.log(error);
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `Error occurred while fetching settings: ${safeError(error)}`
        );
    }
}

async function updatePanelSettings(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST' && request.method !== 'PUT') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
        }

        const newSettings: PanelSettings = await request.json();
        const errors = validateSettings(newSettings);
        if (errors) return respond(false, HttpStatus.BAD_REQUEST, 'Validation Error', errors);

        const { securePath, vlUUID, trPass, ...kvFields } = newSettings;
        await putKvSettings(env, kvFields);
        if (vlUUID !== undefined || trPass !== undefined) {
            const embedded = await getEmbeddedSettings(env);
            await putEmbeddedSettings(env, { ...embedded, vlUUID, trPass, securePath });
        }

        return respond(true, HttpStatus.OK, '');
    } catch (error) {
        console.log(error);
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, safeError(error));
    }
}

async function resetPanelSettings(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed!');
    }

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
        }

        await putKvSettings(env, { ...DEFAULT_KV_SETTINGS });
        return respond(true, HttpStatus.OK, '');
    } catch (error) {
        console.log(error);
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `Error occurred while resetting settings: ${safeError(error)}`
        );
    }
}

async function getMyIP(request: Request): Promise<Response> {
    const ip = request.headers.get('CF-Connecting-IP') || '';
    return new Response(ip, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
