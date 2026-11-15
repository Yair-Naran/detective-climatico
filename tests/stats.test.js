/* Unit tests for js/stats.js: hand-checkable cases + every city/variable/season compared with scipy
   (tests/scipy-fixtures.json: scipy.stats.theilslopes slope; p-values from the pymannkendall original test (same continuity-corrected test) and, as a looser cross-check, scipy.stats.kendalltau; generated from data/series.json). */
const fs = require('fs'), path = require('path'), assert = require('assert');
const Stats = require('../js/stats.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/series.json'), 'utf8'));
const fx = JSON.parse(fs.readFileSync(path.join(__dirname, 'scipy-fixtures.json'), 'utf8'));
let n = 0; const ok = (name, fn) => { fn(); n++; console.log('  ok  ' + name); };

ok('perfect increasing series: S = n(n-1)/2, slope = 1, p < 0.001', () => {
  const xs = [...Array(12).keys()].map(i => 2000 + i), ys = xs.map(x => x - 2000);
  const t = Stats.trend(xs, ys);
  assert.strictEqual(t.S, 66); assert.strictEqual(t.slopePerYear, 1); assert.ok(t.p < 0.001);
});
ok('perfect decreasing series: negative slope and S', () => {
  const xs = [...Array(12).keys()], t = Stats.trend(xs, xs.map(x => 50 - 2 * x));
  assert.strictEqual(t.S, -66); assert.strictEqual(t.slopePerYear, -2); assert.ok(t.p < 0.001);
});
ok('constant series: no trend, p = 1', () => {
  const t = Stats.trend([1, 2, 3, 4, 5, 6], [3, 3, 3, 3, 3, 3]); assert.strictEqual(t.S, 0); assert.ok(Math.abs(t.p - 1) < 1e-6);
});
ok('fewer than 4 points: null', () => assert.strictEqual(Stats.trend([1, 2, 3], [1, 2, 3]), null));
ok('Sen slope is robust to one outlier', () => {
  const xs = [...Array(15).keys()], ys = xs.map(x => 0.5 * x); ys[14] = 500;
  assert.ok(Math.abs(Stats.trend(xs, ys).slopePerYear - 0.5) < 0.05);
});
ok('aggregate keeps only complete seasons (DJF uses December of the previous year)', () => {
  const m = []; for (let i = 0; i < 26; i++) m.push(i + 1);          // Jan 2000 .. Feb 2002
  const a = Stats.aggregate(m, [2000, 1], 'DJF');
  assert.deepStrictEqual(a.years, [2001, 2002]);                    // winter 2000 lacks its December
  assert.strictEqual(a.values[0], (12 + 13 + 14) / 3);
  assert.deepStrictEqual(Stats.aggregate(m, [2000, 1], 'annual').years, [2000, 2001]);
});
ok('normal CDF sanity', () => { assert.ok(Math.abs(Stats.normCdf(0) - 0.5) < 1e-6); assert.ok(Math.abs(Stats.normCdf(1.96) - 0.975) < 1e-3); });

let worstP = 0, worstS = 0;
fx.forEach(f => {
  const c = data.cities[f.city], a = Stats.aggregate(c[f.variable], c.start, f.season), t = Stats.trend(a.years, a.values);
  assert.strictEqual(a.years.length, f.n, `${f.city} ${f.variable} ${f.season}: n`);
  assert.strictEqual(a.years[0], f.first); assert.strictEqual(a.years[a.years.length - 1], f.last);
  worstS = Math.max(worstS, Math.abs(t.slopePerYear - f.slope)); worstP = Math.max(worstP, Math.abs(t.p - f.p));
  assert.ok(Math.abs(t.slopePerYear - f.slope) < 1e-9, `${f.city} ${f.variable} ${f.season}: slope ${t.slopePerYear} vs ${f.slope}`);
  assert.ok(Math.abs(t.p - f.mk_p) < 1e-4, `${f.city} ${f.variable} ${f.season}: p ${t.p} vs pymannkendall ${f.mk_p}`);
  assert.ok(Math.abs(t.p - f.p) < 0.015, `${f.city} ${f.variable} ${f.season}: p ${t.p} vs scipy ${f.p}`);
  // same verdict at p < 0.05 unless the p-value sits right on the threshold (normal approximation vs scipy's exact handling)
  if (Math.abs(f.p - 0.05) > 0.01) assert.strictEqual(t.p < 0.05, f.p < 0.05, `${f.city} ${f.variable} ${f.season}: verdict`);
});
n++; console.log(`  ok  ${fx.length} city/variable/season combinations match scipy / pymannkendall (max slope diff ${worstS.toExponential(1)}, max p diff ${worstP.toFixed(4)})`);

ok('data file: 3 cities, contiguous monthly series, no gaps', () => {
  Object.values(data.cities).forEach(c => {
    const months = (c.end[0] - c.start[0]) * 12 + (c.end[1] - c.start[1]) + 1;
    assert.strictEqual(c.t2m.length, months); assert.strictEqual(c.prectotcorr.length, months);
    assert.ok(c.t2m.every(v => typeof v === 'number') && c.prectotcorr.every(v => typeof v === 'number'));
  });
});
console.log(`\n${n} groups passed`);
