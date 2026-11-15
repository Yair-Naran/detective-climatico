/* Home screen + boot. Deep links: ?lang=en  #archivo (tool)  #costa (level)  #tutorial */
(function () {
  'use strict';
  var h = function () { return App.h.apply(null, arguments); };
  var t = function (k, v) { return App.t(k, v); };
  var MEDAL_ICON = { gold: '🥇', silver: '🥈', bronze: '🥉' };

  var CASES = [
    { id: 'costa', icon: '🌊', ready: true },
    { id: 'centro', icon: '☀️', ready: true },
    { id: 'norte', icon: '🌵', ready: true }
  ];

  function medalOf(id) {
    var best = App.store.get('best_' + id);
    if (!best || !window.LEVELS[id]) return '';
    var m = window.LEVELS[id].medals;
    return best >= m.gold ? MEDAL_ICON.gold : best >= m.silver ? MEDAL_ICON.silver : best >= m.bronze ? MEDAL_ICON.bronze : '';
  }

  function endingsOf(id) {
    var n = (App.store.get('endings_' + id) || []).length;
    return n ? ' · ' + t('endingsShort', { n: n, total: window.ENDINGS.length }) : '';
  }

  function renderLevels() {
    var list = document.getElementById('levelList'); list.innerHTML = '';
    CASES.forEach(function (c) {
      list.appendChild(h('button', { class: 'levelcard' + (c.ready ? '' : ' off'), 'data-case': c.id, type: 'button', disabled: !c.ready || !App.data,
        onclick: function () { play(c.id); } },
        h('span', { class: 'lc-icon', 'aria-hidden': 'true', text: c.icon }),
        h('span', { class: 'lc-text' }, h('b', { text: t('case_' + c.id) }), h('span', { class: 'small', text: t('case_' + c.id + '_desc') }),
          h('span', { class: 'lc-meta', text: '⏱️ ' + t('hoursN', { h: window.LEVELS[c.id].hours }) + ' · ' + t('diffLabel') + ': ' + t('difficulty_' + c.id) + endingsOf(c.id) })),
        h('span', { class: 'lc-tag', text: c.ready ? (medalOf(c.id) || '▶') : t('soon') })));
    });
  }

  function play(id) {
    if (!App.store.get('tutorialDone')) Tutorial.start(); else Level.start(id || 'costa');
  }

  var Home = window.Home = {
    show: function () { App.show('home'); renderLevels(); }
  };

  function showMethod() { App.show('method'); }

  var initialHash = location.hash.replace('#', '');
  function route() {
    var hsh = initialHash;
    if (hsh === 'archivo' || hsh === 'archive') Archive.open({}, function () { Home.show(); }, 'back');
    else if (hsh === 'metodo' || hsh === 'method') showMethod();
    else if (hsh === 'glosario' || hsh === 'glossary') Glossary.open();
    else if (hsh === 'tutorial') Tutorial.start();
    else if (window.LEVELS[hsh]) Level.start(hsh);
    else Home.show();
  }

  function boot() {
    App.applyI18n();
    var langBtn = document.getElementById('langBtn');
    var setLangLabel = function () { langBtn.textContent = t('langBtn'); };
    setLangLabel();
    langBtn.addEventListener('click', function () { App.setLang(App.lang === 'es' ? 'en' : 'es'); });
    App.onLang(function () { setLangLabel(); if (App.current === 'home') renderLevels(); });
    document.getElementById('homeBtn').addEventListener('click', function () { Cinematic.stop(); Home.show(); });
    document.getElementById('playBtn').addEventListener('click', function () { play('costa'); });
    document.getElementById('archiveBtn').addEventListener('click', function () { Archive.open({}, function () { Home.show(); }, 'back'); });
    var logo = document.getElementById('logoSlot'); logo.appendChild(Art.logo());
    document.getElementById('heroArt').appendChild(Art.hero());
    document.getElementById('methodBtn').addEventListener('click', showMethod);
    document.getElementById('glossBtn').addEventListener('click', function () { Glossary.open(); });
    document.getElementById('methodBack').addEventListener('click', function () { Home.show(); });
    Home.show();
    document.getElementById('playBtn').disabled = true;
    document.getElementById('archiveBtn').disabled = true;

    fetch('data/series.json').then(function (r) { return r.json(); }).then(function (j) {
      App.data = j;
      document.getElementById('loadMsg').hidden = true;
      document.getElementById('playBtn').disabled = false;
      document.getElementById('archiveBtn').disabled = false;
      Archive.init(); Tutorial.init(); Level.init(); Glossary.init();
      route();
    }).catch(function () {
      document.getElementById('loadMsg').textContent = t('loadError');
    });
  }
  boot();
})();
