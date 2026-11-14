/* Draws a yearly time series + Sen trend line into an <svg viewBox="0 0 360 230">. */
(function () {
  'use strict';
  function draw(svg, xs, ys, tr, unitLabel, decimals) {
    var W = 360, H = 230, L = 40, R = 10, T = 14, B = 28;
    var xmin = xs[0], xmax = xs[xs.length - 1];
    var ymin = Math.min.apply(null, ys), ymax = Math.max.apply(null, ys);
    var pad = (ymax - ymin) * 0.1 || 0.5; ymin -= pad; ymax += pad;
    var X = function (x) { return L + (x - xmin) / (xmax - xmin || 1) * (W - L - R); };
    var Y = function (y) { return T + (1 - (y - ymin) / (ymax - ymin)) * (H - T - B); };
    var s = '';
    for (var i = 0; i <= 4; i++) {
      var yv = ymin + (ymax - ymin) * i / 4;
      s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(yv) + '" y2="' + Y(yv) + '" stroke="#223a5c"/>' +
        '<text x="' + (L - 4) + '" y="' + (Y(yv) + 3) + '" text-anchor="end">' + yv.toFixed(decimals) + '</text>';
    }
    var step = xmax - xmin > 30 ? 10 : xmax - xmin > 14 ? 5 : 2;
    for (var x = Math.ceil(xmin / step) * step; x <= xmax; x += step)
      s += '<text x="' + X(x) + '" y="' + (H - 10) + '" text-anchor="middle">' + x + '</text>';
    s += '<text x="6" y="10">' + unitLabel + '</text>';
    s += '<polyline fill="none" stroke="#4cc9f0" stroke-width="1.2" opacity=".6" points="' +
      xs.map(function (x, i) { return X(x) + ',' + Y(ys[i]); }).join(' ') + '"/>';
    xs.forEach(function (x, i) { s += '<circle cx="' + X(x) + '" cy="' + Y(ys[i]) + '" r="2.6" fill="#4cc9f0"/>'; });
    if (tr) {
      var y0 = tr.intercept + tr.slopePerYear * xmin, y1 = tr.intercept + tr.slopePerYear * xmax;
      s += '<line x1="' + X(xmin) + '" y1="' + Y(y0) + '" x2="' + X(xmax) + '" y2="' + Y(y1) + '" stroke="#ffb703" stroke-width="2" stroke-dasharray="5 4"/>';
    }
    svg.innerHTML = s;
  }

  /* Convenience: returns a new <svg> for (city, variable, season) using App data. */
  function mini(cityId, variable, season) {
    var r = App.trendFor(cityId, variable, season);
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 360 230');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', App.t('chartTitle'));
    draw(svg, r.xs, r.ys, r.tr, App.t('unit_' + variable), variable === 't2m' ? 1 : 2);
    return { svg: svg, info: r };
  }

  window.Chart = { draw: draw, mini: mini };
})();
