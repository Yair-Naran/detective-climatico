/* Detective's Archive (the challenge tool): city / variable / season / period -> series + Mann-Kendall trend. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var t = function (k, v) { return App.t(k, v); };
  var backFn = null, backKey = 'back';

  function fillSelect(sel, items, current) {
    sel.innerHTML = '';
    items.forEach(function (it) {
      var o = document.createElement('option'); o.value = it.value; o.textContent = it.label; sel.appendChild(o);
    });
    if (current !== undefined && items.some(function (i) { return String(i.value) === String(current); })) sel.value = current;
  }

  function buildControls(keep) {
    keep = keep || {};
    fillSelect($('city'), Object.keys(App.data.cities).map(function (k) { return { value: k, label: t('city_' + k) }; }), keep.city);
    fillSelect($('variable'), ['t2m', 'prectotcorr'].map(function (v) { return { value: v, label: t('var_' + v) }; }), keep.variable);
    fillSelect($('season'), ['annual', 'MAM', 'JJA', 'SON', 'DJF'].map(function (s) { return { value: s, label: t('season_' + s) }; }), keep.season);
  }

  // Only offer years that are complete for the chosen city/variable/season.
  function buildYears(keepFrom, keepTo) {
    var years = App.trendFor($('city').value, $('variable').value, $('season').value).years;
    var y0 = years[0], y1 = years[years.length - 1];
    var ys = years.map(function (y) { return { value: y, label: String(y) }; });
    var clamp = function (v, d) { return v === undefined || v === '' ? d : Math.min(Math.max(+v, y0), y1); };
    fillSelect($('from'), ys, clamp(keepFrom, y0));
    fillSelect($('to'), ys, clamp(keepTo, y1));
  }

  function render() {
    var cid = $('city').value, v = $('variable').value, season = $('season').value;
    var c = App.data.cities[cid];
    $('elev').textContent = t('elevation') + ': ' + Math.round(c.elevation_m) + ' m';
    var r = App.trendFor(cid, v, season, +$('from').value, +$('to').value);
    var res = $('result'), svg = $('chart');
    if (r.xs.length < 8) {
      svg.innerHTML = ''; res.className = 'result none';
      res.innerHTML = ''; res.appendChild(App.h('strong', { text: t('notEnough') }));
      return;
    }
    Chart.draw(svg, r.xs, r.ys, r.tr, t('unit_' + v), v === 't2m' ? 1 : 2);
    var vd = App.verdict(r.tr);
    res.className = 'result ' + vd;
    res.innerHTML = '';
    res.appendChild(App.h('strong', { text: t(vd === 'up' ? 'verdictUp' : vd === 'down' ? 'verdictDown' : 'verdictNone') }));
    res.appendChild(App.h('div', { class: 'nums' },
      App.h('span', null, t('rate') + ': ', App.h('b', { text: App.fmtRate(r.tr, v) })),
      App.h('span', null, t('pvalue') + ': ', App.h('b', { text: App.fmtP(r.tr.p) })),
      App.h('span', null, t('yearsUsed') + ': ', App.h('b', { text: r.xs.length + ' (' + r.xs[0] + '–' + r.xs[r.xs.length - 1] + ')' }))));
    if (vd === 'none') res.appendChild(App.h('p', { class: 'note', text: t('verdictNoneNote') }));
    if (r.xs.length < 15) res.appendChild(App.h('p', { class: 'note', text: t('verdictShort') }));
  }

  function rebuild() {
    var keep = { city: $('city').value, variable: $('variable').value, season: $('season').value };
    var f = $('from').value, to = $('to').value;
    buildControls(keep); buildYears(f, to); render();
    $('archiveBack').textContent = t(backKey);
  }

  var Archive = {
    init: function () {
      buildControls(); buildYears(); render();
      ['from', 'to'].forEach(function (id) { $(id).addEventListener('change', render); });
      ['city', 'variable', 'season'].forEach(function (id) {
        $(id).addEventListener('change', function () { buildYears($('from').value, $('to').value); render(); });
      });
      $('archiveBack').addEventListener('click', function () { var fn = backFn; backFn = null; (fn || function () { App.show('home'); })(); });
      App.onLang(function () { rebuild(); });
    },
    /* preset: {city, variable, season}; onBack: function; backLabelKey: i18n key */
    open: function (preset, onBack, backLabelKey) {
      preset = preset || {};
      buildControls(preset); buildYears(); render();
      backFn = onBack || null; backKey = backLabelKey || 'back';
      $('archiveBack').textContent = t(backKey);
      App.show('archive');
    }
  };
  window.Archive = Archive;
})();
