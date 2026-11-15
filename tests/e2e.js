/* End-to-end tests (Playwright + Chrome, no network needed: NASA POWER calls are answered with a synthetic payload).
   Run: npm install && npm run test:e2e        (set CHROME=/path/to/chrome if it is not at a standard location)
   Covers: home + routes + ES/EN, console errors, external requests, the Archive (5 variables, any place, compare, hunch,
   CSV/PNG export), the tutorial, a full playthrough of the three cases (to the results screen and share card),
   the sound toggle, keyboard access, and mobile layout (no horizontal scroll). */
const http = require('http'), fs = require('fs'), path = require('path'), assert = require('assert');
const { chromium } = require('playwright-core');
const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml' };
const CHROME = process.env.CHROME || ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].find(p => fs.existsSync(p));

function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      let f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0])); if (f.endsWith(path.sep) || !path.extname(f)) f = path.join(f, 'index.html');
      if (!f.startsWith(ROOT) || !fs.existsSync(f)) { rsp.writeHead(404); return rsp.end('nf'); }
      rsp.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); rsp.end(fs.readFileSync(f));
    }).listen(0, () => res({ srv, url: 'http://localhost:' + srv.address().port + '/' }));
  });
}

/* synthetic NASA POWER monthly payload: warming temperature, drying rain; last two months missing (-999) like the real API */
function fakePower(lat) {
  const P = { T2M: {}, T2M_MAX: {}, T2M_MIN: {}, PRECTOTCORR: {}, RH2M: {} };
  for (let y = 1981; y <= 2026; y++) for (let m = 1; m <= 12; m++) {
    const k = String(y * 100 + m), miss = y === 2026 && m > 9, s = Math.sin((m - 1) / 12 * 2 * Math.PI), n = ((y * 7 + m * 13) % 10) / 10 - 0.5;
    P.T2M[k] = miss ? -999 : +(18 + 0.04 * (y - 1981) + 4 * s + n).toFixed(2);
    P.T2M_MAX[k] = miss ? -999 : +(26 + 0.05 * (y - 1981) + 4 * s + n).toFixed(2);
    P.T2M_MIN[k] = miss ? -999 : +(10 + 0.03 * (y - 1981) + 4 * s + n).toFixed(2);
    P.PRECTOTCORR[k] = miss ? -999 : +(Math.max(0.1, 3 - 0.02 * (y - 1981) + 2 * s + n * 2)).toFixed(2);
    P.RH2M[k] = miss ? -999 : +(60 + 0.05 * (y - 1981) - 10 * s + n * 3).toFixed(2);
  }
  return { geometry: { type: 'Point', coordinates: [0, lat, 123.4] }, properties: { parameter: P } };
}

let passed = 0, failed = [];
async function test(name, fn) {
  try { await fn(); passed++; console.log('  ok   ' + name); } catch (e) { failed.push(name); console.log('  FAIL ' + name + '\n       ' + String(e.message).split('\n').join('\n       ')); }
}

/* one step of the level bot: returns what it did */
const STEP = () => {
  const vis = e => e && e.offsetParent !== null, $ = s => document.querySelector(s), root = document.getElementById('screen-level');
  if (vis($('.result-card'))) return 'results';
  const skip = $('.cine-skip'); if (vis(skip)) { skip.click(); return 'cinematic'; }
  const click = el => { el.click(); return el.className.split(' ')[0] + ':' + el.textContent.trim().slice(0, 24); };
  if (root.querySelector('.places')) {
    const p = [...root.querySelectorAll('.place:not([disabled]):not(.done)')][0];
    if (p) return 'hub>' + click(p);
    return 'finish>' + click(root.querySelector('.finish'));
  }
  const items = [...root.querySelectorAll('.item:not(.on):not([disabled])')];
  if (items.length && !root.querySelector('.fb-list')) return 'pack>' + click(items[0]);
  if (root.querySelector('.item.on') && !root.querySelector('.fb-list')) { const b = [...root.querySelectorAll('.btn.primary:not([disabled])')][0]; if (b) return 'packok>' + click(b); }
  const ans = root.querySelector('[data-ans]:not([disabled])'); if (ans) return 'data>' + click(root.querySelector('[data-ans="up"]'));
  const qz = root.querySelector('[data-quiz]:not([disabled])'); if (qz) return 'quiz>' + click(qz);
  const opt = root.querySelector('.opt:not([disabled])'); if (opt && !root.querySelector('.ok,.warn')) return 'choice>' + click(opt);
  const pr = [...root.querySelectorAll('.btn.primary:not([disabled])')].filter(vis)[0]; if (pr) return 'continue>' + click(pr);
  return 'stuck';
};

(async () => {
  assert.ok(CHROME, 'Chrome not found: set CHROME=/path/to/chrome');
  const { srv, url } = await serve();
  const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const newPage = async (opts) => {
    const ctx = await browser.newContext(Object.assign({ viewport: { width: 375, height: 812 }, acceptDownloads: true, serviceWorkers: 'block' }, opts || {}));
    const page = await ctx.newPage(), errors = [], external = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));
    page.on('request', r => { const u = r.url(); if (!u.startsWith(url) && !u.startsWith('data:') && !u.startsWith('blob:')) external.push(u); });
    await page.route('**/power.larc.nasa.gov/**', route => {
      const lat = +new URL(route.request().url()).searchParams.get('latitude');
      route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(fakePower(lat)) });
    });
    return { page, errors, external, ctx };
  };
  const ready = async (page, q) => { await page.goto(url + (q || '?lang=en')); await page.waitForFunction(() => !document.getElementById('playBtn').disabled); };

  await test('home loads in English with no errors, no scroll, and only same-origin requests', async () => {
    const { page, errors, external, ctx } = await newPage(); await ready(page);
    assert.strictEqual(await page.evaluate(() => document.documentElement.lang), 'en');
    assert.match(await page.textContent('h1'), /CLIMATE\s*DETECTIVE/i);
    assert.strictEqual(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
    assert.deepStrictEqual(errors, []); assert.deepStrictEqual(external, []);
    assert.strictEqual(await page.locator('#levelList button').count(), 3);
    await ctx.close();
  });

  await test('language switch ES <-> EN translates the page and the URL keeps ?lang', async () => {
    const { page, ctx } = await newPage(); await ready(page, '?lang=es');
    assert.match(await page.textContent('#playBtn'), /jugar/i);
    await page.click('#langBtn'); assert.match(await page.textContent('#playBtn'), /play/i); assert.ok(page.url().includes('lang=en'));
    await ctx.close();
  });

  await test('every route opens its screen on load, and hashchange navigates without reloading', async () => {
    const { page, errors, ctx } = await newPage();
    for (const [hash, screen] of [['archivo', 'archive'], ['metodo', 'method'], ['glosario', 'glossary'], ['tutorial', 'tutorial'], ['costa', 'level'], ['centro', 'level'], ['norte', 'level']]) {
      await page.goto(url + '?lang=en#' + hash); await page.reload(); await page.waitForFunction(() => !document.getElementById('playBtn').disabled);
      await page.waitForSelector('#screen-' + screen + ':not([hidden])');
    }
    await ready(page); await page.evaluate(() => { location.hash = '#metodo'; }); await page.waitForSelector('#screen-method:not([hidden])');
    await page.evaluate(() => { location.hash = '#archivo'; }); await page.waitForSelector('#screen-archive:not([hidden])');
    assert.deepStrictEqual(errors, []); await ctx.close();
  });

  await test('Archive: built-in places reproduce the documented trends', async () => {
    const { page, ctx } = await newPage(); await ready(page, '?lang=en#archivo'); await page.reload(); await page.waitForSelector('#screen-archive:not([hidden])');
    for (const [city, rate] of [['veracruz', '+0.19'], ['pachuca', '+0.43'], ['monterrey', '+0.37']]) {
      await page.selectOption('#city', city); await page.selectOption('#variable', 't2m'); await page.selectOption('#season', 'annual');
      const txt = await page.textContent('#result'); assert.ok(txt.includes(rate), city + ': ' + txt); assert.match(txt, /p-value: < 0\.001|p-value: 0\.00/i);
    }
    await page.selectOption('#city', 'veracruz'); await page.selectOption('#variable', 'prectotcorr');
    assert.match(await page.textContent('#result'), /not enough evidence/i);
    await ctx.close();
  });

  await test('Archive: all 5 chart types draw; tooltip works; aria-label describes the result', async () => {
    const { page, errors, ctx } = await newPage(); await ready(page, '?lang=en#archivo'); await page.reload(); await page.waitForSelector('#screen-archive:not([hidden])');
    for (const ty of ['line', 'anom', 'stripes', 'decades', 'cycle']) {
      await page.click(`[data-type="${ty}"]`); assert.ok(await page.locator('#chart *').count() > 10, ty);
    }
    await page.click('[data-type="line"]'); const box = await page.locator('#chart .hit').boundingBox(); await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    assert.notStrictEqual(await page.locator('#chart .tip').evaluate(e => e.style.display), 'none');
    assert.match(await page.getAttribute('#chart', 'aria-label'), /p 0?\.|p </);
    assert.deepStrictEqual(errors, []); await ctx.close();
  });

  await test('Archive: extra variables load live for a built-in place (max, min, humidity)', async () => {
    const { page, ctx } = await newPage(); await ready(page, '?lang=en#archivo'); await page.reload(); await page.waitForSelector('#screen-archive:not([hidden])');
    for (const v of ['t2mmax', 't2mmin', 'rh2m']) {
      await page.selectOption('#variable', v); await page.waitForFunction(() => !document.getElementById('archiveStatus') || document.getElementById('archiveStatus').hidden);
      assert.strictEqual(await page.inputValue('#variable'), v); assert.match(await page.textContent('#result'), /per decade|Rate|change/i);
    }
    assert.ok(await page.isVisible('#maxminNote') === false);                      // note only for max/min
    await page.selectOption('#variable', 't2mmax'); assert.ok(await page.isVisible('#maxminNote'));
    await ctx.close();
  });

  await test('Archive: any place on Earth (quick pick + manual coordinates) and invalid input', async () => {
    const { page, errors, ctx } = await newPage(); await ready(page, '?lang=en#archivo'); await page.reload(); await page.waitForSelector('#screen-archive:not([hidden])');
    await page.click('details.custom summary');
    await page.fill('#latIn', '95'); await page.fill('#lonIn', '10'); await page.click('#customGo');
    assert.match(await page.textContent('#archiveStatus'), /coordinates/i);
    await page.selectOption('#pickSel', { index: 3 }); assert.ok(await page.inputValue('#latIn') !== '95');
    await page.click('#customGo'); await page.waitForFunction(() => document.getElementById('city').value === 'custom');
    assert.match(await page.textContent('#elev'), /123 m/); assert.match(await page.textContent('#result'), /decade/i);
    assert.ok(await page.locator('#compareBody tbody tr').count() >= 4);                // 3 built-in + custom
    await page.fill('#latIn', '-12.5'); await page.fill('#lonIn', '-70.2'); await page.fill('#nameIn', 'Test place'); await page.click('#customGo');
    await page.waitForFunction(() => document.querySelector('#city option[value=custom]').textContent === 'Test place');
    assert.deepStrictEqual(errors, []); await ctx.close();
  });

  await test('Archive: offline-friendly errors when NASA POWER is unreachable', async () => {
    const { page, ctx } = await newPage(); await ready(page, '?lang=en#archivo'); await page.reload(); await page.waitForSelector('#screen-archive:not([hidden])');
    await page.unroute('**/power.larc.nasa.gov/**'); await page.route('**/power.larc.nasa.gov/**', r => r.abort());
    await page.selectOption('#variable', 'rh2m'); await page.waitForFunction(() => /could not reach/i.test(document.getElementById('archiveStatus').textContent));
    assert.strictEqual(await page.inputValue('#variable'), 't2m'); assert.match(await page.textContent('#result'), /decade/);     // falls back, still works
    await ctx.close();
  });

  await test('Archive: hunch mode hides the verdict until you guess, then scores it', async () => {
    const { page, ctx } = await newPage(); await ready(page, '?lang=en#archivo'); await page.reload(); await page.waitForSelector('#screen-archive:not([hidden])');
    await page.check('#hunchChk'); assert.ok(await page.isVisible('[data-hunch="up"]')); assert.ok(!/p-value/.test(await page.textContent('#result')));
    await page.click('[data-hunch="up"]'); assert.ok(await page.isVisible('[data-hunch-fb]')); assert.match(await page.textContent('#result'), /p-value/);
    assert.match(await page.textContent('#result'), /Hunches right: 1 of 1/);
    await page.uncheck('#hunchChk'); assert.match(await page.textContent('#result'), /p-value/);
    await ctx.close();
  });

  await test('Archive: CSV and PNG export produce valid files', async () => {
    const { page, ctx } = await newPage(); await ready(page, '?lang=en#archivo'); await page.reload(); await page.waitForSelector('#screen-archive:not([hidden])');
    let [dl] = await Promise.all([page.waitForEvent('download'), page.click('#dlCsv')]);
    const csv = fs.readFileSync(await dl.path(), 'utf8'); assert.match(dl.suggestedFilename(), /\.csv$/); assert.match(csv, /year,value\n1981,/); assert.match(csv, /NASA POWER/);
    assert.strictEqual(csv.trim().split('\n').filter(l => /^\d{4},/.test(l)).length, 45);
    [dl] = await Promise.all([page.waitForEvent('download'), page.click('#dlPng')]);
    const png = fs.readFileSync(await dl.path()); assert.strictEqual(png.slice(1, 4).toString(), 'PNG'); assert.ok(png.length > 8000, 'png size ' + png.length);
    await ctx.close();
  });

  await test('Method screen lists the team and the sound credit; glossary search works', async () => {
    const { page, ctx } = await newPage(); await ready(page, '?lang=en#metodo'); await page.reload(); await page.waitForSelector('#screen-method:not([hidden])');
    const txt = await page.textContent('#screen-method');
    for (const n of ['Rafael Alfredo Pérez Acosta', 'Evelyn Amairani Torres Valdez', 'Yair Alejandro Naranjo Rodríguez', 'Burros Espaciales']) assert.ok(txt.includes(n), n);
    assert.match(txt, /no copyright/i); assert.ok(!/NASA logo|meatball/i.test(txt));
    await page.goto(url + '?lang=en#glosario'); await page.reload(); await page.waitForSelector('#screen-glossary:not([hidden])');
    await page.fill('#screen-glossary input', 'mann'); assert.match(await page.textContent('#screen-glossary'), /Mann-Kendall/);
    await ctx.close();
  });

  await test('tutorial can be completed', async () => {
    const { page, errors, ctx } = await newPage(); await ready(page, '?lang=en#tutorial'); await page.reload(); await page.waitForSelector('#screen-tutorial:not([hidden])');
    for (let i = 0; i < 12 && (await page.isVisible('#screen-tutorial')); i++) {
      const b = page.locator('#screen-tutorial .clue, #screen-tutorial [data-ans], #screen-tutorial .opt:not([disabled]), #screen-tutorial .btn.primary:not([disabled])').first();
      if (!(await b.count())) break; await b.click(); await page.waitForTimeout(80);
    }
    assert.deepStrictEqual(errors, []); await ctx.close();
  });

  for (const id of ['costa', 'centro', 'norte']) {
    await test(`full playthrough of the ${id} case reaches results, medal, share card, and replay`, async () => {
      const { page, errors, ctx } = await newPage(); await ready(page, '?lang=en#' + id); await page.reload(); await page.waitForSelector('#screen-level:not([hidden])');
      let last = '', same = 0, steps = 0;
      for (; steps < 400; steps++) {
        const r = await page.evaluate(STEP); if (r === 'results') break;
        if (r === 'stuck') { if (++same > 3) assert.fail('bot stuck after: ' + last); await page.waitForTimeout(100); } else same = 0; last = r; await page.waitForTimeout(15);
      }
      assert.ok(steps < 400, 'did not finish'); assert.ok(await page.isVisible('.result-card')); assert.match(await page.textContent('.big-pct'), /^\d+%$/);
      assert.ok(await page.isVisible('.ending')); assert.match(await page.textContent('.ending'), /\d of 7/);
      const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#screen-level .btn.primary.big')]); assert.match(dl.suggestedFilename(), /\.png$/);
      assert.strictEqual(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
      await page.getByRole('button', { name: /replay the case/i }).first().click(); await page.waitForSelector('.places');
      assert.deepStrictEqual(errors, []); await ctx.close();
    });
  }

  await test('Spanish version: tutorial-free playthrough of the Costa case has no errors and no English leftovers in the hub', async () => {
    const { page, errors, ctx } = await newPage(); await ready(page, '?lang=es#costa'); await page.reload(); await page.waitForSelector('#screen-level:not([hidden])');
    for (let i = 0; i < 400; i++) { const r = await page.evaluate(STEP); if (r === 'results') break; if (i === 40) { const hub = await page.evaluate(() => document.getElementById('screen-level').innerText); assert.ok(!/\b(Home|Radio station|Continue|Choose where)\b/.test(hub), hub.slice(0, 200)); } await page.waitForTimeout(10); }
    assert.ok(await page.isVisible('.result-card')); assert.match(await page.textContent('.ending'), /de 7/); assert.deepStrictEqual(errors, []); await ctx.close();
  });

  await test('offline: after one visit the game, built-in data and the Archive work with no network', async () => {
    const { page, ctx } = await newPage({ serviceWorkers: 'allow' }); await ready(page);
    await page.evaluate(() => navigator.serviceWorker.ready); await page.waitForTimeout(800);
    await page.reload(); await page.waitForFunction(() => navigator.serviceWorker.controller);
    await ctx.setOffline(true);
    await page.goto(url + '?lang=en#archivo'); await page.reload(); await page.waitForSelector('#screen-archive:not([hidden])');
    assert.match(await page.textContent('#result'), /\+0\.19/);
    await ctx.close();
  });

  await test('sound: starts muted, toggles, survives zone changes, no errors', async () => {
    const { page, errors, ctx } = await newPage(); await ready(page);
    assert.strictEqual(await page.getAttribute('#soundBtn', 'aria-pressed'), 'false');
    await page.click('#soundBtn'); assert.strictEqual(await page.getAttribute('#soundBtn', 'aria-pressed'), 'true');
    assert.ok(await page.evaluate(() => Sound.isOn()));
    await page.goto(url + '?lang=en#norte'); await page.reload(); await page.waitForSelector('#screen-level:not([hidden])'); await page.waitForTimeout(500);
    assert.strictEqual(await page.getAttribute('#soundBtn', 'aria-pressed'), 'false');   // a fresh page load starts muted again
    await page.click('#soundBtn'); await page.click('#soundBtn'); assert.strictEqual(await page.getAttribute('#soundBtn', 'aria-pressed'), 'false');
    assert.deepStrictEqual(errors, []); await ctx.close();
  });

  await test('no horizontal scroll and 44px touch targets on mobile, and desktop renders', async () => {
    const { page, ctx } = await newPage(); await ready(page);
    for (const q of ['?lang=en', '?lang=en#archivo', '?lang=en#glosario', '?lang=en#metodo']) {
      await page.goto(url + q); await page.reload(); await page.waitForFunction(() => !document.getElementById('playBtn').disabled); await page.waitForTimeout(300);
      assert.strictEqual(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false, q);
      const small = await page.evaluate(() => [...document.querySelectorAll('button:not([hidden]),select,input:not([type=checkbox])')].filter(e => e.offsetParent && !e.closest('[hidden]')).map(e => ({ t: (e.textContent || e.id).trim().slice(0, 20), h: e.getBoundingClientRect().height })).filter(x => x.h > 0 && x.h < 40));
      assert.deepStrictEqual(small, [], q + ' small targets');
    }
    await page.setViewportSize({ width: 1280, height: 800 }); await page.goto(url + '?lang=en'); await page.waitForFunction(() => !document.getElementById('playBtn').disabled);
    await ctx.close();
  });

  await browser.close(); srv.close();
  console.log(`\n${passed} passed, ${failed.length} failed` + (failed.length ? ': ' + failed.join('; ') : ''));
  process.exit(failed.length ? 1 : 0);
})();
