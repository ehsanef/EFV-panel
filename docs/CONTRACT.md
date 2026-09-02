# EFV-panel — Backend ⇄ Frontend Contract (FROZEN)

Both workstreams build against this document. `src/types/settings.ts` is the
single source of truth for the settings schema; do not rename fields.

## Routes

Base path: `/{securePath}` where `securePath` is the random path embedded in the worker.

| Method | Route | Purpose | Response |
|---|---|---|---|
| GET/POST | `/login` | login page / submit password | sets `efv-token` JWT cookie |
| GET | `/panel` | panel HTML page (embedded asset) | HTML |
| GET | `/panel/settings` | full settings JSON | `PanelSettings` |
| POST | `/panel/update-settings` | save `PanelSettings` body | `{ message: string }` |
| POST | `/panel/reset-settings` | restore defaults | `{ message: string }` |
| POST | `/panel/reset-password` | new password (body: `{ password }`) | `{ message }` |
| GET | `/panel/my-ip` | caller IP | text |
| GET | `/panel/logout` | clear cookie | redirect |
| GET | `/sub/{app}` | subscription link | app-specific config |
| GET | `/qrcode?data={url}` | QR PNG for any sub link | image/png |

Subscription `app` values (UI shows one button/link per app, plus QR):
`v2ray` (base64 vless://+trojan://), `v2ray-json`, `xray` (json),
`singbox` (json), `clash` (yaml), `clash-meta` (yaml).
Query params on sub links: `?mode=normal|fragment` (fragment configs for v2rayNG/xray family).

## Panel page requirements (frontend)

- `src/assets/panel/index.html` contains exact markers `/* CSS_PLACEHOLDER */` (inside `<style>`) and `/* JS_PLACEHOLDER */` (inside `<script>`); `__VERSION__` string is replaced at build.
- Plain vanilla JS/CSS. NO frameworks (no Bootstrap/jQuery).
- i18n: EN + FA dictionaries in panel script; `dir="rtl"` support; light + dark themes (default dark, respects `prefers-color-scheme`).
- Settings form sections: About/My IP, Proxy (protocols, ports, fingerprint, IPv6, TFO), Fragment, DNS, Routing rules (bypass/block toggles + custom rule lists), CDN/Clean IPs, WARP, Custom configs/subs, Danger zone (reset).
- Every field of `KvSettings` (except `panelVersion`, `remoteSettings`, `customDomain` which the backend manages) is editable somewhere in the UI.
- Save via `POST ./panel/update-settings` with the FULL settings object (read-modify-write).
- Toasts for feedback; sticky save bar; collapsible sidebar navigation with icons; header shows version + My IP.

## Login page requirements (frontend)

- Same no-framework constraint; password field, submit → `POST ./login` with `{ password }` (or form-encoded, backend accepts both); error shake + message on 401; redirect target from `?redirect=` query param.
- Design language must match panel.

## Build

`npm run build` → `dist/worker.js`. Assets are minified + gzipped + base64-embedded as globals: `PANEL_HTML_CONTENT`, `LOGIN_HTML_CONTENT`, `ERROR_HTML_CONTENT` (see `scripts/build.js`). `tsc --noEmit` must pass.
