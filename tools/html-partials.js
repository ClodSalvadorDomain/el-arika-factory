import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Build-time HTML partials: `<!-- @include header -->` is replaced with
 * src/partials/header.html, so every page ships real markup for its chrome
 * (crawlable, no flash) while the source stays in one place.
 */
export function htmlPartials(root) {
  const inject = (html, depth = 0) =>
    html.replace(/<!--\s*@include\s+([\w-]+)\s*-->/g, (_, name) =>
      depth > 4 ? '' : inject(readFileSync(resolve(root, 'src/partials', `${name}.html`), 'utf8'), depth + 1));
  return {
    name: 'html-partials',
    transformIndexHtml: { order: 'pre', handler: (html) => inject(html) },
    handleHotUpdate({ file, server }) {
      if (file.includes('partials')) server.ws.send({ type: 'full-reload' });
    },
  };
}
