/* ==========================================================================
   Shared entry: every page imports this first.
   ========================================================================== */
import '../vendor/scrollcraft.css';
import '../styles/tokens.css';
import '../styles/glass.css';
import '../styles/base.css';
import '../styles/layout.css';
import '../styles/components.css';

import { applyI18n } from './i18n.js';
import { initChrome } from './ui.js';
import { liquify } from './glass.js';
import { bindCardActions } from './cards.js';

export function boot() {
  applyI18n();
  initChrome();
  bindCardActions();
  liquify();
  addEventListener('langchange', () => liquify());
}

/** Run a callback when the browser is idle (or soon), for heavy islands. */
export const idle = (fn) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 300));

/** Mount once when the element approaches the viewport. */
export function whenNear(el, fn, margin = '300px') {
  if (!el) return;
  if (!('IntersectionObserver' in window)) { fn(); return; }
  const io = new IntersectionObserver((en) => {
    if (en.some((e) => e.isIntersecting)) { io.disconnect(); fn(); }
  }, { rootMargin: margin });
  io.observe(el);
}
