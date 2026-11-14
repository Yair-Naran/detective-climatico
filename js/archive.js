/* Detective's Archive: choose city / variable / season / period -> time series + trend (Mann-Kendall). */
(function () {
  'use strict';
  var params = new URLSearchParams(location.search);
  var lang = params.get('lang') === 'en' ? 'en' : params.get('lang') === 'es' ? 'es'
    : ((navigator.language || 'es').slice(0, 2) === 'en' ? 'en' : 'es');
  var DATA = null;
  var $ = function (id) { return document.getElementById(id); };
  function t(k) { return (window.I18N[lang] && window.I18N[lang][k]) || k; }

  function applyI18n() {
    document.documentElement.lang = lang;
    document.title = t('title');
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $('langBtn').textContent = t('langBtn');
  }

  function fillSelect(sel, items, current) {
    sel.innerHTML = '';
    items.forEach(function (it) {
      var o = document.createElement('option'); o.value = it.value; o.textContent = it.label; sel.appendChild(o);
    });
    if (current !== undefined && items.some(function (i) { return String(i.value) === String(current); })) sel.value = current;
  }

  function buildControls(keep) {
    keep = keep || {};
    fillSelect($('city'), Object.keys(DATA.cities).map(function (k) { return { value: k, label: t('city_' + k) }; }), keep.city);
    fillSelect($('variable'), ['t2m', 'prectotcorr'].map(function (v) { return { value: v, label: t('var_' + v) }; }), keep.variable);
    fillSelect($('season'), ['annual', 'MAM', 'JJA', 'SON', 'DJF'].map(function (s) { return { value: s, label: t('season_' + s) }; }), keep.season);
  }

  // Only offer years that are complete for the chosen city/variable/season.
  function buildYears(keepFrom, keepTo) {
    var c = DATA.cities[$('city').value];
    var agg = Stats.aggregate(c[$('variable').value], c.start, $('season').value);
    var y0 = agg.years[0], y1 = agg.years[agg.years.length - 1];
    var ys = agg.years.map(function (y) { return { value: y, label: String(y) }; });
    var f = keepFrom !== undefined ? Math.min(Math.max(+keepFrom, y0), y1) : y0;
    var to = keepTo !== undefined ? Math.min(Math.max(+keepTo, y0), y1) : y1;
    fillSelect($('from'), ys, f);
    fillSelect($('to'), ys, to);
  }

  function fmt(n, d) { return (n >= 0 ? '+' : '') + n.toFixed(d); }

  function render() {
    var cid = $('city').value, v = $('variable').value, season = $('season').value;
    var c = DATA.cities[cid];
    $('elev').textContent = t('elevation') + ': ' + Math.round(c.elevation_m) + ' m';
    var agg = Stats.aggregate(c[v], c.start, season);
    var from = +$('from').value, to = +$('to').value;
    var xs = [], ys = [];
    agg.years.forEach(function (y, i) { if (y >= from && y <= to) { xs.push(y); ys.push(agg.values[i]); } });
    var res = $('result');
    var svg = $('chart');
    if (xs.length < 8) {
      svg.innerHTML = ''; res.className = 'result none';
      res.innerHTML = '<strong>' + t('notEnough') + '</strong>';
      return;
    }
    var tr = Stats.trend(xs, ys);
    drawChart(svg, xs, ys, tr, v);
    var dec = v === 't2m' ? 2 : 3;
    var sig = tr.p < 0.05, up = tr.slopePerYear > 0;
    var cls = !sig ? 'none' : up ? 'up' : 'down';
    var verdict = !sig ? t('verdictNone') : up ? t('verdictUp') : t('verdictDown');
    var html = '<strong>' + verdict + '</strong><div class="nums">' +
      '<span>' + t('rate') + ': <b>' + fmt(tr.slopePerDecade, dec) + ' ' + t('unitDecade_' + v) + '</b></span>' +
      '<span>' + t('pvalue') + ': <b>' + (tr.p < 0.001 ? '< 0.001' : tr.p.toFixed(3)) + '</b></span>' +
      '<span>' + t('yearsUsed') + ': <b>' + xs.length + ' (' + xs[0] + '–' + xs[xs.length - 1] + ')</b></span></div>';
    if (!sig) html += '<p class="note">' + t('verdictNoneNote') + '</p>';
    if (xs.length < 15) html += '<p class="note">' + t('verdictShort') + '</p>';
    res.className = 'result ' + cls; res.innerHTML = html;
  }

  function drawChart(svg, xs, ys, tr, v) {
    var W = 360, H = 230, L = 40, R = 10, T = 10, B = 28;
    var xmin = xs[0], xmax = xs[xs.length - 1];
    var ymin = Math.min.apply(null, ys), ymax = Math.max.apply(null, ys);
    var pad = (ymax - ymin) * 0.1 || 0.5; ymin -= pad; ymax += pad;
    var X = function (x) { return L + (x - xmin) / (xmax - xmin || 1) * (W - L - R); };
    var Y = function (y) { return T + (1 - (y - ymin) / (ymax - ymin)) * (H - T - B); };
    var d = v === 't2m' ? 1 : 2, s = '';
    for (var i = 0; i <= 4; i++) {
      var yv = ymin + (ymax - ymin) * i / 4;
      s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(yv) + '" y2="' + Y(yv) + '" stroke="#223a5c"/>' +
           '<text x="' + (L - 4) + '" y="' + (Y(yv) + 3) + '" text-anchor="end">' + yv.toFixed(d) + '</text>';
    }
    var step = xmax - xmin > 30 ? 10 : xmax - xmin > 14 ? 5 : 2;
    for (var x = Math.ceil(xmin / step) * step; x <= xmax; x += step)
      s += '<text x="' + X(x) + '" y="' + (H - 10) + '" text-anchor="middle">' + x + '</text>';
    s += '<text x="6" y="12">' + t('unit_' + v) + '</text>';
    s += '<polyline fill="none" stroke="#4cc9f0" stroke-width="1.2" opacity=".6" points="' +
         xs.map(function (x, i) { return X(x) + ',' + Y(ys[i]); }).join(' ') + '"/>';
    xs.forEach(function (x, i) { s += '<circle cx="' + X(x) + '" cy="' + Y(ys[i]) + '" r="2.6" fill="#4cc9f0"/>'; });
    var y0 = tr.intercept + tr.slopePerYear * xmin, y1 = tr.intercept + tr.slopePerYear * xmax;
    s += '<line x1="' + X(xmin) + '" y1="' + Y(y0) + '" x2="' + X(xmax) + '" y2="' + Y(y1) + '" stroke="#ffb703" stroke-width="2" stroke-dasharray="5 4"/>';
    svg.innerHTML = s;
  }

  function init() {
    applyI18n();
    $('result').innerHTML = '<strong>' + t('loading') + '</strong>';
    fetch('data/series.json').then(function (r) { return r.json(); }).then(function (j) {
      DATA = j; buildControls(); buildYears(); render();
      ['from', 'to'].forEach(function (id) { $(id).addEventListener('change', render); });
      ['city', 'variable', 'season'].forEach(function (id) {
        $(id).addEventListener('change', function () { buildYears($('from').value, $('to').value); render(); });
      });
    }).catch(function () { $('result').innerHTML = '<strong>' + t('loadError') + '</strong>'; });
    $('langBtn').addEventListener('click', function () {
      lang = lang === 'es' ? 'en' : 'es';
      var keep = DATA && { city: $('city').value, variable: $('variable').value, season: $('season').value };
      var f = $('from').value, to = $('to').value;
      applyI18n();
      if (DATA) { buildControls(keep); buildYears(f, to); render(); }
    });
  }
  init();
})();
