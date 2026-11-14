/* Trend statistics: Mann-Kendall (tie-corrected), Sen's slope, annual/seasonal aggregation.
   Pure functions, no DOM. Works in browser (window.Stats) and Node (module.exports). */
(function (root) {
  'use strict';

  // Standard normal CDF (Abramowitz-Stegun 7.1.26 via erf)
  function erf(x) {
    var s = x < 0 ? -1 : 1; x = Math.abs(x);
    var t = 1 / (1 + 0.3275911 * x);
    var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return s * y;
  }
  function normCdf(z) { return 0.5 * (1 + erf(z / Math.SQRT2)); }

  function median(a) {
    var b = a.slice().sort(function (x, y) { return x - y; });
    var n = b.length, m = n >> 1;
    return n % 2 ? b[m] : (b[m - 1] + b[m]) / 2;
  }

  /** Mann-Kendall test + Sen's slope. xs = years, ys = values (same length, no nulls). */
  function trend(xs, ys) {
    var n = ys.length;
    if (n < 4) return null;
    var S = 0, slopes = [];
    for (var i = 0; i < n - 1; i++) {
      for (var j = i + 1; j < n; j++) {
        var d = ys[j] - ys[i];
        S += d > 0 ? 1 : d < 0 ? -1 : 0;
        slopes.push(d / (xs[j] - xs[i]));
      }
    }
    // tie correction
    var counts = {};
    ys.forEach(function (v) { counts[v] = (counts[v] || 0) + 1; });
    var tieTerm = 0;
    Object.keys(counts).forEach(function (k) {
      var t = counts[k];
      if (t > 1) tieTerm += t * (t - 1) * (2 * t + 5);
    });
    var varS = (n * (n - 1) * (2 * n + 5) - tieTerm) / 18;
    var z = S > 0 ? (S - 1) / Math.sqrt(varS) : S < 0 ? (S + 1) / Math.sqrt(varS) : 0;
    var p = 2 * (1 - normCdf(Math.abs(z)));
    var slope = median(slopes);                       // units per year
    var intercept = median(ys.map(function (y, i) { return y - slope * xs[i]; }));
    return { n: n, S: S, varS: varS, z: z, p: p, slopePerYear: slope, slopePerDecade: slope * 10, intercept: intercept };
  }

  var SEASONS = {            // months (1-12); DJF uses Dec of previous year
    annual: [1,2,3,4,5,6,7,8,9,10,11,12],
    MAM: [3,4,5], JJA: [6,7,8], SON: [9,10,11], DJF: [12,1,2]
  };

  /** Aggregate a monthly array (start=[y,m]) into one value per year for a season.
      kind: 'mean' (T2M, mm/day) or 'sum' not needed: both are monthly means -> average of months.
      Only complete seasons are kept. Returns {years:[], values:[]}. */
  function aggregate(monthly, start, season) {
    var months = SEASONS[season] || SEASONS.annual;
    var idx = function (y, m) { return (y - start[0]) * 12 + (m - start[1]); };
    var lastIdx = monthly.length - 1;
    var firstYear = start[0], lastYear = start[0] + Math.floor((start[1] - 1 + lastIdx) / 12);
    var years = [], values = [];
    for (var y = firstYear; y <= lastYear; y++) {
      var sum = 0, ok = true;
      for (var k = 0; k < months.length; k++) {
        var m = months[k], yy = (season === 'DJF' && m === 12) ? y - 1 : y;
        var i = idx(yy, m);
        var v = (i >= 0 && i <= lastIdx) ? monthly[i] : null;
        if (v === null || v === undefined) { ok = false; break; }
        sum += v;
      }
      if (ok) { years.push(y); values.push(sum / months.length); }
    }
    return { years: years, values: values };
  }

  var api = { trend: trend, aggregate: aggregate, normCdf: normCdf, median: median, SEASONS: SEASONS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Stats = api;
})(typeof window !== 'undefined' ? window : globalThis);
