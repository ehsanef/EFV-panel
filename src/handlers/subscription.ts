/* EFV-panel — subscription handler. Adapted from BPB-Worker-Panel (GPL-3.0).
   Contract sub paths (see docs/CONTRACT.md):
     /sub/v2ray       → base64 vless:// + trojan:// URIs
     /sub/v2ray-json  → v2ray/xray JSON config
     /sub/xray        → xray JSON config
     /sub/singbox     → sing-box JSON config
     /sub/clash       → Clash YAML
     /sub/clash-meta  → Clash Meta YAML
   ?mode=fragment switches xray-family endpoints to fragment configs. */

import { getClNormalConfig } from '@cores/clash/configs';
import { getURLConfigs } from '@cores/common';
import { getSbCustomConfig } from '@cores/sing-box/configs';
import { getXrCustomConfigs } from '@cores/xray/configs';
import { getGlobals } from '@settings';
import { fallback } from './utils';

export async function handleSubscriptions(request: Request, env: Env): Promise<Response> {
    const { pathname, searchParams } = getGlobals();
    const path = pathname.split('/')[3];
    const isFragment = searchParams.get('mode') === 'fragment';

    switch (path) {
        case 'v2ray':
            return getURLConfigs();

        case 'v2ray-json':
            return getXrCustomConfigs(isFragment);

        case 'xray':
            return getXrCustomConfigs(isFragment);

        case 'singbox':
            return getSbCustomConfig(isFragment);

        case 'clash':
            return getClNormalConfig();

        case 'clash-meta':
            return getClNormalConfig();

        default:
            return fallback(request);
    }
}
