/* EFV-panel — per-request settings globals.
   Flow adapted from BPB-Worker-Panel (GPL-3.0).
   init(request) sets request globals; setSettings(env) loads KV settings.
   Embedded creds (vlUUID/trPass) come from env vars; securePath from KV. */

import { KvSettings, ReqSettings, EmbededSettings, SharedSettings, WarpAccount } from '#types/settings';
import { getKvSettings as loadKvSettings, getEmbeddedSettings } from './kv';
import { DEFAULT_KV_SETTINGS } from './defaults';

/* Runtime name globals used by the ported core generators (plain strings for EFV). */
Object.assign(globalThis, {
    _VL_: 'vless',
    _VL_CAP_: 'VLESS',
    _VM_: 'vmess',
    _VM_CAP_: 'VMess',
    _TR_: 'trojan',
    _TR_CAP_: 'Trojan',
    _SS_: 'shadowsocks',
    _V2_: 'v2ray',
    _project_: 'EFV',
    _project_SM_: 'efv',
    _repo_: 'https://github.com/ehsanef/EFV-panel',
    _website_: 'https://github.com/ehsanef/EFV-panel#readme',
    _public_proxy_ip_: ''
});

let globalSettings: Partial<EmbededSettings & ReqSettings> = {};
let kvSettings: KvSettings = structuredClone(DEFAULT_KV_SETTINGS);

export function init(request: Request) {
    const { pathname, origin, searchParams, hostname } = new URL(request.url);
    globalSettings = {
        httpPorts: [80, 8080, 2052, 2082, 2086, 2095, 8880],
        httpsPorts: [443, 8443, 2053, 2083, 2087, 2096],
        client: decodeURIComponent(searchParams.get('app') ?? ''),
        origin,
        searchParams,
        pathname: decodeURIComponent(pathname),
        hostname
    };
}

export async function setSettings(env: Env) {
    const embedded = await getEmbeddedSettings(env);
    kvSettings = await loadKvSettings(env);
    globalSettings = {
        ...globalSettings,
        ...embedded,
        mainDomain: kvSettings.customDomain || (globalSettings.hostname ?? '')
    };
}

/* BPB-compatible accessors used by the ported cores. */
export const getSettings = (): KvSettings & EmbededSettings & ReqSettings =>
    ({ ...kvSettings, ...globalSettings } as KvSettings & EmbededSettings & ReqSettings);

export const getWarpAccounts = (): WarpAccount[] => WARP_ACCOUNTS;

export function getSharedSettings(): SharedSettings {
    const { remoteSettings, customDomain, panelVersion, ...proxySettings } = kvSettings;
    return {
        ...proxySettings,
        proxyIpMode: globalSettings.proxyIpMode!,
        proxyIPs: globalSettings.proxyIPs!,
        prefixes: globalSettings.prefixes!,
        fallback: globalSettings.fallback!,
        dohUrl: globalSettings.dohUrl!
    };
}

const WARP_ACCOUNTS: WarpAccount[] = [
    {
        privateKey: '4NyxMUme2zGv5r3QWI0hJBlNglm1J/thoCE55PK29G8=',
        publicKey: 'bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=',
        warpIPv6: '2606:4700:110:8fd2:11f3:8e67:11d4:3704/128',
        reserved: 'N16D'
    },
    {
        privateKey: 'aPQwXZBOndL0km0Swo0ArDOoy3bjeZzTu+/d4YHxW04=',
        publicKey: 'bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=',
        warpIPv6: '2606:4700:110:859d:1029:4dfa:bf63:ff08/128',
        reserved: 'SmWi'
    }
];

export const getGlobals = (): EmbededSettings & ReqSettings => globalSettings as EmbededSettings & ReqSettings;
export const getKvSettings = (): KvSettings => kvSettings;
