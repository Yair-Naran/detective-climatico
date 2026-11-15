/* Interaction motion: screen entrances, press ripple, pointer tilt, and a "just picked" pop that survives re-renders.
   Everything here is presentation only; with prefers-reduced-motion the CSS turns the animations off. */
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
  var show = App.show;
  App.show = function (name) {
    show.apply(App, arguments);
    enter(document.getElementById('screen-' + name));
  };

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

  window.Motion = { enter: enter };
})();
