/* Home screen + boot. Deep links: ?lang=en  #archivo (tool)  #costa (level)  #tutorial */
(function () {
  'use strict';
  var h = function () { return App.h.apply(null, arguments); };
  var t = function (k, v) { return App.t(k, v); };
  var CASES = [
    { id: 'costa', icon: '🌊', ready: true },
    { id: 'centro', icon: '☀️', ready: true },
    { id: 'norte', icon: '🌵', ready: true }
  ];

  function medalOf(id) {
    var best = App.store.get('best_' + id);
    if (!best || !window.LEVELS[id]) return '';
    var m = window.LEVELS[id].medals;
    return best >= m.gold ? 'gold' : best >= m.silver ? 'silver' : best >= m.bronze ? 'bronze' : '';
  }
  var CITY_OF = { costa: 'veracruz', centro: 'pachuca', norte: 'monterrey' };

  function endingsOf(id) {
    var n = (App.store.get('endings_' + id) || []).length;
    return n ? ' · ' + t('endingsShort', { n: n, total: window.ENDINGS.length }) : '';
  }

  function renderLevels() {
    var list = document.getElementById('levelList'); list.innerHTML = '';
    CASES.forEach(function (c) {
      var medal = medalOf(c.id), lv = window.LEVELS[c.id];
      list.appendChild(h('button', { class: 'levelcard tilt' + (c.ready ? '' : ' off'), 'data-case': c.id, type: 'button', disabled: !c.ready || !App.data,
        onclick: function () { play(c.id); } },
        h('span', { class: 'lc-strip', 'aria-hidden': 'true' }, App.data ? Stripes.strip(CITY_OF[c.id]) : null,
          App.data ? h('span', { class: 'lc-rate', text: App.data.cities[CITY_OF[c.id]].name + ' ' + App.fmtRate(Stripes.series(CITY_OF[c.id]).tr, 't2m') }) : null),
        h('span', { class: 'lc-body' },
          h('span', { class: 'lc-head' },
            h('span', { class: 'lc-icon', 'aria-hidden': 'true' }, Icons.el(c.icon)),
            h('span', { class: 'lc-tag' + (medal ? ' has-medal' : '') }, c.ready ? (medal ? Icons.medal(medal) : Icons.el('arrowRight')) : t('soon'))),
          h('b', { class: 'lc-title', text: t('case_' + c.id) }),
          h('span', { class: 'lc-desc', text: t('case_' + c.id + '_desc') }),
          h('span', { class: 'lc-meta' },
            h('span', { class: 'chip' }, Icons.label('⏱️', t('hoursN', { h: lv.hours }))),
            h('span', { class: 'chip' }, t('diffLabel') + ': ' + t('difficulty_' + c.id)),
            endingsOf(c.id) ? h('span', { class: 'chip' }, endingsOf(c.id).replace(/^ · /, '')) : null))));
    });
  }

  function play(id) {
    if (!App.store.get('tutorialDone')) Tutorial.start(); else Level.start(id || 'costa');
  }

  /* title on two lines (the second is drawn in outline); the text stays the i18n title */
  function renderTitle() {
    var el = document.getElementById('homeTitle'), txt = t('title'), cut = txt.indexOf(' ');
    var parts = cut > 0 ? [txt.slice(0, cut), txt.slice(cut + 1)] : [txt];
    el.innerHTML = '';
    el.setAttribute('aria-label', txt);
    parts.forEach(function (p) { el.appendChild(h('span', { class: 'ttl-line', 'aria-hidden': 'true' }, h('span', { text: p }))); });
  }

  /* broadcast-style crawl of each city's real warming rate (Sen slope of annual mean temperature, NASA POWER).
     The swatch is the RdBu colour of that rate on a +-0.6 °C/decade scale. */
  function renderTicker() {
    var box = document.getElementById('ticker');
    if (!App.data) return;
    var ref = Stripes.series('pachuca'), span = ref.years[0] + '–' + ref.years[ref.years.length - 1];
    var run = function () {
      var r = h('span', { class: 'ticker-run' });
      Object.keys(CITY_OF).forEach(function (id) {
        var city = CITY_OF[id], s = Stripes.series(city);
        r.appendChild(h('span', { class: 'tk' },
          h('i', { style: '--sw:' + Stripes.color(Math.max(-1, Math.min(1, s.tr.slopePerDecade / 0.6))) }),
          App.data.cities[city].name, h('b', { text: App.fmtRate(s.tr, 't2m') })));
        r.appendChild(h('span', { class: 'tk-sep' }));
      });
      r.appendChild(h('span', { class: 'tk', text: 'NASA POWER · ' + span }));
      r.appendChild(h('span', { class: 'tk-sep' }));
      return r;
    };
    box.innerHTML = '';
    box.appendChild(h('span', { class: 'ticker-track' }, run(), run()));
    box.hidden = false;
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
    renderTitle();
    App.onLang(function () { setLangLabel(); renderTitle(); renderTicker(); if (App.current === 'home') renderLevels(); });
    document.getElementById('homeBtn').addEventListener('click', function () { Cinematic.stop(); Home.show(); });
    document.getElementById('playBtn').addEventListener('click', function () { play('costa'); });
    document.getElementById('archiveBtn').addEventListener('click', function () { Archive.open({}, function () { Home.show(); }, 'back'); });
    var logo = document.getElementById('logoSlot'); logo.appendChild(Art.logo());
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
      Stripes.hero(document.getElementById('stripesHero'), play);
      renderTicker();
      App.onLang(function () { Stripes.hero(document.getElementById('stripesHero'), play); });
      route();
    }).catch(function () {
      document.getElementById('loadMsg').textContent = t('loadError');
    });
  }
  boot();
})();
