/* ==========================================================================
   Cart + wishlist persisted in localStorage. Swap for API calls when the
   back office exists; the event contract ('store:change') stays the same.
   ========================================================================== */
import { byId } from './data.js';

const CART = 'eaf-cart';
const WISH = 'eaf-wish';

const read = (k, d) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; }
};
const write = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage full or blocked */ }
  dispatchEvent(new CustomEvent('store:change', { detail: { key: k } }));
};

export const DELIVERY_FREE_FROM = 150000;
export const DELIVERY_FEE = 4500;
export const ASSEMBLY_RATE = 0.05; // of item price, min 2 000 DA, free on items flagged "assembly"

export const cart = {
  lines() {
    return read(CART, []).filter((l) => byId(l.id));
  },
  count() {
    return this.lines().reduce((n, l) => n + l.qty, 0);
  },
  add(id, qty = 1, color = null) {
    const p = byId(id);
    if (!p) return;
    const c = color || p.colors[0];
    const lines = this.lines();
    const key = `${id}|${c}`;
    const hit = lines.find((l) => l.key === key);
    if (hit) hit.qty = Math.min(20, hit.qty + qty);
    else lines.push({ key, id, color: c, qty, assembly: p.badges.includes('assembly') });
    write(CART, lines);
  },
  setQty(key, qty) {
    const lines = this.lines();
    const l = lines.find((x) => x.key === key);
    if (!l) return;
    l.qty = Math.max(1, Math.min(20, qty));
    write(CART, lines);
  },
  setAssembly(key, on) {
    const lines = this.lines();
    const l = lines.find((x) => x.key === key);
    if (l) { l.assembly = on; write(CART, lines); }
  },
  remove(key) {
    write(CART, this.lines().filter((l) => l.key !== key));
  },
  clear() { write(CART, []); },
  assemblyFee(line) {
    const p = byId(line.id);
    if (!line.assembly || p.badges.includes('assembly')) return 0;
    return Math.max(2000, Math.round((p.price * ASSEMBLY_RATE) / 100) * 100) * line.qty;
  },
  totals(deliveryMode = 'home') {
    const lines = this.lines();
    const subtotal = lines.reduce((s, l) => s + byId(l.id).price * l.qty, 0);
    const savings = lines.reduce((s, l) => { const p = byId(l.id); return s + (p.old ? (p.old - p.price) * l.qty : 0); }, 0);
    const assembly = lines.reduce((s, l) => s + this.assemblyFee(l), 0);
    const delivery = deliveryMode === 'pickup' || subtotal >= DELIVERY_FREE_FROM || !lines.length ? 0 : DELIVERY_FEE;
    return { subtotal, savings, assembly, delivery, total: subtotal + assembly + delivery };
  },
};

export const wish = {
  ids() { return read(WISH, []); },
  has(id) { return this.ids().includes(id); },
  toggle(id) {
    const ids = this.ids();
    const on = !ids.includes(id);
    write(WISH, on ? [...ids, id] : ids.filter((x) => x !== id));
    return on;
  },
};
