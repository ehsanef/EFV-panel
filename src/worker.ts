import { renderError } from '@handlers/error';
import { handleLogin } from '@handlers/login';
import { handlePanel } from '@handlers/panel';
import { generateQRCode } from '@handlers/qrcode';
import { handleSubscriptions } from '@handlers/subscription';
import { fallback } from '@handlers/utils';
import { handleWebsocket } from '@handlers/websocket';
import { init, setSettings, getGlobals } from '@settings';

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        try {
            init(request);
            if (request.headers.get('Upgrade') === 'websocket') {
                await setSettings(env);
                return handleWebsocket(request);
            }
            await setSettings(env);
            const { securePath, pathname, origin } = getGlobals();

            /* First-run concierge: on a fresh install (no admin password claimed yet),
               any visit to / redirects to the secret setup screen. Once the password
               is claimed, / falls through to the normal 404/fallback — the secret
               path stays secret. */
            if (pathname === '/' && request.method === 'GET') {
                const claimed = await env.kv.get('adminPasswordHash');
                if (claimed === null) return Response.redirect(`${origin}/${securePath}/login`, 302);
            }

            const path = pathname.split('/').splice(0, 3).join('/');

            switch (path) {
                case `/${securePath}/panel`:
                    return handlePanel(request, env);

                case `/${securePath}/login`:
                    return handleLogin(request, env);

                case `/${securePath}/sub`:
                    return handleSubscriptions(request, env);

                case `/${securePath}/qrcode`:
                    return generateQRCode(request);

                default:
                    return fallback(request);
            }
        } catch (error) {
            return renderError(error);
        }
    }
}
