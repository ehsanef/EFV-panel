// EFV-panel local smoke test — runs the built worker in Miniflare with real KV,
// exercises: first-run login setup, auth'd settings round-trip, sub endpoints, QR.
import { Miniflare } from 'miniflare';

const mf = new Miniflare({
    modules: true,
    scriptPath: 'C:/Users/BLACK SHARK/efv-panel/dist/worker.js',
    kvNamespaces: ['kv'],
    compatibilityDate: '2026-01-01',
    compatibilityFlags: ['nodejs_compat'],
    bindings: {
        UUID: '0c1ae857-a909-4bf4-89c4-d06bcfb96398',
        TR_PASS: 'test-trojan-pass'
    }
});

const securePath = 'testpath'; // can't know yet — read from KV after first request
const origin = 'http://localhost:8787';

const results = [];
const check = (name, ok, detail = '') => {
    results.push({ name, ok, detail });
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};

try {
    // First request triggers KV seeding (embeddedSettings gets a random securePath).
    // Fresh install → GET / must redirect to the secret setup URL (first-run concierge).
    const rootRes = await mf.dispatchFetch(origin + '/', { redirect: 'manual' });
    const rootLoc = rootRes.headers.get('Location') || '';
    check('fresh install: GET / redirects to secret setup URL',
        rootRes.status === 302 && /\/[a-z0-9]+\/login$/.test(rootLoc),
        `status ${rootRes.status}, Location ${rootLoc}`);

    // Read the seeded securePath from KV
    const ns = await mf.getKVNamespace('kv');
    const embedded = JSON.parse(await ns.get('embeddedSettings'));
    check('embeddedSettings seeded', !!embedded.securePath, `securePath=${embedded.securePath}`);
    const sp = embedded.securePath;
    const base = `${origin}/${sp}`;
    check('redirect matches seeded securePath', rootLoc === base + '/login', rootLoc);

    // Login page
    const loginPage = await mf.dispatchFetch(base + '/login');
    const loginHtml = await loginPage.text();
    check('GET /login → 200 HTML', loginPage.status === 200 && loginHtml.includes('EFV'), `${loginPage.status}, ${loginHtml.length} chars`);

    // HEAD probe: 204 = fresh install (setup mode) — the login page uses this to show the
    // "claim panel / bookmark this address" setup hint.
    const probe = await mf.dispatchFetch(base + '/login', { method: 'HEAD' });
    check('HEAD /login (fresh) → 204 setup mode', probe.status === 204, `status ${probe.status}`);

    // First-run: no password set yet → POST login sets password (setup mode)
    const setupRes = await mf.dispatchFetch(base + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'efv-test-pass-123' })
    });
    check('POST /login (setup) → 200', setupRes.status === 200, `status ${setupRes.status}`);

    // Wrong password
    const badLogin = await mf.dispatchFetch(base + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'wrong' })
    });
    check('POST /login wrong pass → 401', badLogin.status === 401, `status ${badLogin.status}`);

    // Right password → cookie
    const goodLogin = await mf.dispatchFetch(base + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'efv-test-pass-123' })
    });
    const setCookie = goodLogin.headers.get('Set-Cookie') || '';
    check('POST /login good pass → 200 + cookie', goodLogin.status === 200 && setCookie.includes('efv-token'), setCookie.slice(0, 40));
    const token = /efv-token=([^;]+)/.exec(setCookie)?.[1];

    // Settings round-trip
    const settingsRes = await mf.dispatchFetch(base + '/panel/settings', {
        headers: { Cookie: `efv-token=${token}` }
    });
    const settings = await settingsRes.json();
    check('GET /panel/settings → 200 JSON', settingsRes.status === 200 && !!settings && 'localDNS' in settings, Object.keys(settings || {}).length + ' keys');
    const before = settings;

    // Update settings (read-modify-write)
    const updated = { ...before, localDNS: '1.1.1.1' };
    const updRes = await mf.dispatchFetch(base + '/panel/update-settings', {
        method: 'POST',
        headers: { Cookie: `efv-token=${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
    });
    check('POST /panel/update-settings → 200', updRes.status === 200, `status ${updRes.status}`);

    // Re-read and verify mutation persisted
    const re = await (await mf.dispatchFetch(base + '/panel/settings', {
        headers: { Cookie: `efv-token=${token}` }
    })).json();
    const after = re;
    check('localDNS persisted', after?.localDNS === '1.1.1.1', `localDNS=${after?.localDNS}`);

    // Panel page (auth'd)
    const panelPage = await mf.dispatchFetch(base + '/panel', {
        headers: { Cookie: `efv-token=${token}` }
    });
    const panelHtml = await panelPage.text();
    check('GET /panel → 200 EFV HTML', panelPage.status === 200 && panelHtml.includes('EFV'), `${panelPage.status}, ${panelHtml.length} chars`);

    // My IP
    const ipRes = await mf.dispatchFetch(base + '/panel/my-ip', {
        headers: { Cookie: `efv-token=${token}` }
    });
    check('GET /panel/my-ip → text', ipRes.status === 200, await ipRes.text());

    // Subscription endpoints (no auth per design? contract says link-based)
    for (const app of ['v2ray', 'xray', 'singbox', 'clash', 'clash-meta', 'v2ray-json']) {
        const r = await mf.dispatchFetch(`${base}/sub/${app}`);
        const body = await r.text();
        check(`GET /sub/${app}`, r.status === 200 && body.length > 0, `${r.status}, ${body.length}b`);
    }

    // QR endpoint (same-origin data per security check)
    const qr = await mf.dispatchFetch(`${base}/qrcode?data=${encodeURIComponent(base + '/sub/v2ray')}`);
    const qrBytes = await qr.arrayBuffer();
    check('GET /qrcode → PNG', qr.status === 200 && new Uint8Array(qrBytes)[1] === 0x50, `${qr.status}, ${qrBytes.byteLength}b`); // 0x89 'P' PNG magic

    // Unauthenticated settings access → 401
    const unauth = await mf.dispatchFetch(base + '/panel/settings');
    check('GET /panel/settings unauth → 401', unauth.status === 401, `status ${unauth.status}`);

    // After the password is claimed, the first-run concierge must CLOSE:
    const rootAfter = await mf.dispatchFetch(origin + '/', { redirect: 'manual' });
    check('after claim: GET / → 404 (concierge closed)',
        rootAfter.status === 404, `status ${rootAfter.status}`);
    const probeAfter = await mf.dispatchFetch(base + '/login', { method: 'HEAD' });
    check('after claim: HEAD /login → 401 (password set)',
        probeAfter.status === 401, `status ${probeAfter.status}`);

    const passCount = results.filter(r => r.ok).length;
    console.log(`\n${passCount}/${results.length} passed`);
    await mf.dispose();
    process.exit(passCount === results.length ? 0 : 1);
} catch (err) {
    console.error('SMOKE CRASH:', err);
    await mf.dispose();
    process.exit(2);
}
