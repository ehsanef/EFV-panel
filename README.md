# EFV Panel ⚡

<div align="center">

**A VLESS / Trojan proxy panel for Cloudflare Workers — with a fresh UI**

[![](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![](https://img.shields.io/badge/license-GPL--3.0-blue)](./LICENSE)

</div>

EFV Panel runs a VLESS + Trojan proxy directly on a Cloudflare Worker (free tier works),
with a management panel, per-client subscription links and QR codes.

> **Lineage & license**: EFV Panel is a rework of [BPB-Worker-Panel](https://github.com/bia-pain-bache/BPB-Worker-Panel)
> by [bia-pain-bache](https://github.com/bia-pain-bache) (GPL-3.0). The proxy/protocol core and
> subscription generators are ported from BPB; the panel UI/UX, auth flow, and settings
> handling are a fresh implementation. Both projects are GPL-3.0 — see [LICENSE](./LICENSE).

## ✨ Features

- **VLESS + Trojan over WebSocket** — works behind Cloudflare CDN, TLS via your domain
- **Beautiful dark/light UI** — EN/FA (فارسی, RTL), mobile-first, no external assets
- **Subscription links** for v2rayNG, Xray, sing-box, Clash/Clash Meta, Stash, FlClash, Hiddify…
- **Fragment mode** configs for censorship resistance
- **Full routing control** — Iran/China/Russia bypass lists, ad/malware blocking, custom rules
- **QR codes** for every subscription link
- **JWT auth** with first-run password setup; everything stored in Workers KV

## 🚀 Deploy

1. Install [Node.js](https://nodejs.org) 20+ and `npm install`
2. `npm run build` → produces `dist/worker.js`
3. Create a KV namespace: `wrangler kv namespace create kv`
4. Edit `wrangler.toml` — set the KV `id`
5. Deploy: `wrangler deploy` (or paste `dist/worker.js` in the Cloudflare dashboard)
6. Bind your domain (workers route) to the worker

**First run:** open `https://your-domain/<securePath>/login` — the panel prints your
secure path in the worker logs; the first visit sets your admin password.

> **Getting the secure path**: check `wrangler tail` output after deploy — the seeded
> `embeddedSettings` (with `securePath`, VLESS UUID, Trojan password) is written to KV on
> first request and logged.

## 🧪 Local development

```bash
npm run check      # TypeScript typecheck
npm run build      # build dist/worker.js
npm test           # full smoke suite via Miniflare (19 checks)
npm run dev:ui     # panel UI with mocked API at http://localhost:58912/efvdemo/panel
```

## 🏗️ Structure

```
src/
├── worker.ts          # entry: routing (/{securePath}/panel|login|sub|qrcode)
├── handlers/          # panel API, login, subscriptions, QR, error pages, WS dispatch
├── protocols/         # VLESS & Trojan over WS (ported from BPB)
├── cores/             # subscription generators: xray / sing-box / clash (+fragment)
├── settings/          # KV-backed settings, defaults, validation
├── auth/              # JWT (jose) auth
├── common/            # shared utils
└── assets/            # panel + login UI (vanilla HTML/CSS/JS, EN/FA i18n)
```

## ⚖️ License

GPL-3.0 — see [LICENSE](./LICENSE).
Portions © [BPB-Worker-Panel contributors](https://github.com/bia-pain-bache/BPB-Worker-Panel) (GPL-3.0).
