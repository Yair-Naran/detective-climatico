/* Core: language, storage, screens, DOM helper, data access. Loaded first (after i18n/strings.js and js/stats.js). */
(function () {
  'use strict';
  var params = new URLSearchParams(location.search);
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem('dc_' + k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem('dc_' + k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  var lang = params.get('lang');
  if (lang !== 'en' && lang !== 'es') {
    lang = store.get('lang') || ((navigator.language || 'es').slice(0, 2) === 'en' ? 'en' : 'es');
  }
  var listeners = [];

  var App = {
    data: null,
    lang: lang,
    store: store,
    current: null,

    t: function (k, vars) {
      var s = window.I18N[App.lang] && window.I18N[App.lang][k];
      if (s === undefined || s === null) s = window.I18N.es[k] !== undefined ? window.I18N.es[k] : k;
      if (vars) s = s.replace(/\{(\w+)\}/g, function (_, n) { return vars[n] !== undefined ? vars[n] : ''; });
      return s;
    },

    has: function (k) { return !!(window.I18N[App.lang] && window.I18N[App.lang][k] !== undefined); },

    applyI18n: function () {
      document.documentElement.lang = App.lang;
      document.title = App.t('title');
      document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = App.t(el.getAttribute('data-i18n')); });
    },

    setLang: function (l) {
      App.lang = l;
      store.set('lang', l);
      var u = new URL(location.href); u.searchParams.set('lang', l);
      history.replaceState(null, '', u.toString());
      App.applyI18n();
      listeners.forEach(function (fn) { fn(); });
    },
    onLang: function (fn) { listeners.push(fn); },

    show: function (name) {
      document.querySelectorAll('.screen').forEach(function (s) { s.hidden = s.id !== 'screen-' + name; });
      if (name !== 'level') document.body.removeAttribute('data-zone');
      App.current = name;
      window.scrollTo(0, 0);
    },

    /* h('div', {class:'x', onclick:fn}, child, 'text', [children]) */
    h: function (tag, props) {
      var el = document.createElement(tag);
      if (props) Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v === undefined || v === null || v === false) return;
        if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
        else if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'style') el.setAttribute('style', v);
        else el.setAttribute(k, v === true ? '' : v);
      });
      for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
      return el;
    },

    /* Trend for a city/variable/season, optionally restricted to [from, to]. */
    trendFor: function (cityId, variable, season, from, to) {
      var c = App.data.cities[cityId];
      var agg = Stats.aggregate(c[variable], c.start, season || 'annual');
      var xs = [], ys = [];
      agg.years.forEach(function (y, i) {
        if ((from === undefined || y >= from) && (to === undefined || y <= to)) { xs.push(y); ys.push(agg.values[i]); }
      });
      return { xs: xs, ys: ys, tr: xs.length >= 4 ? Stats.trend(xs, ys) : null, years: agg.years, values: agg.values };
    },

    /* 'up' | 'down' | 'none' */
    verdict: function (tr) { return tr.p >= 0.05 ? 'none' : tr.slopePerYear > 0 ? 'up' : 'down'; },
    fmtRate: function (tr, variable) {
      var d = variable === 't2m' ? 2 : 3, v = tr.slopePerDecade;
      return (v >= 0 ? '+' : '') + v.toFixed(d) + ' ' + App.t('unitDecade_' + variable);
    },
    fmtP: function (p) { return p < 0.001 ? '< 0.001' : p.toFixed(3); }
  };

  function append(el, c) {
    if (c === undefined || c === null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { append(el, x); }); return; }
    el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }

  window.App = App;
})();
