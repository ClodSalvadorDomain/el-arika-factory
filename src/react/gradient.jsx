/* ShaderGradient island: the slow liquid colour field behind hero glass. */
import { createRoot } from 'react-dom/client';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* lightType '3d' keeps everything local: the 'env' type fetches HDR files. */
export const PRESETS = {
  hero: {
    type: 'plane', uSpeed: 0.14, uStrength: 4, uDensity: 1.3, uFrequency: 5.5, uAmplitude: 0,
    positionX: -1.4, positionY: 0, positionZ: 0, rotationX: 0, rotationY: 10, rotationZ: 50,
    color1: '#E30613', color2: '#F9D3CC', color3: '#FFF7F2',
    reflection: 0.1, cAzimuthAngle: 180, cPolarAngle: 90, cDistance: 3.6, cameraZoom: 1,
    lightType: '3d', brightness: 1.2, grain: 'off',
  },
};

export function mountGradient(el, preset = 'hero', overrides = {}) {
  const root = createRoot(el);
  root.render(
    <ShaderGradientCanvas
      style={{ position: 'absolute', inset: 0 }}
      pixelDensity={1}
      fov={45}
      pointerEvents="none"
      lazyLoad
      rootMargin="200px"
    >
      <ShaderGradient control="props" animate={reduced ? 'off' : 'on'} {...PRESETS[preset]} {...overrides} />
    </ShaderGradientCanvas>,
  );
  requestAnimationFrame(() => el.classList.add('is-live'));
  return root;
}
