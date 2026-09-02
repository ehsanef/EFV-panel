/* EFV-panel — KV storage access.
   Contract keys:
     - `proxySettings`      → KvSettings (the 65 contract fields)
     - `embeddedSettings`   → EmbeddedSettings (vlUUID, trPass, securePath, …)
     - `adminPasswordHash`  → SHA-256 hex of the admin password
   First run: seeds defaults, generates a random securePath, applies env vars. */

import { KvSettings, EmbededSettings } from '#types/settings';
import { DEFAULT_KV_SETTINGS } from './defaults';

export async function getKvSettings(env: Env): Promise<KvSettings> {
    const stored = await env.kv.get('proxySettings', { type: 'json' }) as KvSettings | null;
    if (!stored) {
        await env.kv.put('proxySettings', JSON.stringify(DEFAULT_KV_SETTINGS));
        return { ...DEFAULT_KV_SETTINGS };
    }
    return { ...DEFAULT_KV_SETTINGS, ...stored };
}

export async function putKvSettings(env: Env, settings: KvSettings): Promise<void> {
    settings.panelVersion = VERSION;
    await env.kv.put('proxySettings', JSON.stringify(settings));
}

export async function getEmbeddedSettings(env: Env): Promise<EmbededSettings> {
    const stored = await env.kv.get('embeddedSettings', { type: 'json' }) as EmbededSettings | null;
    if (stored) return stored;

    const seeded: EmbededSettings = {
        vlUUID: env.UUID || randomUUID(),
        trPass: env.TR_PASS || randomToken(16),
        securePath: randomToken(16),
        proxyIpMode: 'proxyip',
        proxyIPs: [],
        prefixes: [],
        fallback: '',
        dohUrl: 'https://cloudflare-dns.com/dns-query',
        mainDomain: ''
    };
    await env.kv.put('embeddedSettings', JSON.stringify(seeded));
    return seeded;
}

export async function putEmbeddedSettings(env: Env, embedded: EmbededSettings): Promise<void> {
    await env.kv.put('embeddedSettings', JSON.stringify(embedded));
}

export async function getAdminPasswordHash(env: Env): Promise<string | null> {
    return await env.kv.get('adminPasswordHash');
}

export async function putAdminPasswordHash(env: Env, hash: string): Promise<void> {
    await env.kv.put('adminPasswordHash', hash);
}

function randomToken(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let out = '';
    for (let i = 0; i < length; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
}

function randomUUID(): string {
    return crypto.randomUUID();
}
