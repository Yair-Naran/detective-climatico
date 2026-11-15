/* Short auto-advancing illustrated panels. Each panel stays long enough to read (about 350 ms per word, at least 5 s).
   Tap, click, Enter or Space advances; "Skip" ends. */
(function () {
  'use strict';
  var timer = null;
  function stop() { if (timer) { clearTimeout(timer); timer = null; } }

  /* panels: [{icon, text, scene}] ; returns nothing, calls onDone() at the end */
  function play(container, panels, onDone, ms, zone) {
    ms = ms || 0;
    var i = 0, h = App.h;
    function finish() { stop(); onDone(); }
    function show() {
      stop();
      var p = panels[i];
      container.innerHTML = '';
      var dots = panels.map(function (_, k) { return h('span', { class: 'cdot' + (k === i ? ' on' : '') }); });
      container.appendChild(h('div', { class: 'cine scene-' + (p.scene || 'calm'), onclick: next, tabindex: '0', role: 'button',
          'aria-label': p.text, onkeydown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); } } },
        window.Art ? Art.scene(zone || 'home', p.scene || 'calm') : null,
        h('div', { class: 'cine-icon', 'aria-hidden': 'true' }, Icons.el(p.icon)),
        h('div', { class: 'cine-panel' },
          h('p', { class: 'cine-text', text: p.text }),
          p.note ? h('p', { class: 'cine-note', text: p.note }) : null,
          h('div', { class: 'cdots' }, dots))));
      container.appendChild(h('div', { class: 'row end' },
        h('button', { class: 'btn ghost', type: 'button', onclick: finish, text: App.t('skip') })));
      var words = String(p.text || '').split(/\s+/).length + String(p.note || '').split(/\s+/).length;
      timer = setTimeout(next, Math.max(ms, 5000, words * 350));
    }
    function next() { i++; if (i >= panels.length) finish(); else show(); }
    show();
  }
  window.Cinematic = { play: play, stop: stop };
})();
