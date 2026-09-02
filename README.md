# EFV Panel ⚡

<div align="center">

**A VLESS / Trojan proxy panel for Cloudflare Workers — with a fresh UI**

[![](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![](https://img.shields.io/badge/license-GPL--3.0-blue)](./LICENSE)

</div>

EFV Panel runs a VLESS + Trojan proxy directly on a Cloudflare Worker (free tier works), with a management panel, per-client subscription links and QR codes.

> **Lineage & license**: EFV Panel is a rework of [BPB-Worker-Panel](https://github.com/bia-pain-bache/BPB-Worker-Panel) by [bia-pain-bache](https://github.com/bia-pain-bache) (GPL-3.0). The proxy/protocol core and subscription generators are ported from BPB; the panel UI/UX, auth flow, and settings handling are a fresh implementation. Both projects are GPL-3.0 — see [LICENSE](./LICENSE).

## 🚀 Install (one click)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ehsanef/EFV-panel)

**Everything is automatic — you only log into your Cloudflare account:**

1. Click the button → **Authorize Workers Deploy** on the Cloudflare page that opens
2. Done — the button provisions the Worker + KV namespace, builds the project, and deploys it

Then open your worker URL: `https://efv-panel.<your-subdomain>.workers.dev`

On first visit you land on the **setup screen** — pick your admin password and the panel shows your **secret path** (`https://…/<random>/login`). Bookmark it: that's your permanent login URL.

- No CLI, no `npm install`, no `wrangler`, no config editing, no KV id pasting
- Optional: the deploy form offers `UUID` / `TR_PASS` fields if you want fixed credentials (leave empty = auto-generated)

## ⚙️ Manual deploy (CLI)

```bash
git clone https://github.com/ehsanef/EFV-panel
cd EFV-panel
npx wrangler deploy   # uses the committed dist/worker.js; KV auto-provisions (wrangler v4+)
```

Building from source instead: `npm install && npm run build` (requires Node 20+).

## ✨ Features

- **VLESS + Trojan over WebSocket** — works behind Cloudflare CDN, TLS via your domain
- **Beautiful dark/light UI** — EN/FA (فارسی, RTL), mobile-first, no external assets
- **Subscription links** for v2rayNG, Xray, sing-box, Clash/Clash Meta, Stash, FlClash, Hiddify…
- **Fragment mode** configs for censorship resistance
- **Full routing control** — Iran/China/Russia bypass lists, ad/malware blocking, custom rules
- **QR codes** for every subscription link
- **JWT auth** with first-run password setup; everything stored in Workers KV

## 🧪 Local development

```bash
npm run check      # TypeScript typecheck
npm run build      # build dist/worker.js
npm test           # full smoke suite via Miniflare
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
