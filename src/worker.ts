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
            const { securePath, pathname } = getGlobals();
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
