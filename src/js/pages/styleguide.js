/* Design-system page: renders live components from the same modules the shop uses. */
import { boot } from '../app.js';
import { CATEGORIES, PRODUCTS, byId } from '../data.js';
import { L } from '../i18n.js';
import { cardHTML, skeletonHTML, carousel, countdown, endOfWeek } from '../cards.js';
import { toast } from '../ui.js';

const $ = (s) => document.querySelector(s);

const css = document.createElement('style');
css.textContent = `
  .sg { padding-top: 28px; }
  .sg__head { display: grid; gap: 10px; max-width: 70ch; margin-bottom: 24px; }
  .sg code { font-size: 0.9em; padding: 1px 6px; border-radius: 6px; background: rgba(30,24,25,.06); }
  .sg-sec { padding-block: 32px; border-top: 1px solid rgba(30,24,25,.08); }
  .sg-sec .section-title { margin-bottom: 20px; }
  .sg-swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px; }
  .sg-swatches figure { display: grid; gap: 8px; }
  .sg-swatches span { height: 72px; border-radius: 16px; background: var(--c); box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); }
  .sg-swatches figcaption { font-size: 12px; color: var(--text-muted); }
  .sg-swatches b { display: block; font-size: 13px; color: var(--text-strong); }
  .sg-type { display: grid; gap: 12px; padding: 28px; border-radius: var(--r-panel); }
  .sg-glass { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; padding: 28px; border-radius: var(--r-panel);
    background: linear-gradient(120deg, #FCE6E1, #EE6E6F 60%, #E30613), url(img/living-warm-sm.webp) center/cover; background-blend-mode: soft-light; }
  .sg-pane { display: grid; gap: 6px; min-height: 150px; align-content: end; padding: 20px; border-radius: 22px; font-size: 13px; }
  .sg-pane b { font-size: 16px; }
  .sg-shapes { display: flex; flex-wrap: wrap; gap: 14px; }
  .sg-shapes div { display: grid; place-items: center; width: 140px; height: 96px; background: #fff; box-shadow: var(--shadow-card); font-size: 13px; font-weight: 600; }
  .sg-space { display: flex; align-items: end; gap: 14px; margin-top: 20px; font-size: 12px; color: var(--text-muted); }
  .sg-space span { display: grid; justify-items: center; gap: 6px; }
  .sg-space span::before { content: ""; width: var(--w); height: var(--w); background: var(--brand-red); border-radius: 2px; }
  .sg-shadows { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 24px; }
  .sg-shadows div { display: grid; place-items: center; width: 200px; height: 100px; border-radius: var(--r-card); background: #fff; font-size: 13px; font-weight: 600; }
  .sg-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 16px; }
  .sg-cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--gutter); margin-bottom: 24px; }
  .sg-forms { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; align-items: start; padding: 28px; border-radius: var(--r-panel); }
  @media (max-width: 900px) { .sg-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
`;
document.head.appendChild(css);

boot();

$('[data-sg-cards]').innerHTML = [byId('hoggar-3'), byId('djurdjura-240'), byId('chenoua-armchair')].map((p) => cardHTML(p)).join('') + skeletonHTML(1);
$('[data-sg-tiles]').innerHTML = CATEGORIES.slice(0, 6).map((c) => `<li><a class="ctile" href="category.html?c=${c.id}"><span class="ctile__img"><img src="${c.img}" alt="" width="96" height="96" loading="lazy"></span><span>${L(c)}</span></a></li>`).join('');
$('[data-sg-track]').innerHTML = PRODUCTS.slice(0, 8).map((p) => cardHTML(p)).join('');
carousel($('[data-carousel]'));
countdown($('[data-sg-countdown]'), endOfWeek());
$('[data-sg-toast]').addEventListener('click', () => toast('Added to your cart', { href: 'cart.html', label: 'View cart' }));
