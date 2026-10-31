/* Store locator: Leaflet + OpenStreetMap tiles, searchable list, "near me". */
import { boot } from '../app.js';
import 'leaflet/dist/leaflet.css';
import '../../styles/stores.css';
import L_ from 'leaflet';
import { STORES, HOURS } from '../data.js';
import { L, t, isAr } from '../i18n.js';
import { toast } from '../ui.js';

const $ = (s, r = document) => r.querySelector(s);

boot();

const params = new URLSearchParams(location.search);
let active = params.get('s');
let origin = null;
const input = $('#store-q');
input.value = params.get('city') || '';

/* Sat to Thu 9:00 to 20:00, Fri 14:00 to 20:00 (Algeria, UTC+1). */
function openState(now = new Date()) {
  const dz = new Date(now.getTime() + (now.getTimezoneOffset() + 60) * 60000);
  const h = dz.getHours() + dz.getMinutes() / 60;
  const opens = dz.getDay() === 5 ? 14 : 9;
  if (h >= opens && h < 20) return { open: true, label: t('open_now', '20:00') };
  return { open: false, label: t('closed_now', h >= 20 ? (dz.getDay() === 4 ? '14:00' : '9:00') : `${opens}:00`) };
}

const km = (a, b) => {
  const R = 6371;
  const r = (d) => (d * Math.PI) / 180;
  const dLat = r(b.lat - a.lat);
  const dLng = r(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};
const name = (s) => (isAr() ? `${s.cityAr} · ${s.areaAr}` : `${s.city} · ${s.area}`);
const dirUrl = (s) => `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`;

/* ---- map */
let map = null;
const markers = new Map();
try {
  map = L_.map($('[data-map]'), { zoomControl: true, scrollWheelZoom: false, attributionControl: true }).setView([35.9, 3.2], 6);
  L_.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  STORES.forEach((s) => {
    const icon = L_.divIcon({ className: `map-pin${s.factory ? ' is-factory' : ''}`, html: '<span></span>', iconSize: [38, 38] });
    const m = L_.marker([s.lat, s.lng], { icon, title: s.city, keyboard: true }).addTo(map);
    m.on('click', () => select(s.id, false));
    markers.set(s.id, m);
  });
  map.fitBounds(L_.latLngBounds(STORES.map((s) => [s.lat, s.lng])).pad(0.15));
  map.on('focus', () => map.scrollWheelZoom.enable());
  map.on('blur', () => map.scrollWheelZoom.disable());
} catch {
  $('[data-map-fallback]').hidden = false;
}

/* ---- list */
function visible() {
  const q = input.value.trim().toLowerCase();
  let list = STORES.filter((s) => !q || `${s.city} ${s.cityAr} ${s.area} ${s.areaAr}`.toLowerCase().includes(q));
  if (origin) list = [...list].sort((a, b) => km(origin, a) - km(origin, b));
  return list;
}

function render() {
  const list = visible();
  const st = openState();
  $('[data-store-count]').textContent = t('stores_count', list.length);
  $('[data-store-list]').innerHTML = list.map((s) => `<li class="store${s.id === active ? ' is-active' : ''}" data-id="${s.id}">
      <div class="store__top">
        <h2><button type="button" data-select="${s.id}">${name(s)}</button></h2>
        ${s.flagship ? `<span class="store__tag store__tag--flag">${t('flagship')}</span>` : ''}${s.factory ? `<span class="store__tag">${t('factory')}</span>` : ''}
        ${origin ? `<span class="store__dist">${t('km', Math.round(km(origin, s)))}</span>` : ''}
      </div>
      <p class="store__row"><svg class="i" aria-hidden="true"><use href="#i-clock"/></svg><span class="${st.open ? 'store__open' : 'store__closed'}">${st.label}</span></p>
      <p class="store__row"><svg class="i" aria-hidden="true"><use href="#i-store"/></svg><span>${L(HOURS)}</span></p>
      <div class="store__actions">
        <a class="btn btn--primary btn--sm" href="${dirUrl(s)}" target="_blank" rel="noopener">${t('directions')}</a>
        <a class="btn btn--ghost btn--sm" href="tel:${s.phone.replace(/\s/g, '')}"><svg class="i" aria-hidden="true"><use href="#i-phone"/></svg><span dir="ltr">${s.phone}</span></a>
      </div>
    </li>`).join('');
}

function select(id, fly = true) {
  active = id;
  const s = STORES.find((x) => x.id === id);
  if (!s) return;
  markers.forEach((m, k) => m.getElement()?.classList.toggle('is-active', k === id));
  if (map) {
    if (fly) map.flyTo([s.lat, s.lng], 12, { duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.8 });
    markers.get(id).bindPopup(`<b>${name(s)}</b><br>${L(HOURS)}<br><a href="${dirUrl(s)}" target="_blank" rel="noopener">${t('directions')}</a>`).openPopup();
  }
  render();
  $(`.store[data-id="${id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

$('[data-store-list]').addEventListener('click', (e) => {
  if (e.target.closest('a')) return;
  const li = e.target.closest('[data-id]');
  if (li) select(li.dataset.id);
});
input.addEventListener('input', render);
$('[data-store-search]').addEventListener('submit', (e) => {
  e.preventDefault();
  const first = visible()[0];
  if (first) select(first.id);
});
$('[data-locate]').addEventListener('click', () => {
  if (!navigator.geolocation) { toast(t('geo_fail')); return; }
  navigator.geolocation.getCurrentPosition((pos) => {
    origin = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    input.value = '';
    const near = visible()[0];
    if (near) select(near.id); else render();
  }, () => toast(t('geo_fail')), { timeout: 8000 });
});

render();
if (active) select(active); else if (input.value) { const f = visible()[0]; if (f) select(f.id); }
addEventListener('langchange', () => { render(); if (active) select(active, false); });
