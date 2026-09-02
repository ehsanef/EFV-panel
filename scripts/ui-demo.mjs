// UI demo server: serves the REAL panel/login assets (unminified) with a mock API.
// Layout/CSS/JS are exactly what ships; only the API is mocked.
import { createServer } from 'http';
import { readFileSync, writeFileSync } from 'fs';

const read = (p) => readFileSync('C:/Users/BLACK SHARK/efv-panel/src/assets/' + p, 'utf8');

// Build the panel page the same way scripts/build.js does (placeholders → content)
function buildPage(dir) {
    let html = read(dir + '/index.html').replaceAll('__VERSION__', '1.0.0');
    html = html.replace('/* CSS_PLACEHOLDER */', () => read(dir + '/style.css'));
    html = html.replace('/* JS_PLACEHOLDER */', () => read(dir + '/script.js'));
    return html;
}

const PANEL_HTML = buildPage('panel');
const LOGIN_HTML = buildPage('login');

// Mock settings: defaults + embedded (shape = PanelSettings contract)
const SETTINGS = JSON.parse(readFileSync('C:/Users/BLACK SHARK/AppData/Local/Temp/mock-settings.json', 'utf8'));

const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost:58912');
    const send = (status, body, type = 'text/html; charset=utf-8') => {
        res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
        res.end(body);
    };

    if (url.pathname.endsWith('/login')) {
        if (req.method === 'HEAD') { res.writeHead(204); return res.end(); } // fresh-install probe
        return send(200, LOGIN_HTML);
    }
    if (url.pathname.endsWith('/panel')) return send(200, PANEL_HTML);
    if (url.pathname.endsWith('/panel/settings')) return send(200, JSON.stringify(SETTINGS), 'application/json');
    if (url.pathname.endsWith('/panel/update-settings')) {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => { Object.assign(SETTINGS, JSON.parse(body)); send(200, JSON.stringify({ success: true })); });
        return;
    }
    if (url.pathname.endsWith('/panel/reset-settings')) return send(200, JSON.stringify({ success: true }));
    if (url.pathname.endsWith('/panel/my-ip')) return send(200, '93.184.216.34', 'text/plain');
    if (url.pathname.endsWith('/panel/logout')) { res.writeHead(302, { Location: './login' }); return res.end(); }
    if (url.pathname.endsWith('/qrcode')) { // 1x1 transparent PNG placeholder
        return send(200, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64'), 'image/png');
    }
    send(404, 'not found');
});

server.listen(58912, () => console.log('UI DEMO: http://localhost:58912/efvdemo/panel  (login: http://localhost:58912/efvdemo/login)'));
