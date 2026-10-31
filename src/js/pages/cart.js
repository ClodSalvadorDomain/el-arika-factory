/* Cart + step checkout: 1 cart · 2 delivery · 3 payment · 4 confirmation */
import { boot } from '../app.js';
import '../../styles/cart.css';
import { COLORS, STORES, WILAYAS, byId } from '../data.js';
import { L, t, price, priceHTML, isAr } from '../i18n.js';
import { cart, DELIVERY_FREE_FROM, DELIVERY_FEE } from '../store.js';
import { monthly } from '../cards.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

boot();

let step = 1;
const deliveryForm = $('[data-step="2"]');
const payForm = $('[data-step="3"]');
const mode = () => deliveryForm.mode.value;

/* ---- step 1: lines */
function lines() {
  const list = cart.lines();
  $('[data-empty]').hidden = list.length > 0;
  $('[data-lines]').innerHTML = list.map((l) => {
    const p = byId(l.id);
    const c = COLORS[l.color];
    const included = p.badges.includes('assembly');
    const fee = cart.assemblyFee({ ...l, assembly: true });
    return `<li class="line glass glass--strong" data-key="${l.key}">
      <a class="line__img" href="product.html?id=${p.id}"><img src="${p.img}" alt="" width="132" height="99" loading="lazy"></a>
      <div class="line__info">
        <h3><a href="product.html?id=${p.id}">${L(p.name)}</a></h3>
        <p class="line__meta"><span><span class="line__dot" style="background:${c?.hex}"></span>${L(c)}</span><span>${t('width', p.width)}</span><span dir="ltr">${p.sku}</span></p>
        <div class="line__opts">
          <label class="check"><input type="checkbox" data-asm ${l.assembly || included ? 'checked' : ''} ${included ? 'disabled' : ''}><span>${t('assembly_opt')} ${included ? `(${t('included')})` : `+${price(fee / l.qty)} / ${t('each')}`}</span></label>
          <button class="line__remove" type="button" data-remove>${t('remove')}</button>
        </div>
      </div>
      <div class="line__side">
        <div class="qty qty--sm">
          <button type="button" data-q="-1" aria-label="-1"><svg class="i" aria-hidden="true"><use href="#i-minus"/></svg></button>
          <input type="number" min="1" max="20" value="${l.qty}" aria-label="${t('qty')}" data-qty-input>
          <button type="button" data-q="1" aria-label="+1"><svg class="i" aria-hidden="true"><use href="#i-plus"/></svg></button>
        </div>
        <div class="price"><span class="price__now">${priceHTML(p.price * l.qty)}</span></div>
        ${l.qty > 1 ? `<span class="line__unit">${price(p.price)} / ${t('each')}</span>` : ''}
      </div>
    </li>`;
  }).join('');
}

$('[data-lines]').addEventListener('click', (e) => {
  const li = e.target.closest('[data-key]');
  if (!li) return;
  const key = li.dataset.key;
  const l = cart.lines().find((x) => x.key === key);
  if (e.target.closest('[data-remove]')) cart.remove(key);
  const q = e.target.closest('[data-q]');
  if (q) cart.setQty(key, l.qty + +q.dataset.q);
});
$('[data-lines]').addEventListener('change', (e) => {
  const li = e.target.closest('[data-key]');
  if (!li) return;
  if (e.target.matches('[data-asm]')) cart.setAssembly(li.dataset.key, e.target.checked);
  if (e.target.matches('[data-qty-input]')) cart.setQty(li.dataset.key, +e.target.value || 1);
});

/* ---- summary */
function summary() {
  const tt = cart.totals(mode());
  const n = cart.count();
  const row = (k, v, cls = '') => `<dt class="${cls}">${k}</dt><dd class="${cls}">${v}</dd>`;
  $('[data-sum]').innerHTML = row(t('subtotal', n), price(tt.subtotal))
    + (tt.savings ? row(t('savings'), `−${price(tt.savings)}`, 'is-save') : '')
    + row(t('assembly_fee'), tt.assembly ? price(tt.assembly) : t('free'))
    + row(t('delivery_fee'), tt.delivery ? price(tt.delivery) : t('free'))
    + row(t('total'), price(tt.total), 'total');
  $('[data-sum-fin]').innerHTML = n ? t('per_month', price(monthly(tt.total, 36)), 36) : '';
  $('[data-fin-line]').textContent = t('fin_credit', price(monthly(tt.total, 36)));
  $('[data-fee-line]').textContent = tt.subtotal >= DELIVERY_FREE_FROM ? t('free') : price(DELIVERY_FEE);
  const next = $('[data-next]');
  next.textContent = t(step === 1 ? 'c_go1' : step === 2 ? 'c_go2' : 'c_go3');
  next.hidden = step === 4;
  next.disabled = n === 0;
  $('[data-back]').hidden = step === 1 || step === 4;
}

/* ---- step navigation */
function go(n) {
  step = n;
  $$('[data-step]').forEach((el) => { el.hidden = +el.dataset.step !== n; });
  $$('[data-steps] li').forEach((li) => {
    const s = +li.dataset.s;
    li.classList.toggle('is-done', s < n);
    li.classList.toggle('is-current', s === n);
    if (s === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
  });
  $('[data-steps-bar]').style.width = `${n * 25}%`;
  summary();
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

/* ---- validation */
function fieldError(form, name, msg) {
  const el = form.elements[name];
  const err = $(`[data-err="${name}"]`, form);
  if (el && el.setAttribute) el.setAttribute('aria-invalid', !!msg);
  if (err) err.textContent = msg || '';
  return !msg;
}
function validDelivery() {
  const f = deliveryForm;
  let ok = fieldError(f, 'name', f.name.value.trim() ? '' : t('required'));
  const phone = f.phone.value.replace(/\s/g, '');
  ok = fieldError(f, 'phone', !phone ? t('required') : /^0[5-7]\d{8}$/.test(phone) ? '' : t('phone_bad')) && ok;
  if (mode() === 'home') {
    ok = fieldError(f, 'wilaya', f.wilaya.value ? '' : t('required')) && ok;
    ok = fieldError(f, 'commune', f.commune.value.trim() ? '' : t('required')) && ok;
    ok = fieldError(f, 'address', f.address.value.trim() ? '' : t('required')) && ok;
  }
  if (!ok) $('[aria-invalid="true"]', f)?.focus();
  return ok;
}
function validPay() {
  const ok = fieldError(payForm, 'terms', payForm.terms.checked ? '' : t('terms_bad'));
  if (!ok) payForm.terms.focus();
  return ok;
}

$('[data-next]').addEventListener('click', () => {
  if (step === 1 && cart.count()) go(2);
  else if (step === 2 && validDelivery()) go(3);
  else if (step === 3 && validPay()) {
    $('[data-order-no]').textContent = `EAF-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000)}`;
    cart.clear();
    go(4);
    $('[data-step="4"]').focus();
  }
});
$('[data-back]').addEventListener('click', () => go(step - 1));

/* ---- form helpers */
function fillSelects() {
  const w = deliveryForm.wilaya.value;
  $('[data-wilayas]').innerHTML = `<option value="">${t('choose')}</option>${WILAYAS.map((x, i) => `<option value="${x}">${String(i + 1).padStart(2, '0')} · ${x}</option>`).join('')}`;
  deliveryForm.wilaya.value = w;
  const fmt = new Intl.DateTimeFormat(isAr() ? 'ar-DZ' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const days = [];
  for (let d = new Date(), i = 0; days.length < 10 && i < 20; i++) {
    d.setDate(d.getDate() + 1);
    if (i < 2 || d.getDay() === 5) continue; // no Friday deliveries, 72 h preparation
    days.push(new Date(d));
  }
  $('[data-dates]').innerHTML = days.map((d) => `<option>${fmt.format(d)}</option>`).join('');
  $('[data-store-select]').innerHTML = STORES.map((s) => `<option value="${s.id}">${isAr() ? `${s.cityAr} · ${s.areaAr}` : `${s.city} · ${s.area}`}</option>`).join('');
}
deliveryForm.addEventListener('change', (e) => {
  if (e.target.name === 'mode') {
    $('[data-home-fields]').hidden = mode() !== 'home';
    $('[data-pickup-fields]').hidden = mode() !== 'pickup';
    summary();
  }
});
payForm.addEventListener('change', (e) => {
  if (e.target.name === 'pay') {
    $('[data-card-fields]').hidden = e.target.value !== 'card';
    $('[data-credit-note]').hidden = e.target.value !== 'credit';
  }
});

lines();
fillSelects();
go(1);
addEventListener('store:change', () => { if (step === 1) { lines(); summary(); } });
addEventListener('langchange', () => { lines(); fillSelects(); summary(); });
