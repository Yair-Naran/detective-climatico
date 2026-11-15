/* Detective's Archive (the challenge tool): place / variable / season / period -> series + Mann-Kendall trend.
   Extras: any place on Earth (live NASA POWER), 5 variables, compare places, hunch mode, CSV / PNG export. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var t = function (k, v) { return App.t(k, v); };
  var h = function () { return App.h.apply(null, arguments); };
  var backFn = null, backKey = 'back', chartType = 'line', busy = false;
  var VARS = ['t2m', 't2mmax', 't2mmin', 'prectotcorr', 'rh2m'];
  var PICKS = [   // quick picks for "any place": [label es, label en, lat, lon]
    ['Ciudad de México', 'Mexico City', 19.43, -99.13], ['Guadalajara', 'Guadalajara', 20.67, -103.35],
    ['Mérida', 'Mérida', 20.97, -89.62], ['Cancún', 'Cancún', 21.16, -86.85], ['Oaxaca', 'Oaxaca', 17.07, -96.73],
    ['Tijuana', 'Tijuana', 32.51, -117.04], ['Mexicali', 'Mexicali', 32.66, -115.47], ['Chihuahua', 'Chihuahua', 28.63, -106.07],
    ['La Paz, B.C.S.', 'La Paz, B.C.S.', 24.14, -110.31], ['Tapachula', 'Tapachula', 14.91, -92.26], ['Toluca', 'Toluca', 19.29, -99.65],
    ['Reikiavik (Islandia)', 'Reykjavík (Iceland)', 64.15, -21.94], ['Nairobi (Kenia)', 'Nairobi (Kenya)', -1.29, 36.82],
    ['Desierto del Sahara', 'Sahara Desert', 23.4, 13.2], ['Amazonia (Brasil)', 'Amazon (Brazil)', -3.1, -60.0]
  ];
  var hunchOn = !!App.store.get('hunchOn'), hunchDone = {};   // hunchDone[configKey] = true once answered or skipped

  function buildTypes() {
    var box = $('chartTypes'); box.innerHTML = '';
    Chart.TYPES.forEach(function (ty) {
      box.appendChild(h('button', { type: 'button', class: 'seg-btn' + (ty === chartType ? ' on' : ''), 'aria-pressed': ty === chartType ? 'true' : 'false',
        'data-type': ty, onclick: function () { chartType = ty; buildTypes(); render(); }, text: t('chartType_' + ty) }));
    });
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
    fillSelect($('city'), Object.keys(App.data.cities).map(function (k) { return { value: k, label: App.cityName(k) }; }), keep.city);
    fillSelect($('variable'), VARS.map(function (v) { return { value: v, label: t('var_' + v) }; }), keep.variable);
    fillSelect($('season'), ['annual', 'MAM', 'JJA', 'SON', 'DJF'].map(function (s) { return { value: s, label: t('season_' + s) }; }), keep.season);
  }

  // Only offer years that are complete for the chosen place/variable/season.
  function buildYears(keepFrom, keepTo) {
    var years = App.trendFor($('city').value, $('variable').value, $('season').value).years;
    if (!years.length) { fillSelect($('from'), [], ''); fillSelect($('to'), [], ''); return; }
    var y0 = years[0], y1 = years[years.length - 1];
    var ys = years.map(function (y) { return { value: y, label: String(y) }; });
    var clamp = function (v, d) { return v === undefined || v === '' ? d : Math.min(Math.max(+v, y0), y1); };
    fillSelect($('from'), ys, clamp(keepFrom, y0));
    fillSelect($('to'), ys, clamp(keepTo, y1));
  }

  function configKey() { return [$('city').value, $('variable').value, $('season').value, $('from').value, $('to').value].join('|'); }
  function setStatus(msg, cls) { var s = $('archiveStatus'); s.textContent = msg || ''; s.className = 'small status ' + (cls || ''); s.hidden = !msg; }

  /* make sure the chosen place has the chosen variable (built-in places load the extras live), then call done() */
  function ensure(done) {
    var cid = $('city').value, v = $('variable').value, c = App.data.cities[cid];
    if (c && c[v]) return done();
    setStatus(t('varLoading'), 'load'); busy = true;
    Power.ensureExtras(cid).then(function () { busy = false; setStatus(''); done(); }, function () {
      busy = false; setStatus(t('varErr'), 'err'); $('variable').value = 't2m'; done();
    });
  }

  function onChange() { ensure(function () { buildYears($('from').value, $('to').value); render(); }); }

  /* ---------- result + hunch ---------- */
  function verdictText(vd) { return t(vd === 'up' ? 'verdictUp' : vd === 'down' ? 'verdictDown' : 'verdictNone'); }

  function showResult(res, r, v, vd) {
    res.className = 'result ' + vd;
    res.innerHTML = '';
    res.appendChild(h('strong', { text: verdictText(vd) }));
    res.appendChild(h('div', { class: 'nums' },
      h('span', null, t('rate') + ': ', h('b', { text: App.fmtRate(r.tr, v) })),
      h('span', null, t('pvalue') + ': ', h('b', { text: App.fmtP(r.tr.p) })),
      h('span', null, t('yearsUsed') + ': ', h('b', { text: r.xs.length + ' (' + r.xs[0] + '–' + r.xs[r.xs.length - 1] + ')' }))));
    if (vd === 'none') res.appendChild(h('p', { class: 'note', text: t('verdictNoneNote') }));
    if (r.xs.length < 15) res.appendChild(h('p', { class: 'note', text: t('verdictShort') }));
  }

  function hunchCard(res, r, v, vd, key) {
    res.className = 'result hunch'; res.innerHTML = '';
    res.appendChild(h('strong', { text: t('hunchQ') }));
    res.appendChild(h('p', { class: 'small', text: t('hunchHelp') }));
    var row = h('div', { class: 'options' });
    [['up', 'opt_sigUp'], ['none', 'opt_none'], ['down', 'opt_sigDown']].forEach(function (o) {
      row.appendChild(h('button', { class: 'opt', type: 'button', 'data-hunch': o[0], text: t(o[1]), onclick: function () {
        var st = App.store.get('hunch') || { right: 0, total: 0 }, ok = o[0] === vd;
        st.total++; if (ok) st.right++; App.store.set('hunch', st);
        hunchDone[key] = true; render();
        var fb = h('p', { class: ok ? 'ok' : 'warn', 'data-hunch-fb': ok ? 'right' : 'wrong', text: (ok ? t('hunchRight') : t('hunchWrong')) + ' ' + t('hunchScore', { n: st.right, m: st.total }) });
        $('result').insertBefore(fb, $('result').firstChild);
        if (window.Sound) Sound.sfx(ok ? 'good' : 'bad');
      } }));
    });
    res.appendChild(row);
    res.appendChild(h('button', { class: 'btn ghost', type: 'button', text: t('hunchSkip'), onclick: function () { hunchDone[key] = true; render(); } }));
  }

  function render() {
    var cid = $('city').value, v = $('variable').value, season = $('season').value;
    var c = App.data.cities[cid];
    $('elev').textContent = t('elevation') + ': ' + Math.round(c.elevation_m) + ' m' + (c.custom ? ' · ' + c.lat.toFixed(2) + ', ' + c.lon.toFixed(2) : '');
    $('maxminNote').hidden = !(v === 't2mmax' || v === 't2mmin');
    $('varIco').src = 'assets/icons/' + Assets.varIcon(v) + '.webp';
    var res = $('result'), svg = $('chart'), lg = $('chartLegend');
    var r = Chart.render(svg, chartType, { city: cid, variable: v, season: season, from: +$('from').value, to: +$('to').value });
    lg.innerHTML = '';
    $('tools').hidden = r.xs.length < 8;
    if (r.xs.length < 8) {
      res.className = 'result none';
      res.innerHTML = ''; res.appendChild(h('strong', { text: t('notEnough') }));
      renderCompare();
      return;
    }
    lg.appendChild(Chart.legend(chartType, v, r));
    var vd = App.verdict(r.tr), key = configKey();
    svg.setAttribute('aria-label', svg.getAttribute('aria-label') + '. ' + verdictText(vd) + ' ' + App.fmtRate(r.tr, v) + ', p ' + App.fmtP(r.tr.p));
    if (hunchOn && !hunchDone[key]) hunchCard(res, r, v, vd, key); else showResult(res, r, v, vd);
    renderCompare();
  }

  /* ---------- compare places ---------- */
  function renderCompare() {
    var box = $('compareBody'); if (!box) return;
    var v = $('variable').value, season = $('season').value, from = +$('from').value, to = +$('to').value;
    var rows = Object.keys(App.data.cities).map(function (id) {
      var c = App.data.cities[id]; if (!c[v]) return null;
      var r = App.trendFor(id, v, season, from, to);
      return { id: id, r: r, ok: r.xs.length >= 8 && r.tr };
    }).filter(Boolean);
    var tbl = h('table', { class: 'cmp' }, h('thead', null, h('tr', null,
      h('th', { scope: 'col', text: t('cmpPlace') }), h('th', { scope: 'col', text: t('rate') }), h('th', { scope: 'col', text: t('pvalue') }), h('th', { scope: 'col', text: t('cmpVerdict') }))));
    var tb = h('tbody');
    rows.forEach(function (x) {
      var vd = x.ok ? App.verdict(x.r.tr) : null;
      tb.appendChild(h('tr', { class: vd ? 'v-' + vd : '' },
        h('th', { scope: 'row', text: App.cityName(x.id) }),
        h('td', { text: x.ok ? App.fmtRate(x.r.tr, v) : '—' }),
        h('td', { text: x.ok ? App.fmtP(x.r.tr.p) : '—' }),
        h('td', { text: vd ? t('short_' + vd) : '—' })));
    });
    tbl.appendChild(tb);
    box.innerHTML = ''; box.appendChild(h('div', { class: 'cmp-wrap', tabindex: '0', role: 'region', 'aria-label': t('cmpTitle') }, tbl));
    $('compareHint').textContent = t('cmpFor', { v: t('var_' + v), s: t('season_' + season), a: from || '', b: to || '' });
  }

  /* ---------- export ---------- */
  function download(name, blob) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  }
  function slug() { return [$('city').value, $('variable').value, $('season').value, $('from').value + '-' + $('to').value].join('_'); }
  function exportCsv() {
    var cid = $('city').value, v = $('variable').value, c = App.data.cities[cid];
    var r = App.trendFor(cid, v, $('season').value, +$('from').value, +$('to').value);
    var lines = ['# The Climate Case Files export. Source: NASA POWER (MERRA-2 / GPM IMERG), monthly, community AG. Grid cell ~0.5 x 0.625 deg, not a weather station.',
      '# place: ' + App.cityName(cid) + ' (lat ' + c.lat + ', lon ' + c.lon + ', elevation ' + Math.round(c.elevation_m) + ' m)',
      '# variable: ' + t('var_' + v) + ' [' + t('unit_' + v) + '], season: ' + t('season_' + $('season').value),
      '# Mann-Kendall + Sen slope: ' + App.fmtRate(r.tr, v) + ', p = ' + App.fmtP(r.tr.p) + ', n = ' + r.xs.length,
      'year,value'];
    r.xs.forEach(function (y, i) { lines.push(y + ',' + r.ys[i].toFixed(4)); });
    download('climate-detective_' + slug() + '.csv', new Blob([lines.join('\n') + '\n'], { type: 'text/csv;charset=utf-8' }));
  }
  function exportPng() {
    var svg = $('chart'), inner = svg.cloneNode(true);
    [].slice.call(inner.querySelectorAll('.tip, .hit')).forEach(function (n) { n.remove(); });
    var cid = $('city').value, v = $('variable').value, title = App.cityName(cid) + ' · ' + t('var_' + v) + ' · ' + t('season_' + $('season').value) + ' · ' + $('from').value + '–' + $('to').value;
    var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var src = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 292" width="1080" height="876" font-family="system-ui, sans-serif">' +
      '<style>text{fill:#98a2b0;font-size:10px}text.lbl{fill:#f3f5f8;font-weight:700;font-size:9.5px}</style>' +
      '<rect width="360" height="292" fill="#0e1116"/><text x="12" y="17" style="fill:#f3f5f8;font-size:11px;font-weight:700">' + esc(title) + '</text>' +
      '<g transform="translate(0,24)">' + inner.innerHTML + '</g>' +
      '<text x="12" y="284" style="font-size:8.5px">' + esc('NASA POWER (MERRA-2 / GPM IMERG) · ' + $('chartTypes').querySelector('.on').textContent + ' · The Climate Case Files') + '</text></svg>';
    var img = new Image();
    img.onload = function () {
      var cv = document.createElement('canvas'); cv.width = 1080; cv.height = 876;
      cv.getContext('2d').drawImage(img, 0, 0, 1080, 876);
      cv.toBlob(function (b) { if (b) download('climate-detective_' + slug() + '.png', b); }, 'image/png');
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src);
  }

  /* ---------- any place on Earth ---------- */
  function buildCustom() {
    var box = $('customBox'); box.innerHTML = '';
    var d = h('details', { class: 'custom' }, h('summary', { text: t('customTitle') }));
    var pick = h('select', { id: 'pickSel', 'aria-label': t('customPick') }, h('option', { value: '', text: t('customPick') }));
    PICKS.forEach(function (p, i) { pick.appendChild(h('option', { value: String(i), text: p[App.lang === 'en' ? 1 : 0] })); });
    var lat = h('input', { id: 'latIn', type: 'number', step: '0.01', min: '-90', max: '90', inputmode: 'decimal', placeholder: '20.12' });
    var lon = h('input', { id: 'lonIn', type: 'number', step: '0.01', min: '-180', max: '180', inputmode: 'decimal', placeholder: '-98.73' });
    var nm = h('input', { id: 'nameIn', type: 'text', maxlength: '40', placeholder: t('customName') });
    pick.addEventListener('change', function () {
      var p = PICKS[+pick.value]; if (!p) return;
      lat.value = p[2]; lon.value = p[3]; nm.value = p[App.lang === 'en' ? 1 : 0];
    });
    var go = h('button', { class: 'btn primary', type: 'button', id: 'customGo', text: t('customGo'), onclick: function () {
      var la = parseFloat(lat.value), lo = parseFloat(lon.value);
      if (!(la >= -90 && la <= 90 && lo >= -180 && lo <= 180)) { setStatus(t('customBad'), 'err'); return; }
      if (busy) return;
      busy = true; go.disabled = true; setStatus(t('customLoading'), 'load');
      Power.addCustom(la, lo, (nm.value || '').trim().slice(0, 40)).then(function () {
        busy = false; go.disabled = false; setStatus('');
        var keep = { city: 'custom', variable: $('variable').value, season: $('season').value };
        buildControls(keep); ensure(function () { buildYears(); render(); });
        if (window.Sound) Sound.sfx('good');
      }, function () { busy = false; go.disabled = false; setStatus(t('customErr'), 'err'); });
    } });
    d.appendChild(h('p', { class: 'small', text: t('customHint') }));
    d.appendChild(h('label', null, h('span', { text: t('customPick') }), pick));
    d.appendChild(h('div', { class: 'two' }, h('label', null, h('span', { text: t('customLat') }), lat), h('label', null, h('span', { text: t('customLon') }), lon)));
    d.appendChild(h('label', null, h('span', { text: t('customName') }), nm));
    d.appendChild(go);
    box.appendChild(d);
  }

  function buildTools() {
    var box = $('tools'); box.innerHTML = '';
    box.appendChild(h('button', { class: 'btn', type: 'button', id: 'dlCsv', text: t('dlCsv'), onclick: exportCsv }));
    box.appendChild(h('button', { class: 'btn', type: 'button', id: 'dlPng', text: t('dlPng'), onclick: exportPng }));
    var lab = h('label', { class: 'hunch-toggle' });
    var cb = h('input', { type: 'checkbox', id: 'hunchChk' }); cb.checked = hunchOn;
    cb.addEventListener('change', function () { hunchOn = cb.checked; App.store.set('hunchOn', hunchOn); hunchDone = {}; render(); });
    lab.appendChild(cb); lab.appendChild(h('span', { text: ' ' + t('hunchMode') }));
    box.appendChild(lab);
  }

  function rebuild() {
    var keep = { city: $('city').value, variable: $('variable').value, season: $('season').value };
    var f = $('from').value, to = $('to').value;
    buildControls(keep); buildYears(f, to); buildTypes(); buildCustom(); buildTools(); render();
    $('archiveBack').textContent = t(backKey);
  }

  var Archive = {
    init: function () {
      buildControls(); buildYears(); buildTypes(); buildCustom(); buildTools(); render();
      $('archiveGloss').addEventListener('click', function () { Glossary.open(function () { App.show('archive'); }); });
      ['from', 'to'].forEach(function (id) { $(id).addEventListener('change', render); });
      ['city', 'variable', 'season'].forEach(function (id) { $(id).addEventListener('change', onChange); });
      $('archiveBack').addEventListener('click', function () { var fn = backFn; backFn = null; (fn || function () { App.show('home'); })(); });
      App.onLang(function () { rebuild(); });
    },
    /* preset: {city, variable, season, chart}; onBack: function; backLabelKey: i18n key */
    open: function (preset, onBack, backLabelKey) {
      preset = preset || {};
      chartType = preset.chart || 'line';
      buildControls(preset); buildYears(); buildTypes(); render();
      backFn = onBack || null; backKey = backLabelKey || 'back';
      $('archiveBack').textContent = t(backKey);
      App.show('archive');
    }
  };
  window.Archive = Archive;
})();
