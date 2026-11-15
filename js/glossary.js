/* Detective's glossary: plain-language meaning of every technical term used in the game.
   Text keys: gl_<id>_t (term) and gl_<id>_d (definition) in i18n/strings.js. */
(function () {
  'use strict';
  var t = function (k, v) { return App.t(k, v); };
  var GROUPS = [
    { key: 'glG_data', ids: ['nasapower', 'merra2', 'imerg', 'reanalysis', 't2m', 'prec', 'gridcell', 'elevation'] },
    { key: 'glG_stats', ids: ['mean', 'season', 'trend', 'decade', 'mk', 'sen', 'pvalue', 'significant', 'anomaly', 'baseline', 'stripes'] },
    { key: 'glG_climate', ids: ['weatherclimate', 'cyclone', 'surge', 'heatwave', 'heatstroke', 'thermal', 'drought', 'tandeo', 'dengue'] },
    { key: 'glG_orgs', ids: ['siat', 'cenapred', 'smn', 'ipcc'] }
  ];
  var backFn = null, query = '';

  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  function render() {
    var h = App.h, root = document.getElementById('screen-glossary'); root.innerHTML = '';
    root.appendChild(h('div', { class: 'row' }, h('button', { class: 'btn ghost', type: 'button', onclick: back, text: t('back') })));
    var card = h('div', { class: 'card' });
    card.appendChild(h('h2', null, Icons.label('📖', t('glossTitle'))));
    card.appendChild(h('p', { class: 'small', text: t('glossIntro') }));
    var input = h('input', { type: 'search', class: 'search', placeholder: t('glossSearch'), 'aria-label': t('glossSearch'), value: query });
    input.addEventListener('input', function () { query = input.value; list(); });
    card.appendChild(input);
    var box = h('div', { class: 'gloss' }); card.appendChild(box);
    root.appendChild(card);
    function list() {
      box.innerHTML = ''; var q = norm(query.trim()), any = false;
      GROUPS.forEach(function (g) {
        var items = g.ids.filter(function (id) { return !q || norm(t('gl_' + id + '_t') + ' ' + t('gl_' + id + '_d')).indexOf(q) >= 0; });
        if (!items.length) return; any = true;
        box.appendChild(h('h3', { text: t(g.key) }));
        box.appendChild(h('dl', null, items.map(function (id) {
          return [h('dt', { id: 'gl-' + id, text: t('gl_' + id + '_t') }), h('dd', { text: t('gl_' + id + '_d') })];
        })));
      });
      if (!any) box.appendChild(h('p', { class: 'small', text: t('glossNone') }));
    }
    list();
  }
  function back() { var fn = backFn; backFn = null; (fn || function () { Home.show(); })(); }

  window.Glossary = {
    GROUPS: GROUPS,
    open: function (onBack) { backFn = onBack || null; query = ''; App.show('glossary'); render(); },
    init: function () { App.onLang(function () { if (App.current === 'glossary') render(); }); }
  };
})();
