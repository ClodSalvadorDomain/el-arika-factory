// Dev-only screenshot helper.
// node tools/shot.mjs <url> <out.png> [--w 1440] [--h 900] [--full] [--y 0] [--wait 1500] [--lang ar] [--click sel] [--reduced]
import { chromium } from 'playwright-core';

const [url, out, ...rest] = process.argv.slice(2);
const opt = (k, d) => { const i = rest.indexOf(`--${k}`); return i < 0 ? d : rest[i + 1]; };
const flag = (k) => rest.includes(`--${k}`);
const w = +opt('w', 1440);
const h = +opt('h', 900);

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: process.env.GPU ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [],
});
const ctx = await browser.newContext({
  viewport: { width: w, height: h },
  deviceScaleFactor: 1,
  reducedMotion: flag('reduced') ? 'reduce' : 'no-preference',
  hasTouch: w < 800,
  isMobile: w < 800,
});
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
await page.addInitScript(([l, c]) => { localStorage.setItem('eaf-cookies', 'all'); if (l) localStorage.setItem('eaf-lang', l); if (c && !sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem('eaf-cart', JSON.stringify(c.split(',').map((x) => { const [id, color, qty] = x.split(':'); return { key: id + '|' + color, id, color, qty: +(qty || 1), assembly: false }; }))); } }, [opt('lang', ''), opt('cart', '')]);
await page.goto(url, { waitUntil: 'networkidle' });
const y = opt('y', null);
if (y !== null) {
  await page.evaluate(async (target) => {
    const to = target.endsWith('%') ? (document.documentElement.scrollHeight - innerHeight) * parseFloat(target) / 100 : +target;
    const step = Math.max(200, to / 12);
    for (let s = 0; s < to; s += step) { scrollTo(0, s); await new Promise((r) => setTimeout(r, 60)); }
    scrollTo(0, to);
  }, y);
}
const sel = opt('scrollto', null);
if (sel) {
  await page.evaluate(async ([s, plus]) => {
    document.documentElement.style.scrollBehavior = 'auto';
    const el = document.querySelector(s);
    const to = el.getBoundingClientRect().top + scrollY + plus * innerHeight;
    for (let k = 1; k <= 16; k++) { scrollTo(0, (to * k) / 16); await new Promise((r) => setTimeout(r, 70)); }
  }, [sel, +opt('plus', 0)]);
}
const click = opt('click', null);
if (click) { await page.click(click); }
await page.waitForTimeout(+opt('wait', 1500));
await page.screenshot({ path: out, fullPage: flag('full') });
if (errors.length) console.log(errors.slice(0, 15).join('\n'));
console.log('shot', out);
await browser.close();
