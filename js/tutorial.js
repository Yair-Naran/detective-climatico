/* Playable tutorial (~60-90 s, skippable): save a clue -> verify it with NASA data -> learn the time rule. */
(function () {
  'use strict';
  var h = function () { return App.h.apply(null, arguments); };
  var t = function (k, v) { return App.t(k, v); };
  var S = { step: 0, saved: false, answer: null };

  function root() { return document.getElementById('screen-tutorial'); }

  function guide(textKey, vars) {
    return h('div', { class: 'guide' },
      h('div', { class: 'avatar burro-av', 'aria-hidden': 'true' }, Assets.char('burro', 'burro-img')),
      h('div', { class: 'bubble' }, h('b', { text: t('inspector') }), h('p', { text: t(textKey, vars) })));
  }

  function render() {
    var el = root(); el.innerHTML = '';
    var top = h('div', { class: 'row between' },
      h('span', { class: 'pill', text: t('tutorial') + ' ' + (S.step + 1) + '/4' }),
      h('button', { class: 'btn ghost', type: 'button', onclick: done, text: t('tut_skip') }));
    var card = h('div', { class: 'card' });
    el.appendChild(top); el.appendChild(card);

    if (S.step === 0) {
      card.appendChild(guide('tut1'));
      card.appendChild(scrubber());
      card.appendChild(h('button', { class: 'btn primary', type: 'button', onclick: go(1), text: t('next') }));
    } else if (S.step === 1) {
      card.appendChild(guide('tut2'));
      if (!S.saved) {
        card.appendChild(h('button', { class: 'clue pulse', type: 'button', onclick: function () { S.saved = true; render(); } },
          h('span', { class: 'clue-icon', 'aria-hidden': 'true' }, Icons.el('📰')), h('span', { text: t('tut2_card') })));
      } else {
        card.appendChild(h('p', { class: 'ok' }, Icons.label('✓', t('tut2_saved'))));
        card.appendChild(h('button', { class: 'btn primary', type: 'button', onclick: go(2), text: t('next') }));
      }
    } else if (S.step === 2) {
      var m = Chart.mini('pachuca', 't2m', 'annual'), tr = m.info.tr, right = App.verdict(tr);
      card.appendChild(guide('tut3'));
      card.appendChild(m.svg);
      var opts = [['up', 'opt_up'], ['none', 'opt_flat'], ['down', 'opt_down']];
      card.appendChild(h('div', { class: 'options' }, opts.map(function (o) {
        var cls = 'opt' + (S.answer === o[0] ? (o[0] === right ? ' good' : ' bad') : '');
        return h('button', { class: cls, type: 'button', onclick: function () { S.answer = o[0]; render(); }, text: t(o[1]) });
      })));
      if (S.answer) {
        var ok = S.answer === right;
        card.appendChild(h('p', { class: ok ? 'ok' : 'warn', text: ok ? t('tut3_ok', { rate: App.fmtRate(tr, 't2m'), p: App.fmtP(tr.p) }) : t('tut3_no') }));
        if (ok) card.appendChild(h('button', { class: 'btn primary', type: 'button', onclick: go(3), text: t('next') }));
      }
    } else {
      card.appendChild(guide('tut4'));
      card.appendChild(h('div', { class: 'clockdemo', 'aria-hidden': 'true' },
        h('span', { class: 'cd-step' }, Icons.label('⏱️', '9 h')), Icons.el('arrowRight', 'cd-arrow'),
        h('span', { class: 'cd-step' }, Icons.label('🎒', '−2 h')), Icons.el('arrowRight', 'cd-arrow'),
        h('span', { class: 'cd-step' }, Icons.label('📻', '−1 h')), Icons.el('arrowRight', 'cd-arrow'), h('span', { class: 'cd-step', text: '…' })));
      card.appendChild(h('button', { class: 'btn primary big', type: 'button', onclick: done, text: t('tut_start') }));
    }
  }

  /* first touch of the data: Pachuca's real stripes, scrubbable by pointer or arrow keys, with a live readout */
  function scrubber() {
    var se = Stripes.series('pachuca'), n = se.years.length, mx = Math.max.apply(null, se.anom.map(Math.abs)) || 1;
    var read = h('span', { class: 'tut-read', 'aria-live': 'polite' }), line = h('i', { class: 'tut-line', 'aria-hidden': 'true' });
    var strip = h('div', { class: 'tut-strip', tabindex: '0', role: 'group', 'aria-label': t('tut1_try') }, Stripes.strip('pachuca'), line);
    function at(i) {
      i = Math.max(0, Math.min(n - 1, i)); strip._i = i;
      var a = se.anom[i], pct = (i + 0.5) / n * 100;
      line.style.left = pct + '%';
      read.innerHTML = '';
      read.appendChild(h('i', { style: '--sw:' + Stripes.color(a / mx) }));
      read.appendChild(h('b', { text: String(se.years[i]) }));
      read.appendChild(document.createTextNode(' ' + (a > 0 ? '+' : a < 0 ? '−' : '±') + Math.abs(a).toFixed(1) + ' ' + t('unit_t2m')));
    }
    function from(e) { var r = strip.getBoundingClientRect(); return Math.floor((e.clientX - r.left) / r.width * n); }
    strip.addEventListener('pointermove', function (e) { at(from(e)); });
    strip.addEventListener('pointerdown', function (e) { at(from(e)); });
    strip.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : e.key === 'Home' ? -n : e.key === 'End' ? n : 0;
      if (d) { e.preventDefault(); at(strip._i + d); }
    });
    at(n - 1);
    return h('div', { class: 'tut-scrub' }, h('p', { class: 'small', text: t('tut1_try') }), strip, read);
  }

  function go(n) { return function () { S.step = n; render(); if (window.Motion) Motion.enter(root()); window.scrollTo(0, 0); }; }
  function done() { App.store.set('tutorialDone', true); Level.start('costa'); }

  window.Tutorial = {
    start: function () { S = { step: 0, saved: false, answer: null }; App.show('tutorial'); render(); },
    init: function () { App.onLang(function () { if (App.current === 'tutorial') render(); }); }
  };
})();
