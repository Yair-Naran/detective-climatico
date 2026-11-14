/* Short auto-advancing illustrated panels (<= 20 s total). Tap to advance, "Skip" to end. */
(function () {
  'use strict';
  var timer = null;
  function stop() { if (timer) { clearTimeout(timer); timer = null; } }

  /* panels: [{icon, text, scene}] ; returns nothing, calls onDone() at the end */
  function play(container, panels, onDone, ms) {
    ms = ms || 3800;
    var i = 0, h = App.h;
    function finish() { stop(); onDone(); }
    function show() {
      stop();
      var p = panels[i];
      container.innerHTML = '';
      var dots = panels.map(function (_, k) { return h('span', { class: 'cdot' + (k === i ? ' on' : '') }); });
      container.appendChild(h('div', { class: 'cine scene-' + (p.scene || 'calm'), onclick: next },
        h('div', { class: 'cine-icon', 'aria-hidden': 'true', text: p.icon }),
        h('p', { class: 'cine-text', text: p.text }),
        h('div', { class: 'cdots' }, dots),
        p.note ? h('p', { class: 'cine-note', text: p.note }) : null));
      container.appendChild(h('div', { class: 'row end' },
        h('button', { class: 'btn ghost', type: 'button', onclick: finish, text: App.t('skip') })));
      timer = setTimeout(next, ms);
    }
    function next() { i++; if (i >= panels.length) finish(); else show(); }
    show();
  }
  window.Cinematic = { play: play, stop: stop };
})();
