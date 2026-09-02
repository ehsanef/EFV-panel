/* EFV Panel — panel logic
   Vanilla JS, no deps. Spec-driven settings forms, EN/FA i18n, dark/light themes. */
(function () {
    'use strict';

    /* ---------------- i18n ---------------- */

    var I18N = {
        en: {
            loading: 'Loading…', logout: 'Sign out', unsaved: 'Unsaved changes',
            save: 'Save', defaults: 'Defaults', saved_ok: 'Settings saved ✓',
            save_err: 'Save failed', copied: 'Copied to clipboard', copy_fail: 'Copy failed',
            nav_home: 'Home', nav_subs: 'Subscriptions', nav_proxy: 'Proxy', nav_fragment: 'Fragment',
            nav_dns: 'DNS', nav_routing: 'Routing', nav_cdn: 'CDN & IPs', nav_warp: 'WARP',
            nav_custom: 'Custom', nav_danger: 'Danger Zone',
            home_title: 'Home', home_desc: 'Panel status and connection info',
            subs_title: 'Subscriptions', subs_desc: 'Per-client subscription links with QR codes',
            proxy_title: 'Proxy', proxy_desc: 'Protocols, ports, fingerprint and transport',
            frag_title: 'Fragment', frag_desc: 'TLS fragmentation to bypass DPI',
            dns_title: 'DNS', dns_desc: 'DNS servers and fake DNS',
            route_title: 'Routing', route_desc: 'Bypass and block rules',
            cdn_title: 'CDN & IPs', cdn_desc: 'Clean IPs, custom CDN and endpoints',
            warp_title: 'WARP', warp_desc: 'Cloudflare WARP routing',
            custom_title: 'Custom', custom_desc: 'Custom configs and subscriptions',
            danger_title: 'Danger Zone', danger_desc: 'Irreversible operations',
            my_ip: 'My IP', about: 'About', uuid: 'VLESS UUID', trpass: 'Trojan password',
            reset_defaults: 'Defaults',
            sub_v2ray: 'V2Ray / V2RayNG', sub_v2ray_apps: 'v2rayNG · Nekoray · V2Box · Streisand · FPVBox',
            sub_v2rayjson: 'V2Ray JSON', sub_v2rayjson_apps: 'Custom clients (JSON)',
            sub_xray: 'Xray', sub_xray_apps: 'v2rayN · Xray family',
            sub_singbox: 'sing-box', sub_singbox_apps: 'sing-box · Hiddify · SFI/SFM/SFT',
            sub_clash: 'Clash', sub_clash_apps: 'Clash legacy',
            sub_clashmeta: 'Clash Meta', sub_clashmeta_apps: 'Clash Meta · Stash · FlClash',
            frag_variant: 'Fragmented', copy: 'Copy', qr: 'QR', qr_for: 'Scan in your client app',
            reset_title: 'Reset all settings', reset_desc: 'Restore every setting to its default value',
            reset_btn: 'Reset…', pw_title: 'Change panel password', pw_desc: 'Set a new login password',
            pw_new: 'New password', pw_btn: 'Update password', pw_ok: 'Password updated ✓',
            confirm_reset: 'Reset ALL settings to defaults? This cannot be undone.',
            protocols: 'Enabled protocols', protocols_desc: 'vless, trojan — comma separated',
            ports: 'Ports', ports_desc: 'Comma-separated list of working ports',
            fingerprint: 'Fingerprint', bestping: 'Best-ping interval (s)',
            ipv6: 'Enable IPv6', ipv6_d: 'Add IPv6 addresses to configs',
            lan: 'Allow LAN connections', lan_d: 'Route LAN/private IPs through proxy',
            tfo: 'TCP Fast Open', tfo_d: 'Enable TFO in xray/sing-box configs',
            loglevel: 'Log level', frag_mode: 'Fragment mode', frag_mode_none: 'disabled',
            frag_len: 'Fragment length (min / max)', frag_delay: 'Fragment delay (ms min / max)',
            frag_packets: 'Fragment packets', frag_split: 'Max split (min / max)',
            frag_off: 'Fragmentation is off — enable it in Fragment mode to see fragmented sub links',
            localdns: 'Local DNS', localdns_desc: 'Resolved locally, Geosite:private etc.',
            antidns: 'Anti-sanction DNS', remotedns: 'Remote DNS',
            fakedns: 'Fake DNS', fakedns_d: 'Use fake DNS in sing-box configs',
            cleanips: 'Clean IPs', cleanips_d: 'One per line or comma-separated',
            cdnaddrs: 'Custom CDN addresses', cdnhost: 'Custom CDN host', cdnsni: 'Custom CDN SNI',
            ech: 'Encrypted Client Hello (ECH)', echsni: 'ECH server name',
            bypass: 'Bypass rules', bypass_desc: 'Traffic to these goes direct (not proxied)',
            block: 'Block rules', block_desc: 'Traffic to these is blocked',
            bypass_geo: 'Geo bypass', block_lists: 'Block lists',
            ir_bypass: 'Bypass Iranian sites', cn_bypass: 'Bypass Chinese sites',
            ru_bypass: 'Bypass Russian sites', openai_bypass: 'Bypass OpenAI',
            googleai_bypass: 'Bypass Google AI', ms_bypass: 'Bypass Microsoft',
            oracle_bypass: 'Bypass Oracle', docker_bypass: 'Bypass Docker registries',
            adobe_bypass: 'Bypass Adobe', epic_bypass: 'Bypass Epic Games',
            intel_bypass: 'Bypass Intel', amd_bypass: 'Bypass AMD',
            nvidia_bypass: 'Bypass NVIDIA', asus_bypass: 'Bypass ASUS',
            hp_bypass: 'Bypass HP', lenovo_bypass: 'Bypass Lenovo',
            blockads: 'Block ads', blockporn: 'Block porn', blockudp443: 'Block QUIC (UDP 443)',
            blockmalware: 'Block malware', blockphishing: 'Block phishing',
            blockcrypto: 'Block cryptominers',
            custom_bypass: 'Custom bypass rules', custom_block: 'Custom block rules',
            custom_sanction: 'Custom sanction bypass rules',
            warpdns: 'WARP DNS', warpendpoints: 'WARP endpoints',
            warpping: 'WARP best-ping interval (s)', warpres: 'WARP reserved bytes',
            customsubs: 'Custom subscription links', customsubs_d: 'Extra sub URLs merged into configs',
            customconfigs: 'Custom config links', customconfigs_d: 'Extra vless/trojan/ss/... URIs merged into configs',
            add: 'Add', theme_light: 'Light theme', theme_dark: 'Dark theme',
            version: 'Version', err_load: 'Failed to load settings', err_401: 'Session expired — redirecting to login'
        },
        fa: {
            loading: 'در حال بارگذاری…', logout: 'خروج', unsaved: 'تغییرات ذخیره نشده',
            save: 'ذخیره', defaults: 'پیش‌فرض‌ها', saved_ok: 'تنظیمات ذخیره شد ✓',
            save_err: 'ذخیره ناموفق بود', copied: 'کپی شد', copy_fail: 'کپی ناموفق بود',
            nav_home: 'خانه', nav_subs: 'اشتراک‌ها', nav_proxy: 'پروکسی', nav_fragment: 'فرگمنت',
            nav_dns: 'دی‌ان‌اس', nav_routing: 'مسیریابی', nav_cdn: 'CDN و آی‌پی‌ها', nav_warp: 'وارپ',
            nav_custom: 'سفارشی', nav_danger: 'منطقه خطر',
            home_title: 'خانه', home_desc: 'وضعیت پنل و اطلاعات اتصال',
            subs_title: 'اشتراک‌ها', subs_desc: 'لینک‌های اشتراک هر کلاینت با کد QR',
            proxy_title: 'پروکسی', proxy_desc: 'پروتکل‌ها، پورت‌ها، اثر انگشت و ترنسپورت',
            frag_title: 'فرگمنت', frag_desc: 'فرگمنت‌سازی TLS برای عبور از DPI',
            dns_title: 'دی‌ان‌اس', dns_desc: 'سرورهای DNS و Fake DNS',
            route_title: 'مسیریابی', route_desc: 'قوانین عبور و مسدودسازی',
            cdn_title: 'CDN و آی‌پی‌ها', cdn_desc: 'آی‌پی‌های تمیز، CDN سفارشی و اندپوینت‌ها',
            warp_title: 'وارپ', warp_desc: 'مسیریابی Cloudflare WARP',
            custom_title: 'سفارشی', custom_desc: 'کانفیگ‌ها و اشتراک‌های سفارشی',
            danger_title: 'منطقه خطر', danger_desc: 'عملیات برگشت‌ناپذیر',
            my_ip: 'آی‌پی من', about: 'درباره', uuid: 'یوآیدی VLESS', trpass: 'رمز تروجان',
            reset_defaults: 'پیش‌فرض‌ها',
            sub_v2ray: 'V2Ray / V2RayNG', sub_v2ray_apps: 'v2rayNG · Nekoray · V2Box · Streisand · FPVBox',
            sub_v2rayjson: 'V2Ray JSON', sub_v2rayjson_apps: 'کلاینت‌های سفارشی (JSON)',
            sub_xray: 'Xray', sub_xray_apps: 'v2rayN · خانواده Xray',
            sub_singbox: 'sing-box', sub_singbox_apps: 'sing-box · Hiddify · SFI/SFM/SFT',
            sub_clash: 'Clash', sub_clash_apps: 'کلس کلاسیک',
            sub_clashmeta: 'Clash Meta', sub_clashmeta_apps: 'Clash Meta · Stash · FlClash',
            frag_variant: 'فرگمنت‌شده', copy: 'کپی', qr: 'QR', qr_for: 'در اپ کلاینت اسکن کنید',
            reset_title: 'بازنشانی همه تنظیمات', reset_desc: 'بازگرداندن همه تنظیمات به حالت پیش‌فرض',
            reset_btn: 'بازنشانی…', pw_title: 'تغییر رمز پنل', pw_desc: 'تنظیم رمز ورود جدید',
            pw_new: 'رمز جدید', pw_btn: 'به‌روزرسانی رمز', pw_ok: 'رمز به‌روزرسانی شد ✓',
            confirm_reset: 'همه تنظیمات به پیش‌فرض برگردد؟ این کار قابل بازگشت نیست.',
            protocols: 'پروتکل‌های فعال', protocols_desc: 'vless، trojan — با کاما جدا کنید',
            ports: 'پورت‌ها', ports_desc: 'لیست پورت‌های سالم با کاما',
            fingerprint: 'اثر انگشت', bestping: 'بازه بهترین پینگ (ثانیه)',
            ipv6: 'فعال‌سازی IPv6', ipv6_d: 'افزودن آدرس IPv6 به کانفیگ‌ها',
            lan: 'اجازه اتصال LAN', lan_d: 'عبور IPهای محلی/خصوصی از پروکسی',
            tfo: 'TCP Fast Open', tfo_d: 'فعال‌سازی TFO در کانفیگ‌های xray/sing-box',
            loglevel: 'سطح لاگ', frag_mode: 'حالت فرگمنت', frag_mode_none: 'خاموش',
            frag_len: 'طول فرگمنت (کم / زیاد)', frag_delay: 'تأخیر فرگمنت (میلی‌ثانیه کم / زیاد)',
            frag_packets: 'بسته‌های فرگمنت', frag_split: 'حداکثر اسپلیت (کم / زیاد)',
            frag_off: 'فرگمنت خاموش است — در بخش فرگمنت فعالش کنید تا لینک فرگمنت‌شده دیده شود',
            localdns: 'DNS محلی', localdns_desc: 'به‌صورت محلی حل می‌شود، Geosite:private و…',
            antidns: 'DNS ضدتحریم', remotedns: 'DNS از راه دور',
            fakedns: 'Fake DNS', fakedns_d: 'استفاده از Fake DNS در کانفیگ‌های sing-box',
            cleanips: 'آی‌پی‌های تمیز', cleanips_desc: 'هر خط یک آی‌پی یا با کاما',
            cdnaddrs: 'آدرس‌های CDN سفارشی', cdnhost: 'هاست CDN سفارشی', cdnsni: 'SNI سفارشی CDN',
            ech: 'ECH (رمزنگاری Client Hello)', echsni: 'نام سرور ECH',
            bypass: 'قوانین عبور', bypass_desc: 'ترافیک این‌ها مستقیم می‌رود (بدون پروکسی)',
            block: 'قوانین مسدودسازی', block_desc: 'ترافیک این‌ها مسدود می‌شود',
            bypass_geo: 'عبور جغرافیایی', block_lists: 'لیست‌های مسدودسازی',
            ir_bypass: 'عبور سایت‌های ایرانی', cn_bypass: 'عبور سایت‌های چینی',
            ru_bypass: 'عبور سایت‌های روسی', openai_bypass: 'عبور OpenAI',
            googleai_bypass: 'عبور Google AI', ms_bypass: 'عبور مایکروسافت',
            oracle_bypass: 'عبور Oracle', docker_bypass: 'عبور رجیستری‌های Docker',
            adobe_bypass: 'عبور Adobe', epic_bypass: 'عبور Epic Games',
            intel_bypass: 'عبور Intel', amd_bypass: 'عبور AMD',
            nvidia_bypass: 'عبور NVIDIA', asus_bypass: 'عبور ASUS',
            hp_bypass: 'عبور HP', lenovo_bypass: 'عبور Lenovo',
            blockads: 'مسدودسازی تبلیغات', blockporn: 'مسدودسازی محتوای بزرگسال',
            blockudp443: 'مسدودسازی QUIC (UDP 443)',
            blockmalware: 'مسدودسازی بدافزار', blockphishing: 'مسدودسازی فیشینگ',
            blockcrypto: 'مسدودسازی ماینرهای رمزارز',
            custom_bypass: 'قوانین عبور سفارشی', custom_block: 'قوانین مسدودسازی سفارشی',
            custom_sanction: 'قوانین عبور ضدتحریم سفارشی',
            warpdns: 'DNS وارپ', warpendpoints: 'اندپوینت‌های وارپ',
            warpping: 'بازه بهترین پینگ وارپ (ثانیه)', warpres: 'بایت‌های رزرو وارپ',
            customsubs: 'لینک‌های اشتراک سفارشی', customsubs_d: 'لینک‌های ساب اضافه که به کانفیگ‌ها اضافه می‌شوند',
            customconfigs: 'لینک‌های کانفیگ سفارشی', customconfigs_d: 'URIهای vless/trojan/ss و… اضافه',
            add: 'افزودن', theme_light: 'تم روشن', theme_dark: 'تم تیره',
            version: 'نسخه', err_load: 'بارگذاری تنظیمات ناموفق بود', err_401: 'نشست منقضی شد — در حال هدایت به ورود'
        }
    };

    /* ---------------- state ---------------- */

    var settings = null;
    var lang = localStorage.getItem('efv-lang') || 'en';
    var theme = localStorage.getItem('efv-theme') || 'dark';
    var dirty = false;
    var saving = false;

    function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key; }

    /* ---------------- tiny DOM helpers ---------------- */

    function el(tag, cls, html) {
        var node = document.createElement(tag);
        if (cls) node.className = cls;
        if (html != null) node.innerHTML = html;
        return node;
    }

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    /* ---------------- toasts ---------------- */

    function toast(msg, isErr) {
        var box = document.getElementById('toasts');
        var item = el('div', 'toast' + (isErr ? ' err' : ''));
        item.innerHTML = '<span class="t-ico">' + (isErr ? '✕' : '✓') + '</span><span></span>';
        item.lastChild.textContent = msg;
        box.appendChild(item);
        setTimeout(function () { item.classList.add('out'); }, 2600);
        setTimeout(function () { item.remove(); }, 3000);
    }

    /* ---------------- dirty tracking ---------------- */

    function markDirty() {
        dirty = true;
        document.getElementById('savebar').hidden = false;
    }

    function clearDirty() {
        dirty = false;
        document.getElementById('savebar').hidden = true;
    }

    /* ---------------- form builders ---------------- */

    function field(labelTxt, descTxt, inner) {
        var f = el('div', 'field');
        var lab = el('label', null, esc(labelTxt));
        f.appendChild(lab);
        if (descTxt) f.appendChild(el('span', 'desc', esc(descTxt)));
        f.appendChild(inner);
        return f;
    }

    function textInput(key, mono) {
        var input = document.createElement('input');
        input.type = 'text';
        input.className = mono ? 'mono' : '';
        input.value = getVal(key, '');
        input.addEventListener('input', function () { setVal(key, input.value); markDirty(); });
        return input;
    }

    function numInput(key, min, max) {
        var input = document.createElement('input');
        input.type = 'number';
        if (min != null) input.min = min;
        if (max != null) input.max = max;
        input.value = getVal(key, 0);
        input.addEventListener('input', function () { setVal(key, Number(input.value) || 0); markDirty(); });
        return input;
    }

    function selectInput(key, options) {
        var sel = document.createElement('select');
        options.forEach(function (opt) {
            var o = document.createElement('option');
            o.value = opt.v; o.textContent = opt.l;
            sel.appendChild(o);
        });
        sel.value = getVal(key, options[0].v);
        sel.addEventListener('change', function () { setVal(key, sel.value); markDirty(); });
        return sel;
    }

    function toggle(labelTxt, key, descTxt) {
        var row = el('div', 'toggle-row');
        var lab = el('div', 't-label');
        lab.appendChild(el('span', null, esc(labelTxt)));
        if (descTxt) lab.appendChild(el('small', null, esc(descTxt)));
        var sw = el('label', 'switch');
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!getVal(key, false);
        input.addEventListener('change', function () { setVal(key, input.checked); markDirty(); });
        sw.appendChild(input);
        sw.appendChild(el('span', 'knob'));
        row.appendChild(lab);
        row.appendChild(sw);
        return row;
    }

    function listInput(key, labelTxt, descTxt, placeholder) {
        var wrap = el('div', 'field');
        wrap.appendChild(el('label', null, esc(labelTxt)));
        if (descTxt) wrap.appendChild(el('span', 'desc', esc(descTxt)));
        var chips = el('div', 'chip-list');
        var values = getVal(key, []);

        function render() {
            chips.innerHTML = '';
            values.forEach(function (v, i) {
                var chip = el('span', 'chip');
                chip.appendChild(document.createTextNode(v));
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = '×';
                btn.setAttribute('aria-label', 'remove');
                btn.addEventListener('click', function () {
                    values.splice(i, 1);
                    setVal(key, values.slice());
                    markDirty();
                    render();
                });
                chip.appendChild(btn);
                chips.appendChild(chip);
            });
        }

        var addRow = el('div', 'chip-add');
        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholder || '';
        var addBtn = el('button', 'btn', esc(t('add')));
        addBtn.type = 'button';
        function add() {
            var v = input.value.trim();
            if (!v) return;
            values.push(v);
            setVal(key, values.slice());
            input.value = '';
            markDirty();
            render();
        }
        addBtn.addEventListener('click', add);
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } });
        addRow.appendChild(input);
        addRow.appendChild(addBtn);
        render();
        wrap.appendChild(chips);
        wrap.appendChild(addRow);
        return wrap;
    }

    function getVal(path, fallback) {
        var parts = path.split('.');
        var cur = settings;
        for (var i = 0; i < parts.length; i++) {
            if (cur == null || cur[parts[i]] == null) return fallback;
            cur = cur[parts[i]];
        }
        return cur;
    }

    function setVal(path, value) {
        var parts = path.split('.');
        var cur = settings;
        for (var i = 0; i < parts.length - 1; i++) {
            if (cur[parts[i]] == null) cur[parts[i]] = {};
            cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = value;
    }

    function card(titleTxt, hintTxt) {
        var c = el('div', 'card');
        if (titleTxt) c.appendChild(el('h3', null, esc(titleTxt)));
        if (hintTxt) c.appendChild(el('p', 'hint', esc(hintTxt)));
        return c;
    }

    /* ---------------- sections ---------------- */

    var main;

    function sectionHead(titleKey, descKey) {
        var head = el('div', 'section-head');
        head.appendChild(el('h1', null, esc(t(titleKey))));
        head.appendChild(el('p', null, esc(t(descKey))));
        return head;
    }

    function renderHome(section) {
        section.appendChild(sectionHead('home_title', 'home_desc'));

        var c = card(t('about'));
        var rows = [
            [t('version'), 'v' + getVal('panelVersion', window.__VERSION__ || '')],
            [t('uuid'), getVal('vlUUID', '—')],
            [t('trpass'), getVal('trPass', '—')]
        ];
        rows.forEach(function (r) {
            var row = el('div', 'toggle-row');
            var lab = el('div', 't-label');
            lab.appendChild(el('span', null, esc(r[0])));
            row.appendChild(lab);
            var val = el('span', 'mono', '');
            val.textContent = r[1];
            val.style.cssText = 'word-break:break-all;text-align:end;color:var(--accent)';
            row.appendChild(val);
            c.appendChild(row);
        });
        section.appendChild(c);

        var c2 = card(t('my_ip'));
        c2.appendChild(el('p', 'hint mono', esc('…')));
        fetch('./panel/my-ip', { credentials: 'same-origin' })
            .then(function (r) { return r.ok ? r.text() : '?'; })
            .then(function (ip) { c2.querySelector('.hint').textContent = ip.trim(); })
            .catch(function () { c2.querySelector('.hint').textContent = '—'; });
        section.appendChild(c2);
    }

    function subCard(titleKey, appsKey, path, isFrag) {
        var base = location.origin + '/' + location.pathname.split('/')[1];
        var url = base + path + (isFrag ? '?mode=fragment' : '');
        var cardEl = el('div', 'sub-card');
        cardEl.appendChild(el('div', 's-name', esc(t(titleKey)) + (isFrag ? ' · ' + esc(t('frag_variant')) : '')));
        cardEl.appendChild(el('div', 's-apps', esc(t(appsKey))));
        var row = el('div', 'sub-url-row');
        var urlBox = el('div', 'url mono');
        urlBox.textContent = url;
        row.appendChild(urlBox);
        cardEl.appendChild(row);
        var actions = el('div', 'sub-actions');
        var copyBtn = el('button', 'btn', esc(t('copy')));
        copyBtn.type = 'button';
        copyBtn.addEventListener('click', function () { copyText(url); });
        var qrBtn = el('button', 'btn primary', esc(t('qr')));
        qrBtn.type = 'button';
        qrBtn.addEventListener('click', function () { showQR(t(titleKey), url); });
        actions.appendChild(copyBtn);
        actions.appendChild(qrBtn);
        cardEl.appendChild(actions);
        return cardEl;
    }

    function renderSubs(section) {
        section.appendChild(sectionHead('subs_title', 'subs_desc'));

        var grid = el('div', 'sub-grid');
        grid.appendChild(subCard('sub_v2ray', 'sub_v2ray_apps', '/sub/v2ray', false));
        grid.appendChild(subCard('sub_xray', 'sub_xray_apps', '/sub/xray', false));
        grid.appendChild(subCard('sub_singbox', 'sub_singbox_apps', '/sub/singbox', false));
        grid.appendChild(subCard('sub_clash', 'sub_clash_apps', '/sub/clash', false));
        grid.appendChild(subCard('sub_clashmeta', 'sub_clashmeta_apps', '/sub/clash-meta', false));
        grid.appendChild(subCard('sub_v2rayjson', 'sub_v2rayjson_apps', '/sub/v2ray-json', false));

        var fragOn = getVal('fragmentMode', 'none') && getVal('fragmentMode', 'none') !== 'none';
        if (fragOn) {
            grid.appendChild(subCard('sub_v2ray', 'sub_v2ray_apps', '/sub/v2ray', true));
            grid.appendChild(subCard('sub_xray', 'sub_xray_apps', '/sub/xray', true));
        } else {
            var note = el('div', 'card');
            note.style.gridColumn = '1/-1';
            note.appendChild(el('p', 'hint', esc(t('frag_off'))));
            grid.appendChild(note);
        }
        section.appendChild(grid);
    }

    function renderProxy(section) {
        section.appendChild(sectionHead('proxy_title', 'proxy_desc'));

        var c = card(t('protocols'), t('protocols_desc'));
        c.appendChild(field(t('protocols'), '', textInput('protocols', true)));
        c.appendChild(field(t('ports'), t('ports_desc'), portsInput()));
        section.appendChild(c);

        var c2 = card('Transport');
        var g = el('div', 'grid-2');
        var f1 = field(t('fingerprint'), '', selectInput('fingerprint', [
            { v: 'chrome', l: 'chrome' }, { v: 'firefox', l: 'firefox' }, { v: 'safari', l: 'safari' },
            { v: 'ios', l: 'ios' }, { v: 'android', l: 'android' }, { v: 'edge', l: 'edge' },
            { v: '360', l: '360' }, { v: 'qq', l: 'qq' }, { v: 'random', l: 'random' }, { v: 'randomized', l: 'randomized' }
        ]));
        var f2 = field(t('bestping'), '', numInput('bestPingInterval', 1, 600));
        g.appendChild(f1); g.appendChild(f2);
        c2.appendChild(g);
        c2.appendChild(toggle(t('ipv6'), 'enableIPv6', t('ipv6_d')));
        c2.appendChild(toggle(t('lan'), 'allowLANConnection', t('lan_d')));
        c2.appendChild(toggle(t('tfo'), 'enableTFO', t('tfo_d')));
        c2.appendChild(field(t('loglevel'), '', selectInput('logLevel', [
            { v: 'none', l: 'none' }, { v: 'warning', l: 'warning' }, { v: 'error', l: 'error' },
            { v: 'info', l: 'info' }, { v: 'debug', l: 'debug' }
        ])));
        section.appendChild(c2);
    }

    function portsInput() {
        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'mono';
        input.value = (getVal('ports', []) || []).join(', ');
        input.addEventListener('input', function () {
            setVal('ports', input.value.split(',').map(function (s) { return Number(s.trim()); }).filter(function (n) { return n > 0; }));
            markDirty();
        });
        return input;
    }

    function renderFragment(section) {
        section.appendChild(sectionHead('frag_title', 'frag_desc'));

        var c = card(t('frag_mode'));
        c.appendChild(field(t('frag_mode'), '', selectInput('fragmentMode', [
            { v: 'none', l: t('frag_mode_none') },
            { v: 'low', l: 'low' }, { v: 'medium', l: 'medium' }, { v: 'high', l: 'high' }, { v: 'custom', l: 'custom' }
        ])));

        var g = el('div', 'grid-2');
        var g1 = el('div', 'grid-2');
        g1.appendChild(field('length min', '', numInput('fragmentLengthMin', 1, 500)));
        g1.appendChild(field('length max', '', numInput('fragmentLengthMax', 1, 500)));
        var g2 = el('div', 'grid-2');
        g2.appendChild(field('delay min (ms)', '', numInput('fragmentDelayMin', 0, 500)));
        g2.appendChild(field('delay max (ms)', '', numInput('fragmentDelayMax', 0, 500)));
        g.appendChild(g1); g.appendChild(g2);
        c.appendChild(g);

        var g3 = el('div', 'grid-2');
        g3.appendChild(field(t('frag_packets'), '', selectInput('fragmentPackets', [
            { v: 'tlshello', l: 'tlshello' }, { v: '1-1', l: '1-1' }, { v: '1-2', l: '1-2' },
            { v: '1-3', l: '1-3' }, { v: '1-5', l: '1-5' }
        ])));
        var g4 = el('div', 'grid-2');
        g4.appendChild(field('split min', '', numInput('fragmentMaxSplitMin', 0, 100)));
        g4.appendChild(field('split max', '', numInput('fragmentMaxSplitMax', 0, 100)));
        g3.appendChild(g4);
        c.appendChild(g3);
        section.appendChild(c);
    }

    function renderDNS(section) {
        section.appendChild(sectionHead('dns_title', 'dns_desc'));

        var c = card('DNS');
        var g = el('div', 'grid-2');
        g.appendChild(field(t('localdns'), t('localdns_desc'), textInput('localDNS', true)));
        g.appendChild(field(t('antidns'), '', textInput('antiSanctionDNS', true)));
        g.appendChild(field(t('remotedns'), '', textInput('remoteDNS', true)));
        c.appendChild(g);
        c.appendChild(toggle(t('fakedns'), 'fakeDNS', t('fakedns_d')));
        section.appendChild(c);
    }

    function renderRouting(section) {
        section.appendChild(sectionHead('route_title', 'route_desc'));

        var c = card(t('bypass_geo'), t('bypass_desc'));
        [['ir_bypass', 'bypassIran'], ['cn_bypass', 'bypassChina'], ['ru_bypass', 'bypassRussia'],
         ['openai_bypass', 'bypassOpenAi'], ['googleai_bypass', 'bypassGoogleAi'], ['ms_bypass', 'bypassMicrosoft'],
         ['oracle_bypass', 'bypassOracle'], ['docker_bypass', 'bypassDocker'], ['adobe_bypass', 'bypassAdobe'],
         ['epic_bypass', 'bypassEpicGames'], ['intel_bypass', 'bypassIntel'], ['amd_bypass', 'bypassAmd'],
         ['nvidia_bypass', 'bypassNvidia'], ['asus_bypass', 'bypassAsus'], ['hp_bypass', 'bypassHp'],
         ['lenovo_bypass', 'bypassLenovo']
        ].forEach(function (pair) { c.appendChild(toggle(t(pair[0]), pair[1])); });
        section.appendChild(c);

        var c2 = card(t('block_lists'), t('block_desc'));
        [['blockads', 'blockAds'], ['blockporn', 'blockPorn'], ['blockudp443', 'blockUDP443'],
         ['blockmalware', 'blockMalware'], ['blockphishing', 'blockPhishing'], ['blockcrypto', 'blockCryptominers']
        ].forEach(function (pair) { c2.appendChild(toggle(t(pair[0]), pair[1])); });
        section.appendChild(c2);

        var c3 = card(t('custom_bypass'));
        c3.appendChild(listInput('customBypassRules', t('custom_bypass'), t('bypass_desc'), 'domain:example.com'));
        section.appendChild(c3);

        var c4 = card(t('custom_block'));
        c4.appendChild(listInput('customBlockRules', t('custom_block'), t('block_desc'), 'domain:ads.example.com'));
        section.appendChild(c4);

        var c5 = card(t('custom_sanction'));
        c5.appendChild(listInput('customBypassSanctionRules', t('custom_sanction'), '', 'domain:example.com'));
        section.appendChild(c5);
    }

    function renderCDN(section) {
        section.appendChild(sectionHead('cdn_title', 'cdn_desc'));

        var c = card(t('cleanips'), t('cleanips_desc'));
        c.appendChild(listInput('cleanIPs', t('cleanips'), '', '104.17.x.x'));
        section.appendChild(c);

        var c2 = card('Custom CDN');
        c2.appendChild(listInput('customCdnAddrs', t('cdnaddrs'), '', '104.16.0.1'));
        var g = el('div', 'grid-2');
        g.appendChild(field(t('cdnhost'), '', textInput('customCdnHost', true)));
        g.appendChild(field(t('cdnsni'), '', textInput('customCdnSni', true)));
        c2.appendChild(g);
        section.appendChild(c2);

        var c3 = card('ECH');
        c3.appendChild(toggle(t('ech'), 'enableECH'));
        c3.appendChild(field(t('echsni'), '', textInput('echServerName', true)));
        section.appendChild(c3);
    }

    function renderWARP(section) {
        section.appendChild(sectionHead('warp_title', 'warp_desc'));

        var c = card('WARP');
        c.appendChild(field(t('warpdns'), '', textInput('warpRemoteDNS', true)));
        c.appendChild(listInput('warpEndpoints', t('warpendpoints'), '', 'engage.cloudflareclient.com:2408'));
        var g = el('div', 'grid-2');
        g.appendChild(field(t('warpping'), '', numInput('warpBestPingInterval', 1, 600)));
        c.appendChild(g);
        c.appendChild(toggle(t('warpres'), 'warpReservedBytes'));
        section.appendChild(c);
    }

    function renderCustom(section) {
        section.appendChild(sectionHead('custom_title', 'custom_desc'));

        var c = card(t('customconfigs'), t('customconfigs_d'));
        c.appendChild(listInput('customConfigs', t('customconfigs'), '', 'vless://…'));
        section.appendChild(c);

        var c2 = card(t('customsubs'), t('customsubs_d'));
        c2.appendChild(listInput('customSubs', t('customsubs'), '', 'https://…'));
        section.appendChild(c2);
    }

    function renderDanger(section) {
        section.appendChild(sectionHead('danger_title', 'danger_desc'));

        var grid = el('div', 'danger-grid');

        var resetItem = el('div', 'danger-item');
        var rl = el('div', 'd-label');
        rl.appendChild(el('span', null, esc(t('reset_title'))));
        rl.appendChild(el('small', null, esc(t('reset_desc'))));
        var resetBtn = el('button', 'btn danger', esc(t('reset_btn')));
        resetBtn.type = 'button';
        resetBtn.addEventListener('click', function () {
            if (!confirm(t('confirm_reset'))) return;
            fetch('./panel/reset-settings', { method: 'POST', credentials: 'same-origin' })
                .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
                .then(function () { clearDirty(); return load(); })
                .then(function () { toast(t('saved_ok')); })
                .catch(function () { toast(t('save_err'), true); });
        });
        resetItem.appendChild(rl);
        resetItem.appendChild(resetBtn);
        grid.appendChild(resetItem);

        var pwItem = el('div', 'danger-item');
        var pl = el('div', 'd-label');
        pl.appendChild(el('span', null, esc(t('pw_title'))));
        pl.appendChild(el('small', null, esc(t('pw_desc'))));
        var pwRow = el('div', '');
        pwRow.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap';
        var pwInput = document.createElement('input');
        pwInput.type = 'password';
        pwInput.placeholder = t('pw_new');
        pwInput.style.width = '150px';
        var pwBtn = el('button', 'btn', esc(t('pw_btn')));
        pwBtn.type = 'button';
        pwBtn.addEventListener('click', function () {
            if (!pwInput.value) return;
            fetch('./panel/reset-password', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pwInput.value })
            })
                .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
                .then(function () { toast(t('pw_ok')); pwInput.value = ''; })
                .catch(function () { toast(t('save_err'), true); });
        });
        pwRow.appendChild(pwInput);
        pwRow.appendChild(pwBtn);
        pwItem.appendChild(pl);
        pwItem.appendChild(pwRow);
        grid.appendChild(pwItem);

        section.appendChild(grid);
    }

    var SECTION_RENDERERS = {
        home: renderHome, subs: renderSubs, proxy: renderProxy, fragment: renderFragment,
        dns: renderDNS, routing: renderRouting, cdn: renderCDN, warp: renderWARP,
        custom: renderCustom, danger: renderDanger
    };

    /* ---------------- QR modal ---------------- */

    function showQR(title, url) {
        var modal = document.getElementById('qrModal');
        document.getElementById('qrTitle').textContent = title;
        document.getElementById('qrImg').src = './qrcode?data=' + encodeURIComponent(url);
        document.getElementById('qrHint').textContent = url;
        modal.hidden = false;
    }

    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () { toast(t('copied')); }, function () { legacyCopy(text); });
        } else {
            legacyCopy(text);
        }
    }

    function legacyCopy(text) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        try {
            if (document.execCommand('copy')) toast(t('copied'));
            else toast(t('copy_fail'), true);
        } catch (e) {
            toast(t('copy_fail'), true);
        }
        ta.remove();
    }

    /* ---------------- render root ---------------- */

    function render() {
        main.innerHTML = '';
        Object.keys(SECTION_RENDERERS).forEach(function (name) {
            var s = el('section', 'section');
            s.id = 'section-' + name;
            SECTION_RENDERERS[name](s);
            main.appendChild(s);
        });
        var active = document.querySelector('.nav-item.active');
        activate(active ? active.dataset.section : 'home');
        applyI18nStatic();
    }

    function activate(name) {
        document.querySelectorAll('.section').forEach(function (s) {
            s.classList.toggle('visible', s.id === 'section-' + name);
        });
        document.querySelectorAll('.nav-item').forEach(function (b) {
            b.classList.toggle('active', b.dataset.section === name);
        });
        window.scrollTo({ top: 0 });
    }

    function applyI18nStatic() {
        document.querySelectorAll('[data-i18n]').forEach(function (node) {
            node.textContent = t(node.dataset.i18n);
        });
    }

    /* ---------------- load & save ---------------- */

    function load() {
        return fetch('./panel/settings?nocache=' + Date.now(), { credentials: 'same-origin', cache: 'no-store' })
            .then(function (r) {
                if (r.status === 401) { toast(t('err_401'), true); setTimeout(function () { location.href = './login'; }, 900); throw new Error('401'); }
                if (!r.ok) throw new Error('http ' + r.status);
                return r.json();
            })
            .then(function (data) {
                settings = data;
                render();
            })
            .catch(function (e) {
                if (e.message !== '401') {
                    main.innerHTML = '';
                    var b = el('div', 'boot');
                    b.appendChild(el('span', 'boot-pulse'));
                    b.appendChild(el('span', null, esc(t('err_load'))));
                    main.appendChild(b);
                }
            });
    }

    function save() {
        if (saving) return;
        saving = true;
        var saveBtn = document.getElementById('saveBtn');
        saveBtn.disabled = true;
        fetch('./panel/update-settings', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        })
            .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
            .then(function () {
                clearDirty();
                toast(t('saved_ok'));
                return load();
            })
            .catch(function () { toast(t('save_err'), true); })
            .then(function () { saving = false; saveBtn.disabled = false; });
    }

    /* ---------------- boot ---------------- */

    function applyTheme() {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('efv-theme', theme);
    }

    function applyLang() {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
        localStorage.setItem('efv-lang', lang);
        document.getElementById('langToggle').textContent = lang === 'fa' ? 'EN' : 'فارسی';
    }

    function bindUI() {
        main = document.getElementById('main');

        document.querySelectorAll('.nav-item').forEach(function (btn) {
            btn.addEventListener('click', function () {
                activate(btn.dataset.section);
                closeSidebar();
            });
        });

        document.getElementById('saveBtn').addEventListener('click', save);
        document.getElementById('resetBtn').addEventListener('click', function () {
            if (confirm(t('confirm_reset'))) {
                fetch('./panel/reset-settings', { method: 'POST', credentials: 'same-origin' })
                    .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
                    .then(function () { clearDirty(); return load(); })
                    .then(function () { toast(t('saved_ok')); })
                    .catch(function () { toast(t('save_err'), true); });
            }
        });

        document.getElementById('logoutBtn').addEventListener('click', function () {
            location.href = './panel/logout';
        });

        document.getElementById('themeToggle').addEventListener('click', function () {
            theme = theme === 'dark' ? 'light' : 'dark';
            applyTheme();
        });

        document.getElementById('langToggle').addEventListener('click', function () {
            lang = lang === 'en' ? 'fa' : 'en';
            applyLang();
            applyI18nStatic();
            render();
        });

        var modal = document.getElementById('qrModal');
        document.getElementById('qrClose').addEventListener('click', function () { modal.hidden = true; });
        modal.addEventListener('click', function (e) { if (e.target === modal) modal.hidden = true; });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.hidden = true; });

        var navToggle = document.getElementById('navToggle');
        var sidebar = document.getElementById('sidebar');
        var scrim = document.getElementById('scrim');
        function closeSidebar() {
            sidebar.classList.remove('open');
            scrim.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        navToggle.addEventListener('click', function () {
            var open = sidebar.classList.toggle('open');
            scrim.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', String(open));
        });
        scrim.addEventListener('click', closeSidebar);

        window.addEventListener('beforeunload', function (e) {
            if (dirty) { e.preventDefault(); e.returnValue = ''; }
        });

        fetch('./panel/my-ip', { credentials: 'same-origin' })
            .then(function (r) { return r.ok ? r.text() : '?'; })
            .then(function (ip) {
                document.getElementById('ipChip').textContent = 'IP ' + ip.trim();
            })
            .catch(function () { });
    }

    applyTheme();
    applyLang();
    bindUI();
    load();
})();
