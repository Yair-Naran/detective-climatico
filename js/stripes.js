/* Climate stripes drawn from the real NASA POWER series (annual mean, anomaly vs 1991-2020).
   Stripes.hero(container, onPick) -> interactive band: one row per city, scrub with pointer / arrow keys to read a year.
   Stripes.strip(cityId)            -> small non-interactive <svg> strip for a case card.
   Colors: RdBu diverging scale, the same for every row so the three cities can be compared. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var RDBU = ['#053061', '#2166ac', '#4393c3', '#92c5de', '#d1e5f0', '#f7f7f7', '#fddbc7', '#f4a582', '#d6604d', '#b2182b', '#67001f'];
  var CITIES = ['veracruz', 'pachuca', 'monterrey'];
  var CASE_OF = { veracruz: 'costa', pachuca: 'centro', monterrey: 'norte' };
  var cache = {};

  function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  var STOPS = RDBU.map(hex);
  /* k in [-1, 1] -> color */
  function color(k) {
    var t = Math.max(0, Math.min(1, 0.5 + k / 2)) * (STOPS.length - 1), i = Math.min(STOPS.length - 2, Math.floor(t)), f = t - i;
    var a = STOPS[i], b = STOPS[i + 1];
    return 'rgb(' + a.map(function (v, j) { return Math.round(v + (b[j] - v) * f); }).join(',') + ')';
  }

  function series(cityId) {
    if (cache[cityId]) return cache[cityId];
    var r = App.trendFor(cityId, 't2m', 'annual'), ref = [];
    r.years.forEach(function (y, i) { if (y >= 1991 && y <= 2020) ref.push(r.values[i]); });
    var base = ref.reduce(function (a, b) { return a + b; }, 0) / (ref.length || 1);
    var out = { id: cityId, years: r.years, anom: r.values.map(function (v) { return v - base; }), tr: r.tr };
    cache[cityId] = out;
    return out;
  }
  function scaleMax(list) {
    var m = 0;
    list.forEach(function (s) { s.anom.forEach(function (a) { m = Math.max(m, Math.abs(a)); }); });
    return m || 1;
  }
  function rects(s, m) {
    var n = s.anom.length, out = '';
    s.anom.forEach(function (a, i) {
      out += '<rect x="' + i + '" y="0" width="1.04" height="1" fill="' + color(a / m) + '"/>';
    });
    return '<svg xmlns="' + NS + '" class="strip-svg" viewBox="0 0 ' + n + ' 1" preserveAspectRatio="none" aria-hidden="true" focusable="false">' + out + '</svg>';
  }
  function signed(v, d) { return (v > 0 ? '+' : v < 0 ? '−' : '±') + Math.abs(v).toFixed(d); }

  function strip(cityId) {
    var all = CITIES.map(series), m = scaleMax(all), d = document.createElement('div');
    d.innerHTML = rects(series(cityId), m);
    var svg = d.firstChild; svg.setAttribute('class', 'strip-svg');
    return svg;
  }

  function hero(container, onPick) {
    var h = App.h, t = App.t, list = CITIES.map(series), m = scaleMax(list);
    var years = list[0].years, n = years.length, idx = n - 1, user = false, sweepTimer = null;
    container.innerHTML = '';

    var line = h('div', { class: 'scrub-line', 'aria-hidden': 'true' });
    var rows = list.map(function (s) {
      var city = App.data.cities[s.id].name;
      var val = h('span', { class: 'srow-val' });
      var row = h('button', { class: 'srow', type: 'button', 'data-case': CASE_OF[s.id],
        'aria-label': t('case_' + CASE_OF[s.id]) + '. ' + t('stripesCap_t2m') + ': ' + App.fmtRate(s.tr, 't2m'),
        onclick: function () { if (onPick) onPick(CASE_OF[s.id]); } });
      row.innerHTML = rects(s, m);
      row.appendChild(h('span', { class: 'srow-label' },
        h('b', { text: city }), h('span', { class: 'srow-rate', text: App.fmtRate(s.tr, 't2m') })));
      row.appendChild(val);
      return { s: s, el: row, val: val };
    });
    var yearChip = h('span', { class: 'year-chip' });
    var band = h('div', { class: 'band', tabindex: '0', role: 'group', 'aria-label': t('stripesCap_t2m') + ', ' + years[0] + '–' + years[n - 1] },
      rows.map(function (r) { return r.el; }), line);
    var axis = h('div', { class: 'band-axis', 'aria-hidden': 'true' },
      h('span', { text: String(years[0]) }), yearChip, h('span', { text: String(years[n - 1]) }));
    var live = h('p', { class: 'sr-only', 'aria-live': 'polite' });
    var legend = h('div', { class: 'band-legend' },
      h('span', { class: 'band-cap', text: t('stripesCap_t2m') + ' · 1991–2020' }),
      h('span', { class: 'band-keys' },
        h('span', { class: 'key' }, h('i', { class: 'key-sw cold' }), t('legNeg_t2m')),
        h('span', { class: 'key' }, h('i', { class: 'key-sw warm' }), t('legPos_t2m'))));
    container.appendChild(band); container.appendChild(axis); container.appendChild(legend); container.appendChild(live);

    function place(i, announce) {
      idx = Math.max(0, Math.min(n - 1, i));
      var pct = (idx + 0.5) / n * 100;
      line.style.left = pct + '%';
      yearChip.style.setProperty('--p', pct + '%');
      axis.classList.toggle('near-start', pct < 9);
      axis.classList.toggle('near-end', pct > 91);
      yearChip.textContent = years[idx];
      /* the game's title melts to the scrubbed year (Climate Crisis YEAR axis) */
      document.documentElement.style.setProperty('--year', years[idx]);
      rows.forEach(function (r) {
        var a = r.s.anom[idx];
        r.val.textContent = signed(a, 1) + ' ' + t('unit_t2m');
        r.val.style.left = pct + '%';
        r.val.classList.toggle('flip', pct > 72);
        r.val.style.setProperty('--sw', color(a / m));
      });
      if (announce) live.textContent = years[idx] + ': ' + rows.map(function (r) { return App.data.cities[r.s.id].name + ' ' + signed(r.s.anom[idx], 1) + ' ' + t('unit_t2m'); }).join(', ');
    }
    function fromEvent(e) {
      var box = band.getBoundingClientRect();
      return Math.floor((e.clientX - box.left) / box.width * n);
    }
    band.addEventListener('pointermove', function (e) { user = true; stopSweep(); band.classList.add('scrubbing'); place(fromEvent(e)); });
    band.addEventListener('pointerdown', function (e) { user = true; stopSweep(); place(fromEvent(e)); });
    band.addEventListener('pointerleave', function () { band.classList.remove('scrubbing'); });
    band.addEventListener('keydown', function (e) {
      var step = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : e.key === 'Home' ? -n : e.key === 'End' ? n : 0;
      if (!step) return;
      e.preventDefault(); user = true; stopSweep(); place(idx + step, true);
    });

    function stopSweep() { if (sweepTimer) { cancelAnimationFrame(sweepTimer); sweepTimer = null; } }
    place(n - 1);
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      /* after the stripes wipe in, the cursor sweeps once across 45 years and rests on the latest one */
      place(0);
      var t0 = null, delay = 1150, dur = 1700;
      var tick = function (ts) {
        if (user) return;
        if (t0 === null) t0 = ts;
        var p = Math.max(0, Math.min(1, (ts - t0 - delay) / dur)), e = 1 - Math.pow(1 - p, 3);
        place(Math.round(e * (n - 1)));
        if (p < 1) sweepTimer = requestAnimationFrame(tick); else sweepTimer = null;
      };
      sweepTimer = requestAnimationFrame(tick);
    }
    container.classList.add('ready');
  }

  window.Stripes = { hero: hero, strip: strip, color: color, series: series, RDBU: RDBU };
})();
