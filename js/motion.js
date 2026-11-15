/* Interaction motion: stripe curtain between screens, staggered entrances, label roll on every button, magnetic hero
   buttons, press ripple, pointer tilt, a "just picked" pop that survives re-renders, and stripe confetti for medals.
   Everything here is presentation only; with prefers-reduced-motion the CSS turns the animations off and the JS skips
   the curtain, confetti and magnetism. */
(function () {
  'use strict';
  var PRESSABLE = '.btn, .lang, .levelcard, .place, .opt, .item, .seg-btn, .clue, .brand';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)');

  /* ---- staggered entrance for a freshly shown screen or phase ---- */
  function enter(el) {
    if (!el) return;
    el.classList.remove('enter');
    void el.offsetWidth;
    el.classList.add('enter');
    clearTimeout(el._enterT);
    el._enterT = setTimeout(function () { el.classList.remove('enter'); }, 900);
  }
  /* the RdBu ramp, cold to warm: drops over the old screen and sweeps away from the new one */
  var RAMP = ['#2166ac', '#4393c3', '#92c5de', '#d1e5f0', '#f7f7f7', '#fddbc7', '#f4a582', '#d6604d', '#b2182b'];
  function curtain() {
    var c = document.createElement('div');
    c.className = 'curtain';
    c.setAttribute('aria-hidden', 'true');
    RAMP.forEach(function (col, i) {
      var b = document.createElement('i');
      b.style.background = col;
      b.style.animationDelay = (i * 0.028) + 's';
      c.appendChild(b);
    });
    document.body.appendChild(c);
    setTimeout(function () { c.remove(); }, 950);
  }
  var show = App.show, first = true;
  App.show = function (name) {
    var changed = App.current !== name;
    if (changed && !first && !reduce.matches) curtain();
    show.apply(App, arguments);
    var scr = document.getElementById('screen-' + name);
    if (!first && changed) { scr.classList.remove('intro'); enter(scr); }
    first = false;
  };
  /* the home first-load choreography plays once */
  setTimeout(function () { var hm = document.getElementById('screen-home'); if (hm) hm.classList.remove('intro'); }, 2600);

  /* ---- every button gets a rolling label: two copies in a clipping box (the second is hidden from AT) ---- */
  var ROLL = '.btn, .lang, .seg-btn';
  function wrap(el) {
    if (el.firstElementChild && el.firstElementChild.classList.contains('roll') && el.childNodes.length <= 2) return;
    var nodes = [], foot = null;
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 1 && (n.classList.contains('ripple') || n.classList.contains('foot'))) continue;
      if (n.nodeType === 1 && n.classList.contains('roll')) { nodes = null; break; }
      nodes.push(n);
    }
    if (nodes && nodes.length && el.textContent.trim()) {
      var a = document.createElement('span'), b, box = document.createElement('span');
      nodes.forEach(function (n) { a.appendChild(n); });
      b = a.cloneNode(true);
      b.setAttribute('aria-hidden', 'true');
      box.className = 'roll';
      box.appendChild(a); box.appendChild(b);
      el.insertBefore(box, el.firstChild);
    }
    if (el.matches('.btn.big.primary') && !el.querySelector(':scope > .foot')) {
      foot = document.createElement('span'); foot.className = 'foot'; foot.setAttribute('aria-hidden', 'true');
      el.appendChild(foot);
    }
  }
  function wrapAll(root) {
    if (root.nodeType !== 1) return;
    if (root.matches(ROLL)) wrap(root);
    var list = root.querySelectorAll(ROLL);
    for (var i = 0; i < list.length; i++) wrap(list[i]);
  }
  var mo = new MutationObserver(function (muts) {
    var seen = [];
    muts.forEach(function (m) {
      var t = m.target.nodeType === 1 ? m.target : m.target.parentElement;
      var host = t && t.closest(ROLL);
      if (host && seen.indexOf(host) < 0) seen.push(host);
      m.addedNodes.forEach(function (n) { if (n.nodeType === 1) wrapAll(n); });
    });
    seen.forEach(wrap);
  });
  mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  wrapAll(document.body);

  /* ---- big buttons lean toward the pointer ---- */
  document.addEventListener('pointermove', function (e) {
    if (!finePointer.matches || reduce.matches) return;
    var el = e.target.closest('.btn.big, .btn.big-2');
    document.querySelectorAll('.btn.magnet').forEach(function (b) { if (b !== el) { b.classList.remove('magnet'); b.style.removeProperty('--tx'); b.style.removeProperty('--ty'); } });
    if (!el || el.disabled) return;
    var r = el.getBoundingClientRect();
    el.classList.add('magnet');
    el.style.setProperty('--tx', (((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(1) + 'px');
    el.style.setProperty('--ty', (((e.clientY - r.top) / r.height - 0.5) * 8).toFixed(1) + 'px');
  }, { passive: true });

  /* ---- confetti cut from climate stripes ---- */
  var CONF = ['#2166ac', '#4393c3', '#92c5de', '#f7f7f7', '#f4a582', '#d6604d', '#b2182b', '#80cdc1', '#35978f', '#dfc27d'];
  function burst(x, y, n, palette, spread) {
    if (reduce.matches || !Element.prototype.animate) return;
    var box = document.createElement('div'); box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
    document.body.appendChild(box);
    for (var i = 0; i < n; i++) {
      var p = document.createElement('i'), a = Math.random() * Math.PI * 2, v = spread * (0.45 + Math.random() * 0.75);
      var dx = Math.cos(a) * v, dy = Math.sin(a) * v - spread * 0.55, rot = (Math.random() * 2 - 1) * 720;
      p.style.setProperty('--c', palette[i % palette.length]);
      p.style.setProperty('--w', (5 + Math.random() * 6).toFixed(0) + 'px');
      p.style.setProperty('--h', (10 + Math.random() * 12).toFixed(0) + 'px');
      box.appendChild(p);
      p.animate([
        { transform: 'translate(' + x + 'px,' + y + 'px) rotate(0) scale(.4)', opacity: 1 },
        { transform: 'translate(' + (x + dx) + 'px,' + (y + dy) + 'px) rotate(' + rot / 2 + 'deg) scale(1)', opacity: 1, offset: 0.35 },
        { transform: 'translate(' + (x + dx * 1.3) + 'px,' + (y + dy + spread * 1.6) + 'px) rotate(' + rot + 'deg) scale(.9)', opacity: 0 }
      ], { duration: 1500 + Math.random() * 900, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
    }
    setTimeout(function () { box.remove(); }, 2600);
  }
  var celebrated = new WeakSet();
  new MutationObserver(function () {
    var m = document.querySelector('.result-card .medal-svg');
    if (m && !celebrated.has(m)) {
      celebrated.add(m);
      setTimeout(function () {
        var r = m.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, 90, CONF, Math.min(320, window.innerWidth * 0.4));
      }, 350);
    }
    document.querySelectorAll('.opt.good.just').forEach(function (o) {
      if (celebrated.has(o)) return;
      celebrated.add(o);
      var r = o.getBoundingClientRect();
      burst(r.right - 26, r.top + r.height / 2, 16, ['#80cdc1', '#35978f', '#d1e5f0'], 70);
    });
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

  /* ---- ripple from the press point ---- */
  function ripple(el, x, y) {
    var r = el.getBoundingClientRect(), size = Math.max(r.width, r.height) * 2.2;
    var s = document.createElement('span');
    s.className = 'ripple';
    s.style.width = s.style.height = size + 'px';
    s.style.left = (x - r.left - size / 2) + 'px';
    s.style.top = (y - r.top - size / 2) + 'px';
    el.appendChild(s);
    setTimeout(function () { s.remove(); }, 700);
  }
  document.addEventListener('pointerdown', function (e) {
    var el = e.target.closest(PRESSABLE);
    if (!el || el.disabled || reduce.matches) return;
    ripple(el, e.clientX, e.clientY);
  });

  /* ---- most game controls re-render on click; find the new twin of what was clicked and let it pop ---- */
  function key(el) {
    return (el.className.split(' ')[0] || '') + '|' + (el.getAttribute('data-item') || el.getAttribute('data-ans') || el.getAttribute('data-type') || el.textContent.replace(/^✓\s*/, '').trim());
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('.opt, .item, .seg-btn, .clue');
    if (!el || el.disabled) return;
    var k = key(el);
    requestAnimationFrame(function () {
      var all = document.querySelectorAll('.opt, .item, .seg-btn, .clue');
      for (var i = 0; i < all.length; i++) {
        if (all[i] !== el && key(all[i]) === k && document.body.contains(all[i])) { all[i].classList.add('just'); break; }
      }
    });
  }, true);

  /* ---- tilt + light that follows the pointer on cards ---- */
  var cur = null, raf = null, last = null;
  function reset(el) { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); el.classList.remove('tilting'); }
  function frame() {
    raf = null;
    if (!cur || !last) return;
    var r = cur.getBoundingClientRect();
    var px = (last.x - r.left) / r.width, py = (last.y - r.top) / r.height;
    cur.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
    cur.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    cur.style.setProperty('--ry', ((px - 0.5) * 6).toFixed(2) + 'deg');
    cur.style.setProperty('--rx', ((0.5 - py) * 5).toFixed(2) + 'deg');
  }
  document.addEventListener('pointermove', function (e) {
    if (!finePointer.matches || reduce.matches) return;
    var el = e.target.closest('.tilt');
    if (el && el.disabled) el = null;
    if (el !== cur) { if (cur) reset(cur); cur = el; if (cur) cur.classList.add('tilting'); }
    if (!cur) return;
    last = { x: e.clientX, y: e.clientY };
    if (!raf) raf = requestAnimationFrame(frame);
  }, { passive: true });
  document.addEventListener('pointerleave', function () { if (cur) reset(cur); cur = null; });

  window.Motion = { enter: enter, burst: burst };
})();
