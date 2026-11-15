/* Offline support: cache the app shell and the built-in data on first visit; network-first so updates always win when online.
   NASA POWER requests (live places / extra variables) are not cached here: js/power.js keeps its own 30-day cache. */
const CACHE = 'detective-v4';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'assets/cover/cover-sm.webp', 'assets/team/logo-sm.webp', 'css/style.css', 'i18n/strings.js', 'data/series.json',
  'js/stats.js', 'js/core.js', 'js/motion.js', 'js/icons.js', 'js/stripes.js', 'js/chart.js', 'js/art.js', 'js/cinematic.js', 'js/levels-data.js',
  'js/assets.js', 'js/power.js', 'js/audio.js', 'js/glossary.js', 'js/archive.js', 'js/tutorial.js', 'js/level.js', 'js/app.js',
  'fonts/ClimateCrisis-YEAR.woff2', 'fonts/Anybody-normal.woff2', 'fonts/Anybody-italic.woff2', 'fonts/AtkinsonHyperlegibleNext-normal.woff2', 'fonts/AtkinsonHyperlegibleNext-italic.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
});
