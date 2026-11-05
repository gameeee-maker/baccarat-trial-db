(function () {
  'use strict';
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
      var w = card ? card.offsetWidth + 16 : 300;
      track.scrollBy({ left: dir * w, behavior: 'smooth' });
    }
    var p = document.getElementById(prevId), n = document.getElementById(nextId);
    if (p) p.addEventListener('click', function () { step(-1); });
    if (n) n.addEventListener('click', function () { step(1); });
  }
  bindCarousel('guide-track', 'guide-prev', 'guide-next');
  bindCarousel('tested-track', 'tested-prev', 'tested-next');

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
    var chips = b.games.map(function (g) { return '<span style="display: inline-flex; padding: 6px 12px; border-radius: 999px; background: #10204A; border: 1px solid #2A4489; font-size: 14px; color: #DCE6F7;">' + esc(g) + '</span>'; }).join('');
    var rows = b.rows.map(function (r) {
      return '<tr style="border-top: 1px solid #1D2945;"><th scope="row" style="text-align: left; ' + TD + ' font-weight: 500;">' + esc(r.name) + '</th><td data-label="評分" style="' + TD + ' font-weight: 700; white-space: nowrap;">' + esc(r.score) + '</td><td data-label="實測說明" style="' + TD + ' line-height: 1.7; color: #C4CDDF;">' + esc(r.note) + '</td></tr>';
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
      '<div style="display: flex; flex-direction: column; gap: 12px;"><h3 style="margin: 0; font-family: ' + SERIF + '; font-size: 18px; font-weight: 700; color: #A9C6FF;">遊戲選單</h3><div style="display: flex; flex-wrap: wrap; gap: 8px;">' + chips + '</div>' + (b.menuNote ? '<p style="margin: 0; font-size: 14px; line-height: 1.7; color: #8D9AB3;">' + esc(b.menuNote) + '</p>' : '') + '</div>' +
      '<div style="border: 1px solid #1D2945; border-radius: 14px; overflow: hidden;"><table class="rwd" style="width: 100%; border-collapse: collapse; font-size: 15px;"><thead><tr style="background: #0E1630; color: #A9C6FF;"><th scope="col" style="text-align: left; padding: 12px 16px;">評測項目</th><th scope="col" style="text-align: left; padding: 12px 16px;">評分</th><th scope="col" style="text-align: left; padding: 12px 16px;">實測說明</th></tr></thead><tbody>' + rows +
        '<tr style="border-top: 2px solid #3A5596; background: #0E1630;"><th scope="row" style="text-align: left; padding: 12px 16px; font-weight: 900;">總評分</th><td data-label="評分" style="padding: 12px 16px; font-weight: 900; white-space: nowrap;">' + esc(b.ratingText) + '</td><td data-label="說明" style="padding: 12px 16px; color: #C4CDDF;">我的綜合評分，詳見<a href="methodology/" style="color: #A9C6FF;">評測方法</a></td></tr></tbody></table></div>' +
      (pc ? '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 14px;">' + pc + '</div>' : '') +
      '<div style="border-top: 1px solid #1D2945; padding-top: 20px; display: flex; flex-direction: column; gap: 10px;"><span style="font-family: ' + SERIF + '; font-size: 19px; font-weight: 700; color: #A9C6FF;">訪客留言</span><p style="margin: 0; padding: 14px; border-radius: 14px; border: 1px dashed #2A3B66; font-size: 15px; line-height: 1.75; color: #9FB0D0; text-align: center;">訪客留言功能即將開放。</p></div>' +
      '<a href="' + esc(b.page) + '" style="display: flex; align-items: center; justify-content: center; gap: 8px; height: 52px; border-radius: 999px; background: #2D63E6; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: 700;">查看 ' + esc(b.label) + ' 完整試玩心得</a>' +
    '</div>';
  }
  function open(id, trigger) {
    var b = brands.filter(function (x) { return x.id === id; })[0];
    if (!b) return;
    lastFocus = trigger || document.activeElement;
    overlay.innerHTML = render(b);
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    var dlg = overlay.querySelector('[role="dialog"]');
    if (dlg) dlg.focus();
  }
  function close() {
    overlay.hidden = true; overlay.innerHTML = ''; document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll('[data-open]').forEach(function (btn) { btn.addEventListener('click', function () { open(btn.getAttribute('data-open'), btn); }); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay || e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) close(); });
})();
