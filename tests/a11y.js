/* Accessibility audit with axe-core (WCAG 2.1 A/AA) on the main screens. Run: node tests/a11y.js */
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright-core'); const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2' };
const CHROME = process.env.CHROME || ['/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p => fs.existsSync(p));
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const srv = http.createServer((q, r) => { let f = path.join(ROOT, q.url.split('?')[0]); if (!path.extname(f)) f = path.join(f, 'index.html'); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'x' }); r.end(fs.readFileSync(f)); });
srv.listen(0, async () => {
  const url = 'http://localhost:' + srv.address().port + '/', b = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
  let bad = 0;
  for (const [name, q] of [['home', ''], ['archive', '#archivo'], ['method', '#metodo'], ['glossary', '#glosario'], ['tutorial', '#tutorial'], ['case costa', '#costa'], ['case centro', '#centro'], ['case norte', '#norte']]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }), p = await ctx.newPage();
    await p.goto(url + '?lang=en' + q); await p.reload(); await p.waitForFunction(() => !document.getElementById('playBtn').disabled); await p.waitForTimeout(700);
    if (q.match(/costa|centro|norte/)) { await p.click('.cine-skip').catch(() => {}); await p.waitForTimeout(300); }
    await p.evaluate(axeSrc);
    const res = await p.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } }));
    const v = res.violations.filter(x => x.impact !== 'minor');
    console.log(`${v.length ? 'FAIL' : ' ok '} ${name}: ${v.length} violations` + v.map(x => `\n       [${x.impact}] ${x.id}: ${x.help} (${x.nodes.length} nodes) e.g. ${x.nodes[0].target.join(' ')} :: ${(x.nodes[0].any[0] || x.nodes[0].all[0] || x.nodes[0].none[0] || {}).message || ''}`).join(''));
    bad += v.length; await ctx.close();
  }
  await b.close(); srv.close(); process.exit(bad ? 1 : 0);
});
