(function () {
  'use strict';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function icon(name, cls) {
    var s = el('span', 'material-symbols-outlined ' + (cls || ''), name);
    s.setAttribute('aria-hidden', 'true');
    return s;
  }

  function makeCard(p) {
    var art = el('article', 'card');

    var vis = el('div', 'card-vis');
    vis.append(
      el('span', 'card-tag', p.tag),
      icon(p.icon, 'card-icon'),
      el('span', 'card-meta', p.meta)
    );

    var body = el('div');
    body.append(
      el('h3', 'card-title', p.title),
      el('p', 'card-excerpt', p.excerpt)
    );

    var btn = el('a', 'card-btn');
    btn.href = p.url;
    btn.append(el('span', null, p.action), icon('arrow_back'));

    art.append(vis, body, btn);
    return art;
  }

  document.querySelectorAll('[data-cards]').forEach(function (box) {
    var list = (window.POSTS || {})[box.dataset.cards] || [];
    var frag = document.createDocumentFragment();
    list.forEach(function (p) { frag.appendChild(makeCard(p)); });
    box.appendChild(frag);
  });
})();
