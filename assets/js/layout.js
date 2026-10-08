(function () {
  'use strict';

  var SECTIONS = [
    { id: 'composition', name: 'آهنگسازی و تنظیم' },
    { id: 'mixing', name: 'میکس و مسترینگ' },
    { id: 'chords', name: 'آکوردها' },
    { id: 'sheets', name: 'نُت‌ها' }
  ];

  var FONTS = {
    head: {
      vazir:   { label: 'وزیرمتن', css: "'Vazirmatn', sans-serif" },
      lalezar: { label: 'لاله‌زار (نمایشی)', css: "'Lalezar', sans-serif" },
      rakkas:  { label: 'رَکّاس (پررنگ)', css: "'Rakkas', sans-serif" }
    },
    body: {
      vazir:   { label: 'وزیرمتن', css: "'Vazirmatn', sans-serif" },
      plex:    { label: 'IBM Plex عربی', css: "'IBM Plex Sans Arabic', sans-serif" },
      noto:    { label: 'نسخ (مناسب مقاله)', css: "'Noto Naskh Arabic', serif" }
    }
  };

  var DEFAULTS = { head: 'vazir', body: 'vazir', size: 100 };
  var KEY = 'sazrazi:fonts';
  var activeTab = SECTIONS[0].id;

  /* ---------- ذخیره تنظیمات (با مدیریت خطا) ---------- */
  function loadPrefs() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function savePrefs(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* حافظه در دسترس نیست */ }
  }
  function prefsFor(id) {
    return Object.assign({}, DEFAULTS, loadPrefs()[id] || {});
  }

  /* ---------- اعمال تنظیمات روی بخش‌ها ---------- */
  function applySettings() {
    document.querySelectorAll('[data-section]').forEach(function (el) {
      var s = prefsFor(el.dataset.section);
      var h = FONTS.head[s.head] || FONTS.head.vazir;
      var b = FONTS.body[s.body] || FONTS.body.vazir;
      el.style.setProperty('--h-font', h.css);
      el.style.setProperty('--b-font', b.css);
      el.style.setProperty('--fs', String(s.size / 100));
    });
  }

  /* ---------- پنل تنظیمات ---------- */
  function opts(group, selected) {
    return Object.keys(FONTS[group]).map(function (k) {
      return '<option value="' + k + '"' + (k === selected ? ' selected' : '') + '>' + FONTS[group][k].label + '</option>';
    }).join('');
  }

  function renderPanel(panel) {
    var s = prefsFor(activeTab);
    panel.querySelectorAll('[data-tab]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.tab === activeTab));
    });
    panel.querySelector('[data-key="head"]').innerHTML = opts('head', s.head);
    panel.querySelector('[data-key="body"]').innerHTML = opts('body', s.body);
    panel.querySelector('[data-key="size"]').value = s.size;
    panel.querySelector('[data-out]').textContent = s.size;
    panel.querySelector('.sample').style.fontFamily = FONTS.body[s.body].css;
  }

  function buildPanel() {
    var fab = document.createElement('button');
    fab.className = 'fab';
    fab.type = 'button';
    fab.id = 'aa-btn';
    fab.textContent = 'Aa';
    fab.setAttribute('aria-label', 'تنظیمات فونت و اندازه متن');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-controls', 'aa-panel');

    var panel = document.createElement('div');
    panel.className = 'panel';
    panel.id = 'aa-panel';
    panel.innerHTML =
      '<h3>تنظیمات نمایش هر بخش</h3>' +
      '<div class="tabs" role="group" aria-label="انتخاب بخش">' +
        SECTIONS.map(function (s) {
          return '<button type="button" data-tab="' + s.id + '">' + s.name + '</button>';
        }).join('') +
      '</div>' +
      '<label class="field">فونت عنوان‌ها<select data-key="head"></select></label>' +
      '<label class="field">فونت متن<select data-key="body"></select></label>' +
      '<label class="field">اندازه متن: <span data-out></span>٪' +
        '<input type="range" min="90" max="125" step="5" data-key="size"></label>' +
      '<div class="sample">نمونه: نُت و آکورد در استودیو ساز و راز</div>' +
      '<div class="panel-actions">' +
        '<button type="button" data-reset>بازنشانی این بخش</button>' +
        '<button type="button" data-close>بستن</button>' +
      '</div>';

    function toggle(open) {
      panel.classList.toggle('open', open);
      fab.setAttribute('aria-expanded', String(open));
    }

    fab.addEventListener('click', function () {
      toggle(!panel.classList.contains('open'));
      renderPanel(panel);
    });

    panel.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t) return;
      if (t.dataset.tab) {
        activeTab = t.dataset.tab;
        renderPanel(panel);
      }
      if (t.hasAttribute('data-reset')) {
        var p = loadPrefs();
        delete p[activeTab];
        savePrefs(p);
        applySettings();
        renderPanel(panel);
      }
      if (t.hasAttribute('data-close')) toggle(false);
    });

    panel.addEventListener('input', function (e) {
      var key = e.target.dataset.key;
      if (!key) return;
      var p = loadPrefs();
      var cur = Object.assign({}, DEFAULTS, p[activeTab] || {});
      cur[key] = key === 'size' ? Number(e.target.value) : e.target.value;
      p[activeTab] = cur;
      savePrefs(p);
      applySettings();
      renderPanel(panel);
    });

    document.body.append(fab, panel);
    renderPanel(panel);
  }

  /* ---------- راه‌اندازی ---------- */
  function init() {
    var page = document.body.dataset.nav;
    document.querySelectorAll('a[data-nav="' + page + '"]').forEach(function (a) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    });
    buildPanel();
    applySettings();
  }

  init();
})();
