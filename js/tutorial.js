/* Playable tutorial (~60-90 s, skippable): save a clue -> verify it with NASA data -> learn the time rule. */
(function () {
  'use strict';
  var h = function () { return App.h.apply(null, arguments); };
  var t = function (k, v) { return App.t(k, v); };
  var S = { step: 0, saved: false, answer: null };

  function root() { return document.getElementById('screen-tutorial'); }

  function guide(textKey, vars) {
    return h('div', { class: 'guide' },
      h('div', { class: 'avatar', 'aria-hidden': 'true', text: '🔎' }),
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
      card.appendChild(h('button', { class: 'btn primary', type: 'button', onclick: go(1), text: t('next') }));
    } else if (S.step === 1) {
      card.appendChild(guide('tut2'));
      if (!S.saved) {
        card.appendChild(h('button', { class: 'clue pulse', type: 'button', onclick: function () { S.saved = true; render(); } },
          h('span', { class: 'clue-icon', 'aria-hidden': 'true', text: '📰' }), h('span', { text: t('tut2_card') })));
      } else {
        card.appendChild(h('p', { class: 'ok', text: '✓ ' + t('tut2_saved') }));
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
      card.appendChild(h('div', { class: 'clockdemo', 'aria-hidden': 'true' }, '⏱️ 9 h → 🎒 −2 h → 📻 −1 h → …'));
      card.appendChild(h('button', { class: 'btn primary big', type: 'button', onclick: done, text: t('tut_start') }));
    }
  }

  function go(n) { return function () { S.step = n; render(); window.scrollTo(0, 0); }; }
  function done() { App.store.set('tutorialDone', true); Level.start('costa'); }

  window.Tutorial = {
    start: function () { S = { step: 0, saved: false, answer: null }; App.show('tutorial'); render(); },
    init: function () { App.onLang(function () { if (App.current === 'tutorial') render(); }); }
  };
})();
