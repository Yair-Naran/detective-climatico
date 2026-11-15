/* Charts for the Detective's Archive and the data clues. All drawn into <svg viewBox="0 0 360 230">.
   Types:
     line    yearly values + Sen trend line
     anom    yearly anomaly bars vs the 1991-2020 average (+ trend line)
     stripes climate stripes: one colored band per year (anomaly color)
     decades yearly dots + one step per decade at the decade average (labelled)
     cycle   month-by-month average: first 10 years vs last 10 years of the period
   Colors: RdBu (temperature) and BrBG (rain) diverging steps tuned for the graphite surface; blue/red for 2 series. */
(function () {
  'use strict';
  var W = 360, H = 230, L = 42, R = 12, T = 18, B = 28;
  var C = {
    grid: 'rgba(201,208,218,.12)', axis: '#98a2b0', data: '#92c5de', trend: '#f4a582',
    warm: '#d6604d', cool: '#4393c3', wet: '#35978f', dry: '#bf812d', mid: [40, 46, 56],
    early: '#4393c3', late: '#d6604d'
  };
  var TYPES = ['line', 'anom', 'stripes', 'decades', 'cycle'];
  var t = function (k, v) { return App.t(k, v); };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function fmt(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); }
  function signed(v, d) { return (v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v), d); }
  function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  function mix(a, b, k) { return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * k); }).join(',') + ')'; }
  function poles(variable) { return variable === 't2m' ? { pos: C.warm, neg: C.cool } : { pos: C.wet, neg: C.dry }; }

  function scaleX(x0, x1) { return function (x) { return L + (x - x0) / (x1 - x0 || 1) * (W - L - R); }; }
  function scaleY(y0, y1) { return function (y) { return T + (1 - (y - y0) / (y1 - y0 || 1)) * (H - T - B); }; }

  function yGrid(Y, y0, y1, d, prefix) {
    var s = '';
    for (var i = 0; i <= 4; i++) {
      var v = y0 + (y1 - y0) * i / 4;
      s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="' + C.grid + '"/>' +
        '<text x="' + (L - 5) + '" y="' + (Y(v) + 3) + '" text-anchor="end">' + (prefix ? signed(v, d) : fmt(v, d)) + '</text>';
    }
    return s;
  }
  function xYears(X, x0, x1) {
    var s = '', step = x1 - x0 > 30 ? 10 : x1 - x0 > 14 ? 5 : 2;
    for (var x = Math.ceil(x0 / step) * step; x <= x1; x += step)
      s += '<text x="' + X(x) + '" y="' + (H - 9) + '" text-anchor="middle">' + x + '</text>';
    return s;
  }
  function unitText(u) { return '<text x="6" y="11">' + esc(u) + '</text>'; }
  function trendLine(X, Y, tr, x0, x1, shift) {
    if (!tr) return '';
    var a = tr.intercept + tr.slopePerYear * x0 - (shift || 0), b = tr.intercept + tr.slopePerYear * x1 - (shift || 0);
    return '<line x1="' + X(x0) + '" y1="' + Y(a) + '" x2="' + X(x1) + '" y2="' + Y(b) + '" stroke="' + C.trend + '" stroke-width="2" stroke-dasharray="6 4" stroke-linecap="round"/>';
  }
  function padRange(lo, hi, frac, min) {
    var p = (hi - lo) * frac || min; return [lo - p, hi + p];
  }

  /* 1991-2020 average if available (WMO reference period), otherwise the mean of the shown years. */
  function baseline(r) {
    var vals = [];
    r.years.forEach(function (y, i) { if (y >= 1991 && y <= 2020) vals.push(r.values[i]); });
    if (vals.length < 20) vals = r.ys.slice();
    return { mean: vals.reduce(function (a, b) { return a + b; }, 0) / vals.length, ref: vals.length >= 20 && r.years.indexOf(1991) >= 0 };
  }

  /* ---------- the five chart bodies; each returns {svg, tip(i), n, xAt(i)} ---------- */
  function line(r, v, d) {
    var xs = r.xs, ys = r.ys, x0 = xs[0], x1 = xs[xs.length - 1];
    var yr = padRange(Math.min.apply(null, ys), Math.max.apply(null, ys), 0.1, 0.5);
    var X = scaleX(x0, x1), Y = scaleY(yr[0], yr[1]);
    var s = yGrid(Y, yr[0], yr[1], d) + xYears(X, x0, x1) + unitText(t('unit_' + v));
    s += '<polyline fill="none" stroke="' + C.data + '" stroke-width="1.5" stroke-linejoin="round" opacity=".55" points="' +
      xs.map(function (x, i) { return X(x) + ',' + Y(ys[i]); }).join(' ') + '"/>';
    xs.forEach(function (x, i) { s += '<circle cx="' + X(x) + '" cy="' + Y(ys[i]) + '" r="3" fill="' + C.data + '"/>'; });
    s += trendLine(X, Y, r.tr, x0, x1);
    return { svg: s, n: xs.length, xAt: function (i) { return X(xs[i]); }, yAt: function (i) { return Y(ys[i]); },
      tip: function (i) { return xs[i] + ': ' + fmt(ys[i], d) + ' ' + t('unit_' + v); } };
  }

  function anom(r, v, d) {
    var xs = r.xs, base = baseline(r), a = r.ys.map(function (y) { return y - base.mean; });
    var m = Math.max.apply(null, a.map(Math.abs)) * 1.15 || 1;
    var x0 = xs[0], x1 = xs[xs.length - 1], X = scaleX(x0 - 0.5, x1 + 0.5), Y = scaleY(-m, m), P = poles(v);
    var bw = Math.max(2, (W - L - R) / xs.length - 2);
    var s = yGrid(Y, -m, m, d, true) + xYears(X, x0, x1) + unitText('Δ ' + t('unit_' + v));
    s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(0) + '" y2="' + Y(0) + '" stroke="' + C.axis + '" stroke-width="1"/>';
    xs.forEach(function (x, i) {
      var y = Y(Math.max(a[i], 0)), h = Math.abs(Y(a[i]) - Y(0));
      s += '<rect x="' + (X(x) - bw / 2) + '" y="' + y + '" width="' + bw + '" height="' + Math.max(h, 0.8) + '" rx="1.5" fill="' + (a[i] >= 0 ? P.pos : P.neg) + '"/>';
    });
    s += trendLine(X, Y, r.tr, x0, x1, base.mean);
    return { svg: s, n: xs.length, base: base, xAt: function (i) { return X(xs[i]); }, yAt: function (i) { return Y(a[i]); },
      tip: function (i) { return xs[i] + ': ' + signed(a[i], d) + ' ' + t('unit_' + v); } };
  }

  function stripes(r, v, d) {
    var xs = r.xs, base = baseline(r), a = r.ys.map(function (y) { return y - base.mean; });
    var m = Math.max.apply(null, a.map(Math.abs)) || 1, P = poles(v);
    var x0 = xs[0], x1 = xs[xs.length - 1], SL = 12, bw = (W - SL - R) / xs.length;
    var X = function (x) { return SL + (x - x0 + 0.5) * bw; };
    var s = '';
    xs.forEach(function (x, i) {
      var k = Math.min(1, Math.abs(a[i]) / m);
      s += '<rect x="' + (X(x) - bw / 2) + '" y="' + T + '" width="' + (bw + 0.6) + '" height="' + (H - T - B) + '" fill="' + mix(C.mid, hex(a[i] >= 0 ? P.pos : P.neg), Math.pow(k, 0.8)) + '"/>';
    });
    s += '<text x="' + SL + '" y="' + (H - 9) + '">' + x0 + '</text><text x="' + (W - R) + '" y="' + (H - 9) + '" text-anchor="end">' + x1 + '</text>';
    s += '<text x="' + SL + '" y="11">' + esc(t('stripesCap_' + v)) + '</text>';
    return { svg: s, n: xs.length, base: base, left: SL, xAt: function (i) { return X(xs[i]); }, yAt: function () { return T + 14; },
      tip: function (i) { return xs[i] + ': ' + signed(a[i], d) + ' ' + t('unit_' + v); } };
  }

  function decadesOf(xs, ys) {
    var g = {};
    xs.forEach(function (x, i) { var k = Math.floor((x - 1) / 10) * 10 + 1; (g[k] = g[k] || []).push([x, ys[i]]); });
    return Object.keys(g).map(Number).sort(function (a, b) { return a - b; }).map(function (k) {
      var arr = g[k], mean = arr.reduce(function (s, p) { return s + p[1]; }, 0) / arr.length;
      return { from: arr[0][0], to: arr[arr.length - 1][0], mean: mean, n: arr.length };
    });
  }
  function decades(r, v, d) {
    var xs = r.xs, ys = r.ys, x0 = xs[0], x1 = xs[xs.length - 1], dec = decadesOf(xs, ys);
    var yr = padRange(Math.min.apply(null, ys), Math.max.apply(null, ys), 0.18, 0.5);
    var X = scaleX(x0 - 0.5, x1 + 0.5), Y = scaleY(yr[0], yr[1]);
    var s = yGrid(Y, yr[0], yr[1], d) + unitText(t('unit_' + v));
    xs.forEach(function (x, i) { s += '<circle cx="' + X(x) + '" cy="' + Y(ys[i]) + '" r="2.2" fill="' + C.data + '" opacity=".38"/>'; });
    dec.forEach(function (g) {
      var xa = X(g.from - 0.4), xb = X(g.to + 0.4), y = Y(g.mean), part = g.n < 10;
      s += '<line x1="' + xa + '" x2="' + xb + '" y1="' + y + '" y2="' + y + '" stroke="' + C.trend + '" stroke-width="3.2" stroke-linecap="round"' + (part ? ' stroke-dasharray="4 3"' : '') + '/>' +
        '<text x="' + ((xa + xb) / 2) + '" y="' + (y - 6) + '" text-anchor="middle" class="lbl">' + fmt(g.mean, d) + (part ? '*' : '') + '</text>' +
        '<text x="' + ((xa + xb) / 2) + '" y="' + (H - 9) + '" text-anchor="middle">' + String(g.from).slice(2) + '–' + String(g.to).slice(2) + '</text>';
    });
    return { svg: s, n: dec.length, partial: dec.some(function (g) { return g.n < 10; }),
      xAt: function (i) { return (X(dec[i].from - 0.4) + X(dec[i].to + 0.4)) / 2; }, yAt: function (i) { return Y(dec[i].mean); },
      tip: function (i) { var g = dec[i]; return g.from + '–' + g.to + ': ' + fmt(g.mean, d) + ' ' + t('unit_' + v) + ' (' + t('nYears', { n: g.n }) + ')'; } };
  }

  /* month-by-month average for the first and last 10 complete years in [from, to] */
  function cycleData(cityId, v, from, to) {
    var c = App.data.cities[cityId], mo = c[v], st = c.start, full = [];
    for (var y = from; y <= to; y++) {
      var i0 = (y - st[0]) * 12 - (st[1] - 1), row = mo.slice(i0, i0 + 12);
      if (i0 >= 0 && row.length === 12 && row.every(function (x) { return x !== null && x !== undefined; })) full.push({ y: y, row: row });
    }
    var n = Math.min(10, Math.floor(full.length / 2));
    function avg(set) { var out = []; for (var m = 0; m < 12; m++) out.push(set.reduce(function (s, r) { return s + r.row[m]; }, 0) / set.length); return out; }
    var e = full.slice(0, n), l = full.slice(full.length - n);
    return { early: avg(e), late: avg(l), eLab: e[0].y + '–' + e[e.length - 1].y, lLab: l[0].y + '–' + l[l.length - 1].y, n: n };
  }
  function cycle(r, v, d, ctx) {
    var cd = cycleData(ctx.city, v, r.xs[0], r.xs[r.xs.length - 1]);
    var all = cd.early.concat(cd.late), yr = padRange(Math.min.apply(null, all), Math.max.apply(null, all), 0.1, 0.5);
    if (v !== 't2m') yr[0] = Math.max(0, yr[0]);
    var X = scaleX(0, 11), Y = scaleY(yr[0], yr[1]), M = t('monthsShort').split(',');
    var s = yGrid(Y, yr[0], yr[1], d) + unitText(t('unit_' + v));
    M.forEach(function (m, i) { s += '<text x="' + X(i) + '" y="' + (H - 9) + '" text-anchor="middle">' + m + '</text>'; });
    [['early', C.early], ['late', C.late]].forEach(function (p) {
      var arr = cd[p[0]];
      s += '<polyline fill="none" stroke="' + p[1] + '" stroke-width="2" stroke-linejoin="round" points="' + arr.map(function (y, i) { return X(i) + ',' + Y(y); }).join(' ') + '"/>';
      arr.forEach(function (y, i) { s += '<circle cx="' + X(i) + '" cy="' + Y(y) + '" r="3" fill="' + p[1] + '" stroke="#11151b" stroke-width="1.5"/>'; });
    });
    // direct labels at the right end (two series -> legend + direct labels)
    var ye = Y(cd.early[11]), yl = Y(cd.late[11]);
    if (Math.abs(ye - yl) < 11) { if (ye < yl) { ye -= 6; yl += 6; } else { ye += 6; yl -= 6; } }
    s += '<text x="' + (X(11) - 6) + '" y="' + (ye - 6) + '" text-anchor="end" class="lbl">' + cd.eLab + '</text>' +
      '<text x="' + (X(11) - 6) + '" y="' + (yl - 6) + '" text-anchor="end" class="lbl">' + cd.lLab + '</text>';
    return { svg: s, n: 12, cd: cd, xAt: function (i) { return X(i); }, yAt: function (i) { return Math.min(Y(cd.early[i]), Y(cd.late[i])); },
      tip: function (i) { return M[i] + ': ' + cd.eLab + ' ' + fmt(cd.early[i], d) + ' · ' + cd.lLab + ' ' + fmt(cd.late[i], d) + ' ' + t('unit_' + v); } };
  }

  var BODIES = { line: line, anom: anom, stripes: stripes, decades: decades, cycle: cycle };

  /* hover / tap layer: crosshair + label at the nearest mark */
  function addTip(svg, out) {
    var NS = 'http://www.w3.org/2000/svg';
    var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'tip'); g.setAttribute('pointer-events', 'none'); g.style.display = 'none';
    g.innerHTML = '<line class="tip-x" y1="' + T + '" y2="' + (H - B) + '"/><rect class="tip-bg" rx="6" height="18"/><text class="tip-t" y="0"></text>';
    var hit = document.createElementNS(NS, 'rect');
    var hl = out.left || L;
    hit.setAttribute('x', hl); hit.setAttribute('y', T); hit.setAttribute('width', W - hl - R); hit.setAttribute('height', H - T - B);
    hit.setAttribute('fill', 'transparent'); hit.setAttribute('class', 'hit');
    svg.appendChild(hit); svg.appendChild(g);
    function show(evt) {
      var box = svg.getBoundingClientRect(); if (!box.width) return;
      var px = (evt.clientX - box.left) / box.width * W, best = 0, bd = Infinity;
      for (var i = 0; i < out.n; i++) { var dd = Math.abs(out.xAt(i) - px); if (dd < bd) { bd = dd; best = i; } }
      var x = out.xAt(best), y = out.yAt(best), txt = out.tip(best);
      var ln = g.querySelector('.tip-x'), tx = g.querySelector('.tip-t'), bg = g.querySelector('.tip-bg');
      ln.setAttribute('x1', x); ln.setAttribute('x2', x);
      g.style.display = '';
      tx.textContent = txt;
      var w = Math.min(W - 8, (tx.getComputedTextLength() || txt.length * 5.3) + 14), bx = Math.max(4, Math.min(W - w - 4, x - w / 2)), by = Math.max(2, y - 30);
      bg.setAttribute('x', bx); bg.setAttribute('y', by); bg.setAttribute('width', w);
      tx.setAttribute('x', bx + w / 2); tx.setAttribute('y', by + 12.5);
      g.style.display = '';
    }
    hit.addEventListener('pointermove', show);
    hit.addEventListener('pointerdown', show);
    hit.addEventListener('pointerleave', function () { g.style.display = 'none'; });
  }

  /* Render chart type into svg. ctx = {city, variable, season, from, to}. Returns trend info r (+ chart extras). */
  function render(svg, type, ctx) {
    type = BODIES[type] ? type : 'line';
    var v = ctx.variable, d = v === 't2m' ? 1 : 2;
    var r = App.trendFor(ctx.city, v, ctx.season, ctx.from, ctx.to);
    if (r.xs.length < 8) { svg.innerHTML = ''; return r; }
    var out = BODIES[type](r, v, d, ctx);
    svg.setAttribute('aria-label', t('chartType_' + type) + '. ' + t('var_' + v) + ', ' + App.data.cities[ctx.city].name);
    svg.innerHTML = out.svg;
    addTip(svg, out);
    r.chart = out;
    return r;
  }

  /* Legend + "how to read" for a type (returns an element) */
  function legend(type, variable, r) {
    var h = App.h, P = poles(variable), sw = function (c, cls) { return h('span', { class: 'sw ' + (cls || ''), style: 'background:' + c }); };
    var box = h('div', { class: 'chart-legend' });
    if (type === 'line') box.appendChild(h('p', { class: 'legend' }, h('span', { class: 'dot' }), ' ' + t('legendData') + '   ', h('span', { class: 'dash' }), ' ' + t('legendTrend')));
    if (type === 'anom' || type === 'stripes') box.appendChild(h('p', { class: 'legend' }, sw(P.neg), ' ' + t('legNeg_' + variable) + '   ', sw(P.pos), ' ' + t('legPos_' + variable)));
    if (type === 'anom') box.appendChild(h('p', { class: 'legend' }, h('span', { class: 'dash' }), ' ' + t('legendTrend')));
    if (type === 'decades') box.appendChild(h('p', { class: 'legend' }, h('span', { class: 'dot faint' }), ' ' + t('legendData') + '   ', h('span', { class: 'bar-l' }), ' ' + t('legDecade')));
    if (type === 'cycle' && r && r.chart) box.appendChild(h('p', { class: 'legend' }, h('span', { class: 'sw', style: 'background:' + C.early }), ' ' + r.chart.cd.eLab + '   ', h('span', { class: 'sw', style: 'background:' + C.late }), ' ' + r.chart.cd.lLab));
    var how = t('chartHow_' + type);
    if ((type === 'anom' || type === 'stripes') && r && r.chart && !r.chart.base.ref) how += ' ' + t('baseShown');
    box.appendChild(h('p', { class: 'small how', text: how }));
    if (type === 'decades' && r && r.chart && r.chart.partial) box.appendChild(h('p', { class: 'small', text: t('decadePartial') }));
    if (type === 'cycle') box.appendChild(h('p', { class: 'small', text: t('cycleNote') }));
    return box;
  }

  /* Convenience for clues: a new <svg> for (city, variable, season, type) */
  function mini(cityId, variable, season, type) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('role', 'img');
    var r = render(svg, type || 'line', { city: cityId, variable: variable, season: season });
    return { svg: svg, info: r, legend: legend(type || 'line', variable, r) };
  }

  /* legacy signature kept for safety */
  function draw(svg, xs, ys, tr) { svg.innerHTML = line({ xs: xs, ys: ys, tr: tr }, 't2m', 1).svg; }

  window.Chart = { TYPES: TYPES, render: render, legend: legend, mini: mini, draw: draw };
})();
