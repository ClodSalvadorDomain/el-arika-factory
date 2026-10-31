/* ==========================================================================
   Liquid glass refraction
   --------------------------------------------------------------------------
   liquid-glass-js renders refraction in WebGL over an html2canvas snapshot of
   the page. A snapshot cannot follow a scrolling, animated page, so this
   module keeps that shader's model (edge refraction falling off from the rim,
   rounded-rect aware normals, blur, saturation) and runs it where the browser
   already composites the live backdrop: an SVG filter used as
   `backdrop-filter: url(#id)`.

   Per element we bake a displacement map from the rounded-rect signed
   distance field: inside an edge band the map pushes samples inward along the
   surface normal with a quadratic falloff, so the backdrop bends at the rim
   like the lip of a lens. Chromium supports SVG filters in backdrop-filter;
   other browsers keep the CSS blur from glass.css.
   ========================================================================== */

const PRESETS = {
  default: { edge: 26, scale: 48, blur: 6, sat: 1.7 },
  header:  { edge: 20, scale: 38, blur: 9, sat: 1.8 },
  pill:    { edge: 16, scale: 30, blur: 4, sat: 1.7 },
  lens:    { edge: 44, scale: 80, blur: 1.5, sat: 1.5 },
  panel:   { edge: 34, scale: 56, blur: 10, sat: 1.7 },
};

const NS = 'http://www.w3.org/2000/svg';
const supported = (() => {
  const ua = navigator.userAgent;
  const chromium = /Chrome\/\d+/.test(ua) && !/Firefox/.test(ua);
  const reduced = matchMedia('(prefers-reduced-transparency: reduce)').matches;
  return chromium && !reduced && CSS.supports('backdrop-filter', 'url(#a)');
})();

let defs = null;
let uid = 0;
const tracked = new Map();

function ensureDefs() {
  if (defs) return defs;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  defs = document.createElementNS(NS, 'defs');
  svg.appendChild(defs);
  document.body.appendChild(svg);
  return defs;
}

/** Bake the displacement map. R/G encode the sample offset (128 = none). */
function bakeMap(w, h, r, edge) {
  const s = Math.min(1, 360 / Math.max(w, h));
  const cw = Math.max(4, Math.round(w * s));
  const ch = Math.max(4, Math.round(h * s));
  const cvs = document.createElement('canvas');
  cvs.width = cw;
  cvs.height = ch;
  const ctx = cvs.getContext('2d');
  const img = ctx.createImageData(cw, ch);
  const d = img.data;
  const hw = w / 2;
  const hh = h / 2;
  const rr = Math.min(r, hw, hh);
  const band = Math.max(4, Math.min(edge, hw, hh));

  for (let y = 0; y < ch; y++) {
    const py = (y + 0.5) / s - hh;
    for (let x = 0; x < cw; x++) {
      const px = (x + 0.5) / s - hw;
      const qx = Math.abs(px) - (hw - rr);
      const qy = Math.abs(py) - (hh - rr);
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const sdf = Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - rr;
      const inside = -sdf;
      let dx = 0;
      let dy = 0;
      if (inside > 0 && inside < band) {
        const t = 1 - inside / band;
        const mag = t * t;
        let nx;
        let ny;
        if (qx > 0 && qy > 0) {
          const l = Math.hypot(qx, qy) || 1;
          nx = qx / l;
          ny = qy / l;
        } else if (qx > qy) { nx = 1; ny = 0; } else { nx = 0; ny = 1; }
        nx *= Math.sign(px) || 1;
        ny *= Math.sign(py) || 1;
        dx = -nx * mag;
        dy = -ny * mag;
      }
      const i = (y * cw + x) * 4;
      d[i] = 128 + dx * 127;
      d[i + 1] = 128 + dy * 127;
      d[i + 2] = 128;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return cvs.toDataURL();
}

function build(el) {
  const rec = tracked.get(el);
  const rect = el.getBoundingClientRect();
  const w = Math.round(rect.width);
  const h = Math.round(rect.height);
  if (w < 8 || h < 8) return;
  if (rec.w === w && rec.h === h) return;
  rec.w = w;
  rec.h = h;
  const cs = getComputedStyle(el);
  const r = parseFloat(cs.borderTopLeftRadius) || 0;
  const p = rec.preset;
  const map = bakeMap(w, h, r, p.edge);

  rec.filter.innerHTML = `
    <feImage href="${map}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="map"/>
    <feGaussianBlur in="SourceGraphic" stdDeviation="${p.blur}" result="soft"/>
    <feDisplacementMap in="soft" in2="map" scale="${p.scale}" xChannelSelector="R" yChannelSelector="G" result="bent"/>
    <feColorMatrix in="bent" type="saturate" values="${p.sat}"/>`;
  el.style.backdropFilter = `url(#${rec.id})`;
  el.style.webkitBackdropFilter = `url(#${rec.id})`;
}

const ro = supported
  ? new ResizeObserver((entries) => {
    requestAnimationFrame(() => entries.forEach((e) => tracked.has(e.target) && build(e.target)));
  })
  : null;

export function liquify(root = document) {
  if (!supported) return;
  root.querySelectorAll('[data-liquid]').forEach((el) => {
    if (tracked.has(el)) return;
    const preset = PRESETS[el.dataset.liquid] || PRESETS.default;
    const id = `lg-${++uid}`;
    const filter = document.createElementNS(NS, 'filter');
    filter.setAttribute('id', id);
    filter.setAttribute('x', '0');
    filter.setAttribute('y', '0');
    filter.setAttribute('width', '100%');
    filter.setAttribute('height', '100%');
    filter.setAttribute('color-interpolation-filters', 'sRGB');
    ensureDefs().appendChild(filter);
    tracked.set(el, { id, filter, preset, w: 0, h: 0 });
    el.classList.add('is-liquid');
    build(el);
    ro.observe(el);
  });
}

export const liquidSupported = supported;
