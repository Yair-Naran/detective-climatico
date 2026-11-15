/* Live NASA POWER access (monthly point data). Lets the Archive investigate any place on Earth and load the extra
   variables (daily max / min temperature, humidity) for the three built-in places.
   Works offline for cached places; the three built-in places always work from data/series.json.
   API: https://power.larc.nasa.gov/api/temporal/monthly/point  (CORS enabled, no key). Missing values are -999. */
(function () {
  'use strict';
  var BASE = 'https://power.larc.nasa.gov/api/temporal/monthly/point';
  var PARAMS = { t2m: 'T2M', t2mmax: 'T2M_MAX', t2mmin: 'T2M_MIN', prectotcorr: 'PRECTOTCORR', rh2m: 'RH2M' };
  var KEYS = Object.keys(PARAMS);
  var TTL = 30 * 24 * 3600 * 1000;      // cached points are kept 30 days
  var mem = {};

  function cacheKey(lat, lon) { return 'pt_' + lat.toFixed(2) + '_' + lon.toFixed(2); }

  /* POWER response -> {start, end, elevation_m, <var>: [monthly values or null]} on a contiguous monthly grid from 1981-01 */
  function parse(j, lat, lon) {
    var p = j.properties.parameter, first = [1981, 1];
    var t2m = p.T2M || {}, last = null;
    Object.keys(t2m).forEach(function (k) {
      var y = +k.slice(0, 4), m = +k.slice(4);
      if (m < 1 || m > 12 || t2m[k] === -999) return;
      if (!last || y > last[0] || (y === last[0] && m > last[1])) last = [y, m];
    });
    if (!last) throw new Error('empty');
    var n = (last[0] - first[0]) * 12 + (last[1] - first[1]) + 1, out = { start: first, end: last, lat: lat, lon: lon,
      elevation_m: j.geometry && j.geometry.coordinates ? j.geometry.coordinates[2] : 0 };
    KEYS.forEach(function (v) {
      var src = p[PARAMS[v]] || {}, arr = [];
      for (var i = 0; i < n; i++) {
        var y = first[0] + Math.floor(i / 12), m = (i % 12) + 1, val = src[y * 100 + m];
        arr.push(val === undefined || val === -999 ? null : val);
      }
      out[v] = arr;
    });
    return out;
  }

  /* Promise -> parsed point. lat in [-90, 90], lon in [-180, 180]. */
  function fetchPoint(lat, lon) {
    lat = Math.round(lat * 100) / 100; lon = Math.round(lon * 100) / 100;
    var key = cacheKey(lat, lon);
    if (mem[key]) return Promise.resolve(mem[key]);
    var hit = App.store.get(key);
    if (hit && hit.t && Date.now() - hit.t < TTL && hit.d) { mem[key] = hit.d; return Promise.resolve(hit.d); }
    var url = BASE + '?parameters=' + KEYS.map(function (v) { return PARAMS[v]; }).join(',') + '&community=AG&longitude=' + lon +
      '&latitude=' + lat + '&start=1981&end=' + new Date().getFullYear() + '&format=JSON';
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 25000);
    return fetch(url, ctl ? { signal: ctl.signal } : undefined).then(function (r) {
      clearTimeout(timer);
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (j) {
      var d = parse(j, lat, lon); mem[key] = d; App.store.set(key, { t: Date.now(), d: d }); return d;
    }, function (e) { clearTimeout(timer); throw e; });
  }

  /* Add the variables a built-in city lacks (aligned to the city's own monthly grid). */
  function ensureExtras(cityId) {
    var c = App.data.cities[cityId];
    if (!c) return Promise.reject(new Error('no city'));
    if (c.t2mmax && c.t2mmin && c.rh2m) return Promise.resolve(c);
    return fetchPoint(c.lat, c.lon).then(function (d) {
      var n = c.t2m.length;
      ['t2mmax', 't2mmin', 'rh2m'].forEach(function (v) {
        var a = d[v].slice(0, n); while (a.length < n) a.push(null); c[v] = a;
      });
      return c;
    });
  }

  /* Build a city-like object for a custom place and register it as App.data.cities.custom. */
  function addCustom(lat, lon, name) {
    return fetchPoint(lat, lon).then(function (d) {
      var c = { name: name || (Math.abs(lat).toFixed(2) + (lat < 0 ? '°S ' : '°N ') + Math.abs(lon).toFixed(2) + (lon < 0 ? '°W' : '°E')),
        region: 'custom', lat: lat, lon: lon, elevation_m: d.elevation_m, start: d.start, end: d.end, custom: true };
      KEYS.forEach(function (v) { c[v] = d[v]; });
      App.data.cities.custom = c;
      return c;
    });
  }

  window.Power = { fetchPoint: fetchPoint, ensureExtras: ensureExtras, addCustom: addCustom, parse: parse, VARS: KEYS };
})();
