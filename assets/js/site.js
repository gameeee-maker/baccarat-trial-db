(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('fx-js');
  var mqMobile = window.matchMedia('(max-width: 768px)');
  var mqCalm = window.matchMedia('(prefers-reduced-motion: reduce)');
  function animOK() { return mqMobile.matches && !mqCalm.matches; }

  // ---------- 手機版進場動態 ----------
  // 品牌卡片：每批進入畫面的卡片依序輕落；關於我按鈕淡入；試玩之前連結交錯滑入
  (function () {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.brand-card'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('.band-about, .safety-links'));
    cards.forEach(function (c, i) { c.style.setProperty('--r', (i % 2 ? 1 : -1) + 'deg'); });
    groups.forEach(function (g) {
      g.querySelectorAll(g.classList.contains('safety-links') ? '.safety-link' : '.fx-btn').forEach(function (el, i) { el.style.setProperty('--i', i); });
    });
    var all = cards.concat(groups);
    if (!('IntersectionObserver' in window) || !animOK()) { all.forEach(function (el) { el.classList.add('fx-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) { return e.isIntersecting; }).map(function (e) { return e.target; });
      batch.sort(function (a, b) { return a.compareDocumentPosition(b) & 4 ? -1 : 1; });
      var n = 0;
      batch.forEach(function (el) {
        if (el.classList.contains('brand-card')) el.style.setProperty('--i', n++);
        el.classList.add('fx-in'); io.unobserve(el);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    all.forEach(function (el) { io.observe(el); });
  })();

  // ---------- 補牌查詢工具 ----------
  (function () {
    var box = document.getElementById('draw-tool');
    if (!box) return;
    var selP = document.getElementById('dt-p'), selB = document.getElementById('dt-b'), selT = document.getElementById('dt-t');
    var out = document.getElementById('dt-result'), hint = document.getElementById('dt-hint');
    var NAME = { 1: 'A', 0: '10、J、Q、K' };
    function step(name, chip, cls, why) {
      return '<li class="dt-step is-new"><span class="dt-name">' + name + '</span><span class="dt-chip ' + cls + '">' + chip + '</span><span class="dt-why">' + why + '</span></li>';
    }
    function bankerRule(b, t) {
      if (b <= 2) return [true, '莊家 0～2 點，不論閒家第三張是什麼都補牌。'];
      if (b === 3) return [t !== 8, t === 8 ? '莊家 3 點，閒家第三張是 8，所以不補（莊 3 怕 8）。' : '莊家 3 點，只有閒家第三張是 8 才不補，這局要補牌。'];
      if (b === 4) return [t >= 2 && t <= 7, '莊家 4 點，閒家第三張是 2～7 才補牌。'];
      if (b === 5) return [t >= 4 && t <= 7, '莊家 5 點，閒家第三張是 4～7 才補牌。'];
      if (b === 6) return [t === 6 || t === 7, '莊家 6 點，閒家第三張是 6 或 7 才補牌。'];
      return [false, '莊家 7 點一律停牌。'];
    }
    function run() {
      var p = +selP.value, b = +selB.value, t = +selT.value, html = '';
      var natural = p >= 8 || b >= 8, pDraw = !natural && p <= 5;
      selT.disabled = !pDraw;
      hint.textContent = pDraw ? '' : (natural ? '天牌，雙方都不補牌' : '閒家停牌，不需要第三張');
      if (natural) {
        html = step('天牌判斷', '天牌', 'is-natural', '閒家 ' + p + ' 點、莊家 ' + b + ' 點。任一方前兩張是 8 或 9 點就是天牌，雙方都不補牌，直接比點數。') +
          step('閒家', '不補', '', '出現天牌，閒家停牌。') + step('莊家', '不補', '', '出現天牌，莊家停牌。');
      } else {
        html = step('天牌判斷', '沒有天牌', '', '雙方前兩張都不是 8 或 9 點，接著依序判斷閒家、莊家是否補牌。');
        if (pDraw) {
          var br = bankerRule(b, t);
          html += step('閒家', '補牌', 'is-draw', '閒家 0～5 點要補牌。補到 ' + (NAME[t] || t) + ' 之後，閒家變成 ' + ((p + t) % 10) + ' 點。');
          html += step('莊家', br[0] ? '補牌' : '不補', br[0] ? 'is-draw' : '', br[1]);
        } else {
          html += step('閒家', '停牌', '', '閒家 6～7 點停牌，不補第三張。');
          html += step('莊家', b <= 5 ? '補牌' : '不補', b <= 5 ? 'is-draw' : '', b <= 5 ? '閒家沒有補牌時，莊家和閒家規則相同：0～5 點補牌。' : '閒家沒有補牌時，莊家 6～7 點停牌。');
        }
      }
      out.innerHTML = html;
    }
    [selP, selB, selT].forEach(function (s) { s.addEventListener('change', run); });
    run();
  })();
  // ---------- Mobile hamburger ----------
  var burger = document.querySelector('.nav-burger');
  var mnav = document.getElementById('mnav');
  if (burger && mnav) {
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = mnav.hidden;
      mnav.hidden = !open;
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mnav.addEventListener('click', function (e) { if (e.target.closest('a')) { mnav.hidden = true; burger.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('click', function (e) { if (!mnav.hidden && !e.target.closest('#mnav')) { mnav.hidden = true; burger.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mnav.hidden) { mnav.hidden = true; burger.setAttribute('aria-expanded', 'false'); burger.focus(); } });
  }

  // ---------- Desktop dropdown menus ----------
  var toggles = document.querySelectorAll('[data-toggle]');
  function closeMenus(except) {
    toggles.forEach(function (btn) {
      var key = btn.getAttribute('data-toggle');
      if (key === except) return;
      btn.setAttribute('aria-expanded', 'false');
      var menu = document.querySelector('[data-menu="' + key + '"]');
      if (menu) menu.hidden = true;
    });
  }
  toggles.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var key = btn.getAttribute('data-toggle');
      var menu = document.querySelector('[data-menu="' + key + '"]');
      if (!menu) return;
      var open = menu.hidden;
      closeMenus(key);
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('[data-menu]')) closeMenus(null); });

  // ---------- Carousels ----------
  function bindCarousel(trackId, prevId, nextId) {
    var track = document.getElementById(trackId);
    if (!track) return;
    function step(dir) {
      var card = track.firstElementChild;
      var w = track.getAttribute('data-page') ? track.clientWidth + 14 : (card ? card.offsetWidth + 16 : 300);
      track.scrollBy({ left: dir * w, behavior: 'smooth' });
    }
    var p = document.getElementById(prevId), n = document.getElementById(nextId);
    if (p) p.addEventListener('click', function () { step(-1); });
    if (n) n.addEventListener('click', function () { step(1); });
  }
  bindCarousel('guide-track', 'guide-prev', 'guide-next');
  bindCarousel('tested-track', 'tested-prev', 'tested-next');
  bindCarousel('more-track', 'more-prev', 'more-next');


  // ---------- Visitor comments (Cloudflare Worker + D1 + Turnstile) ----------
  var CMT_API = 'https://baccarat-comments-api.bacca-77666.workers.dev';
  var CMT_SITEKEY = '0x4AAAAAAF0bH6oAUM02km9d';
  var CMT_RULES = [/https?:\/\//i, /www\./i, /<\s*a[\s>]/i, /\[url/i, /line\.me/i, /lin\.ee/i,
    /[a-z0-9-]+\s*(\.|點|dot)\s*(com|net|org|tw|cc|io|me|vip|xyz|top|app|link|bet|win|club|site|online|shop|info|biz|co|hk|asia|live)\b/i,
    /(line|賴|加賴)\s*(id)?\s*[:：]?\s*@?[a-z0-9._-]{3,}/i, /@[a-z0-9._-]{4,}/i, /\bid\s*[:：]\s*[a-z0-9._-]{3,}/i];
  var CMT_ERR = {
    blocked: '留言不可包含 LINE ID、網址或任何連結，請修改後再送出。',
    captcha_failed: '人機驗證失敗或已逾時，請重新驗證後再送出。',
    rate_limited: '留言太頻繁了，請稍後再試。',
    invalid_length: '留言內容需要 1～300 字。',
    forbidden: '目前無法送出留言，請稍後再試。',
    server_error: '系統忙碌中，請稍後再試。'
  };
  function cmtEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function cmtBlocked(t) { t = String(t || ''); if (t.normalize) t = t.normalize('NFKC'); return CMT_RULES.some(function (r) { return r.test(t); }); }
  var tsLoading = null;
  function loadTurnstile() {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (tsLoading) return tsLoading;
    tsLoading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true; s.defer = true;
      s.onload = function () { resolve(window.turnstile); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return tsLoading;
  }
  var INPUT = 'width: 100%; box-sizing: border-box; border-radius: 10px; border: 1px solid #3A5596; background: #060A16; color: #E6EDFA; font-family: inherit; font-size: 15px;';
  function mountComments(el) {
    if (el.getAttribute('data-ready')) return;
    el.setAttribute('data-ready', '1');
    var brand = el.getAttribute('data-brand'), label = el.getAttribute('data-label') || '';
    var limit = parseInt(el.getAttribute('data-limit') || '0', 10), more = el.getAttribute('data-more') || '';
    el.innerHTML =
      '<span style="font-family: \'Noto Serif TC\', \'Songti TC\', serif; font-size: 20px; font-weight: 700; color: #A9C6FF;">' + cmtEsc(label) + ' 訪客留言</span>' +
      '<p style="margin: 0; font-size: 14px; line-height: 1.75; color: #9FB0D0;">免註冊、可匿名留言。為防止廣告與詐騙，留言中不可包含 LINE ID、網址或任何連結；不當內容會被移除。</p>' +
      '<ul class="cmt-list" style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px;"><li style="font-size: 15px; color: #9FB0D0;">留言載入中…</li></ul>' +
      '<form class="cmt-form" novalidate style="display: flex; flex-direction: column; gap: 10px; padding: 16px; border-radius: 16px; background: #101A36; border: 1px solid #2E4A8A;">' +
        '<label style="font-size: 14px; font-weight: 700; color: #DCE6F7;">暱稱（選填）<input name="nickname" maxlength="20" placeholder="匿名訪客" style="' + INPUT + ' height: 44px; padding: 0 14px; margin-top: 6px;"></label>' +
        '<label style="font-size: 14px; font-weight: 700; color: #DCE6F7;">留言內容<textarea name="content" rows="4" maxlength="300" required placeholder="分享你的試玩心得，例如連線穩定度、荷官互動、遊戲選擇……" style="' + INPUT + ' padding: 12px 14px; line-height: 1.7; resize: vertical; margin-top: 6px;"></textarea></label>' +
        '<div class="cmt-ts" style="min-height: 65px;"></div>' +
        '<p class="cmt-msg" role="status" style="margin: 0; font-size: 14px; line-height: 1.6; color: #9FE3C1; min-height: 1em;"></p>' +
        '<div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;"><span class="cmt-count" style="font-size: 13px; color: #8D9AB3;">0 / 300 字</span>' +
        '<button type="submit" style="height: 44px; padding: 0 24px; border: none; border-radius: 999px; background: #2D63E6; color: #FFFFFF; font-family: inherit; font-size: 15px; font-weight: 700; cursor: pointer;">送出留言</button></div>' +
      '</form>';
    var list = el.querySelector('.cmt-list'), form = el.querySelector('.cmt-form'), msg = el.querySelector('.cmt-msg');
    var ta = form.querySelector('textarea'), count = el.querySelector('.cmt-count'), btn = form.querySelector('button');
    var widgetId = null;
    ta.addEventListener('input', function () { count.textContent = ta.value.length + ' / 300 字'; });
    function show(text, ok) { msg.textContent = text; msg.style.color = ok ? '#9FE3C1' : '#FFB4A8'; }
    function load(fresh) {
      if (CMT_API.indexOf('__') === 0) { list.innerHTML = '<li style="font-size: 15px; color: #9FB0D0;">留言功能即將開放。</li>'; return; }
      fetch(CMT_API + '/comments?brand=' + encodeURIComponent(brand) + (fresh ? '&t=' + Date.now() : '')).then(function (r) { return r.json(); }).then(function (d) {
        var items = (d && d.comments) || [];
        if (!items.length) { list.innerHTML = '<li style="padding: 16px; border-radius: 14px; background: #101A36; border: 1px dashed #3A5596; font-size: 15px; color: #9FB0D0; text-align: center;">目前還沒有訪客留言，歡迎分享你的試玩心得。</li>'; return; }
        var total = items.length;
        if (limit && items.length > limit) items = items.slice(0, limit);
        list.innerHTML = items.map(function (c) {
          return '<li style="padding: 10px 14px; border-radius: 12px; background: #132042; border: 1px solid #2E4A8A; border-left: 3px solid #5B8CFF; display: flex; flex-direction: column; gap: 2px;"><span style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;"><span style="font-size: 15px; font-weight: 700; color: #E6EDFA; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + cmtEsc(c.nickname) + '</span><span style="flex: 0 0 auto; font-size: 12px; color: #8D9AB3;">' + cmtEsc(String(c.created_at).slice(0, 10).replace(/-/g, '/')) + '</span></span><span style="font-size: 15px; line-height: 1.65; color: #C4CDDF; white-space: pre-line; overflow-wrap: anywhere;">' + cmtEsc(c.content) + '</span></li>';
        }).join('') + (limit && total > limit && more ? '<li><a class="arrow-link" href="' + cmtEsc(more) + '" style="font-size: 15px; font-weight: 700;">查看全部 ' + total + ' 則留言 →</a></li>' : '');
      }).catch(function () { list.innerHTML = '<li style="font-size: 15px; color: #9FB0D0;">留言暫時無法載入，請稍後再試。</li>'; });
    }
    load();
    if (CMT_API.indexOf('__') === 0) { form.style.display = 'none'; return; }
    loadTurnstile().then(function (ts) {
      widgetId = ts.render(el.querySelector('.cmt-ts'), { sitekey: CMT_SITEKEY, theme: 'dark', language: 'zh-tw' });
    }).catch(function () { show('人機驗證載入失敗，請重新整理頁面。', false); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nickname = form.nickname.value.trim(), content = ta.value.trim();
      if (!content) { show('請輸入留言內容。', false); return; }
      if (cmtBlocked(nickname) || cmtBlocked(content)) { show(CMT_ERR.blocked, false); return; }
      var token = window.turnstile && widgetId !== null ? window.turnstile.getResponse(widgetId) : '';
      if (!token) { show('請先完成人機驗證。', false); return; }
      btn.disabled = true; show('送出中…', true);
      fetch(CMT_API + '/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brand: brand, nickname: nickname, content: content, token: token }) })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (res.ok) {
            form.reset(); count.textContent = '0 / 300 字';
            show(res.d.status === 'published' ? '留言已送出，謝謝你的分享。' : '留言已送出，審核通過後就會顯示，謝謝你的分享。', true);
            if (res.d.status === 'published') load(true);
          } else { show(CMT_ERR[res.d && res.d.error] || CMT_ERR.server_error, false); }
        })
        .catch(function () { show(CMT_ERR.server_error, false); })
        .then(function () { btn.disabled = false; if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId); });
    });
    el._cmtCleanup = function () { if (window.turnstile && widgetId !== null) { try { window.turnstile.remove(widgetId); } catch (err) {} } };
  }
  document.querySelectorAll('.cmt').forEach(mountComments);

  // ---------- Quick-view modal (homepage) ----------
  var dataEl = document.getElementById('brand-data');
  var overlay = document.getElementById('modal-overlay');
  if (!dataEl || !overlay) return;
  var brands = JSON.parse(dataEl.textContent);
  var lastFocus = null;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var STAR = '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"></path>';
  var SERIF = "'Noto Serif TC', 'Songti TC', serif";
  var TD = 'vertical-align: top; padding: 12px 16px;';
  function render(b) {
    var stars = b.stars.map(function (s) { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="' + s.fill + '" stroke="' + s.stroke + '" stroke-width="2" stroke-linejoin="round" aria-hidden="true">' + STAR + '</svg>'; }).join('');
    var games = '<p style="margin: 0; font-size: 15px; line-height: 1.8; color: #C4CDDF;">' + b.games.map(esc).join('、') + '</p>';
    function miniStars(n) { var o = ''; for (var k = 1; k <= 5; k++) o += '<svg width="13" height="13" viewBox="0 0 24 24" fill="' + (k <= n ? '#E8A317' : 'none') + '" stroke="' + (k <= n ? '#E8A317' : '#8C99AD') + '" stroke-width="2" stroke-linejoin="round" aria-hidden="true">' + STAR + '</svg>'; return '<span style="display: flex; gap: 1px; margin-top: 4px;">' + o + '</span>'; }
    var rows = b.rows.map(function (r) {
      return '<tr style="border-top: 1px solid #1D2945;"><th scope="row" style="text-align: left; ' + TD + ' font-weight: 500;">' + esc(r.name) + '</th><td data-label="評分" style="' + TD + ' font-weight: 700; white-space: nowrap;">' + esc(r.score) + miniStars(parseInt(r.score, 10) || 0) + '</td><td data-label="實測說明" style="' + TD + ' line-height: 1.7; color: #C4CDDF;">' + esc(r.note) + '</td></tr>';
    }).join('');
    function box(title, items) {
      if (!items || !items.length) return '';
      return '<div style="border: 1px solid #1D2945; border-radius: 14px; background: #070B16; padding: 16px 18px; display: flex; flex-direction: column; gap: 8px;"><h3 style="margin: 0; font-family: ' + SERIF + '; font-size: 18px; font-weight: 700; color: #A9C6FF;">' + title + '</h3><ul style="margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.8; color: #C4CDDF;">' + items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></div>';
    }
    var pc = box('優點', b.pros) + box('限制', b.cons);
    return '<div role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1" style="font-family: \'Noto Sans TC\', \'PingFang TC\', \'Microsoft JhengHei\', sans-serif; color: #E6EDFA; width: 100%; max-width: 720px; box-sizing: border-box; background: #0A0F1E; border-radius: 22px; border: 1px solid #22305A; box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6); padding: clamp(18px, 5vw, 32px); display: flex; flex-direction: column; gap: 22px;">' +
      '<div style="display: flex; gap: 14px; align-items: center;">' +
        '<div style="flex: 0 0 64px; height: 56px; display: flex; align-items: center; justify-content: center;"><img src="' + esc(b.logo) + '" alt="' + esc(b.alt) + '" style="max-width: 64px; max-height: 52px; object-fit: contain; filter: brightness(0) invert(1); opacity: 0.95;"></div>' +
        '<div style="flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 6px;">' +
          '<h2 id="modal-title" style="margin: 0; font-family: ' + SERIF + '; font-size: clamp(19px, 5.2vw, 28px); white-space: nowrap; font-weight: 900; color: #A9C6FF;">' + esc(b.label) + ' 試玩重點</h2>' +
          '<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; font-size: 14px; color: #8D9AB3;"><span style="display: flex; gap: 2px;">' + stars + '</span><span style="font-weight: 700; color: #E6EDFA;">' + esc(b.ratingText) + '</span><span>最後實測：' + esc(b.month) + '</span></div>' +
        '</div>' +
        '<button type="button" data-close aria-label="關閉視窗" style="flex: 0 0 44px; height: 44px; border-radius: 10px; border: 1px solid #2A3B66; background: transparent; color: #E6EDFA; display: flex; align-items: center; justify-content: center; cursor: pointer;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>' +
      '</div>' +
      '<p style="margin: 0; font-size: 16px; line-height: 1.8; color: #C4CDDF;">' + esc(b.desc) + '</p>' +
      '<div style="display: flex; flex-direction: column; gap: 12px;"><h3 style="margin: 0; font-family: ' + SERIF + '; font-size: 18px; font-weight: 700; color: #A9C6FF;">遊戲選單</h3>' + games + '' + (b.menuNote ? '<p style="margin: 0; font-size: 14px; line-height: 1.7; color: #8D9AB3;">' + esc(b.menuNote) + '</p>' : '') + '</div>' +
      '<div style="border: 1px solid #1D2945; border-radius: 14px; overflow: hidden;"><table class="tight" style="width: 100%; border-collapse: collapse; font-size: 15px;"><thead><tr style="background: #0E1630; color: #A9C6FF;"><th scope="col" style="text-align: left; padding: 12px 16px;">評測項目</th><th scope="col" style="text-align: left; padding: 12px 16px;">評分</th><th scope="col" style="text-align: left; padding: 12px 16px;">實測說明</th></tr></thead><tbody>' + rows +
        '<tr style="border-top: 2px solid #3A5596; background: #0E1630;"><th scope="row" style="text-align: left; padding: 12px 16px; font-weight: 900;">總評分</th><td data-label="評分" style="padding: 12px 16px; font-weight: 900; white-space: nowrap;">' + esc(b.ratingText) + '</td><td data-label="說明" style="padding: 12px 16px; color: #C4CDDF;">我的綜合評分，詳見<a href="methodology/" style="color: #A9C6FF;">評測方法</a></td></tr></tbody></table></div>' +
      (pc ? '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 14px;">' + pc + '</div>' : '') +
      '<div class="cmt" data-limit=\"3\" data-more=\"' + esc(b.page) + '#comments-' + esc(b.id) + '\" data-brand="' + esc(b.id) + '" data-label="' + esc(b.label) + '" style="border-top: 1px solid #1D2945; padding-top: 20px; display: flex; flex-direction: column; gap: 12px;"></div>' +
      '<a class="fx-btn" href="' + esc(b.page) + '" style="display: flex; align-items: center; justify-content: center; gap: 8px; height: 52px; border-radius: 999px; background: #2D63E6; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: 700;">查看 ' + esc(b.label) + ' 完整試玩心得</a>' +
    '</div>';
  }
  function open(id, trigger) {
    var b = brands.filter(function (x) { return x.id === id; })[0];
    if (!b) return;
    lastFocus = trigger || document.activeElement;
    overlay.innerHTML = render(b);
    closing = false;
    overlay.classList.remove('fx-closing');
    if (animOK()) overlay.classList.add('fx-open');
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    var dlg = overlay.querySelector('[role="dialog"]');
    overlay.querySelectorAll('.cmt').forEach(mountComments);
    if (dlg) dlg.focus();
  }
  var closing = false;
  function finishClose() {
    overlay.querySelectorAll('.cmt').forEach(function (el) { if (el._cmtCleanup) el._cmtCleanup(); });
    overlay.classList.remove('fx-open', 'fx-closing');
    overlay.hidden = true; overlay.innerHTML = ''; document.body.style.overflow = ''; closing = false;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function close() {
    if (closing || overlay.hidden) return;
    var dlg = overlay.querySelector('[role="dialog"]');
    if (!dlg || !animOK()) { finishClose(); return; }
    closing = true;
    // 收合點：對話框在畫面上可見範圍的左下角
    var rect = dlg.getBoundingClientRect();
    var oy = Math.max(0, Math.min(rect.height, window.innerHeight - rect.top - 24));
    dlg.style.transformOrigin = '0px ' + oy + 'px';
    overlay.classList.remove('fx-open');
    overlay.classList.add('fx-closing');
    var done = false;
    function end(e) { if (done || (e && e.target !== dlg)) return; done = true; dlg.removeEventListener('animationend', end); finishClose(); }
    dlg.addEventListener('animationend', end);
    setTimeout(end, 650);
  }
  document.querySelectorAll('[data-open]').forEach(function (btn) { btn.addEventListener('click', function () { open(btn.getAttribute('data-open'), btn); }); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay || e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) close(); });
})();
