/* EFV Login — vanilla JS, no deps. */
(function () {
    'use strict';

    var I18N = {
        en: {
            login_sub: 'Sign in to your panel',
            password: 'Password',
            login: 'Sign in',
            login_failed: 'Wrong password. Try again.',
            setup_sub: 'No password set yet — choose one now',
            setup_ok: 'Password saved — signing you in…',
            too_short: 'Password must be at least 4 characters.'
        },
        fa: {
            login_sub: 'وارد پنل خود شوید',
            password: 'رمز عبور',
            login: 'ورود',
            login_failed: 'رمز اشتباه است. دوباره تلاش کنید.',
            setup_sub: 'هنوز رمزی تنظیم نشده — الان یکی انتخاب کنید',
            setup_ok: 'رمز ذخیره شد — در حال ورود…',
            too_short: 'رمز باید حداقل ۴ کاراکتر باشد.'
        }
    };

    var lang = localStorage.getItem('efv-lang') || 'en';
    var theme = localStorage.getItem('efv-theme') || 'dark';

    function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key; }

    function $(id) { return document.getElementById(id); }

    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

    var isSetup = false;

    function applyI18n() {
        document.querySelectorAll('[data-i18n]').forEach(function (n) {
            n.textContent = t(n.dataset.i18n);
        });
    }

    function showError(msg) {
        var box = $('loginError');
        box.textContent = msg;
        box.classList.remove('show');
        void box.offsetWidth; /* restart shake animation */
        box.classList.add('show');
    }

    function toast(msg, isErr) {
        var item = document.createElement('div');
        item.className = 'toast' + (isErr ? ' err' : '');
        item.innerHTML = '<span class="t-ico">' + (isErr ? '✕' : '✓') + '</span><span></span>';
        item.lastChild.textContent = msg;
        $('toasts').appendChild(item);
        setTimeout(function () { item.classList.add('out'); }, 2600);
    }

    applyI18n();

    /* Probe whether this is first-run (no password set yet). */
    fetch('./login', { method: 'HEAD' })
        .then(function (r) {
            if (r.status === 204) { isSetup = true; }
            else if (r.status === 401) { isSetup = false; }
        })
        .catch(function () { });

    var form = $('loginForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var pw = $('pw').value;
        if (pw.length < 4) { showError(t('too_short')); return; }

        var btn = $('loginBtn');
        btn.disabled = true;

        fetch('./login', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: pw })
        })
            .then(function (r) {
                if (r.status === 204 || r.status === 200) return { ok: true, r: r };
                if (r.status === 401) throw new Error('bad');
                throw new Error('http ' + r.status);
            })
            .then(function (res) {
                if (isSetup) toast(t('setup_ok'));
                var target = new URLSearchParams(location.search).get('redirect');
                if (target && target.startsWith(location.pathname.replace(/[^/]*$/, ''))) {
                    location.href = target;
                } else {
                    location.href = './panel';
                }
            })
            .catch(function (e) {
                btn.disabled = false;
                $('pw').value = '';
                $('pw').focus();
                if (e.message === 'bad') { showError(t('login_failed')); }
                else { showError(t('login_failed')); }
            });
    });
})();
