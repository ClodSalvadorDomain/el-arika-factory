/* ==========================================================================
   Liquid-metal emblem
   --------------------------------------------------------------------------
   Vanilla WebGL2 port of liquid-logo's shader (src/app/hero/liquid-frag.ts).
   The bevel map (src/assets/emblem-bevel.png) was baked offline with the
   same Poisson solve as liquid-logo's parse-logo-image.ts, so the page never
   pays for it. Only change to the shader: the two stripe colours are
   uniforms, so the chrome can be tinted toward the brand red.
   ========================================================================== */
import bevelMap from '../assets/emblem-bevel.png?inline';

const VERT = `#version 300 es
precision mediump float;
in vec2 a_position;
out vec2 vUv;
void main() { vUv = .5 * (a_position + 1.); gl_Position = vec4(a_position, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision mediump float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D u_image_texture;
uniform float u_time, u_ratio, u_img_ratio, u_patternScale, u_refraction, u_edge, u_patternBlur, u_liquid;
uniform vec3 u_light, u_dark;
#define PI 3.14159265358979323846
vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy)); vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.); m = m*m; m = m*m;
  vec3 x = 2. * fract(p * C.www) - 1.; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130. * dot(m, g);
}
vec2 get_img_uv() {
  vec2 img_uv = vUv; img_uv -= .5;
  if (u_ratio > u_img_ratio) img_uv.x = img_uv.x * u_ratio / u_img_ratio; else img_uv.y = img_uv.y * u_img_ratio / u_ratio;
  img_uv += .5; img_uv.y = 1. - img_uv.y; return img_uv;
}
vec2 rotate(vec2 uv, float th) { return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv; }
float get_color_channel(float c1, float c2, float stripe_p, vec3 w, float extra_blur, float b) {
  float ch = c2; float border = 0.; float blur = u_patternBlur + extra_blur;
  ch = mix(ch, c1, smoothstep(.0, blur, stripe_p));
  border = w[0]; ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));
  b = smoothstep(.2, .8, b);
  border = w[0] + .4 * (1. - b) * w[1]; ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));
  border = w[0] + .5 * (1. - b) * w[1]; ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));
  border = w[0] + w[1]; ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));
  float gradient_t = (stripe_p - w[0] - w[1]) / w[2];
  float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));
  ch = mix(ch, gradient, smoothstep(border - blur, border + blur, stripe_p));
  return ch;
}
float get_img_frame_alpha(vec2 uv, float f) {
  return smoothstep(0., f, uv.x) * smoothstep(1., 1. - f, uv.x) * smoothstep(0., f, uv.y) * smoothstep(1., 1. - f, uv.y);
}
void main() {
  vec2 uv = vUv; uv.y = 1. - uv.y; uv.x *= u_ratio;
  float diagonal = uv.x - uv.y;
  float t = .001 * u_time;
  vec2 img_uv = get_img_uv();
  vec4 img = texture(u_image_texture, img_uv);
  vec3 color1 = u_light;
  vec3 color2 = u_dark + vec3(.0, .0, .1 * smoothstep(.7, 1.3, uv.x + uv.y)) * .5;
  float edge = img.r;
  vec2 grad_uv = uv; grad_uv -= .5;
  float dist = length(grad_uv + vec2(0., .2 * diagonal));
  grad_uv = rotate(grad_uv, (.25 - .2 * diagonal) * PI);
  float bulge = pow(1.8 * dist, 1.2); bulge = 1. - bulge; bulge *= pow(uv.y, .3);
  float cycle_width = u_patternScale;
  float thin_strip_1_ratio = .12 / cycle_width * (1. - .4 * bulge);
  float thin_strip_2_ratio = .07 / cycle_width * (1. + .4 * bulge);
  float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);
  float thin_strip_1_width = cycle_width * thin_strip_1_ratio;
  float thin_strip_2_width = cycle_width * thin_strip_2_ratio;
  float opacity = 1. - smoothstep(.9 - .5 * u_edge, 1. - .5 * u_edge, edge);
  opacity *= get_img_frame_alpha(img_uv, 0.01);
  float noise = snoise(uv - t);
  edge += (1. - edge) * u_liquid * noise;
  float refr = clamp(1. - bulge, 0., 1.);
  float dir = grad_uv.x + diagonal;
  dir -= 2. * noise * diagonal * (smoothstep(0., 1., edge) * smoothstep(1., 0., edge));
  bulge *= clamp(pow(uv.y, .1), .3, 1.);
  dir *= (.1 + (1.1 - edge) * bulge);
  dir *= smoothstep(1., .7, edge);
  dir += .18 * (smoothstep(.1, .2, uv.y) * smoothstep(.4, .2, uv.y));
  dir += .03 * (smoothstep(.1, .2, 1. - uv.y) * smoothstep(.4, .2, 1. - uv.y));
  dir *= (.5 + .5 * pow(uv.y, 2.));
  dir *= cycle_width;
  dir -= t;
  float refr_r = refr + .03 * bulge * noise;
  float refr_b = 1.3 * refr;
  refr_r += 5. * (smoothstep(-.1, .2, uv.y) * smoothstep(.5, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(1., .4, bulge));
  refr_r -= diagonal;
  refr_b += (smoothstep(0., .4, uv.y) * smoothstep(.8, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(.8, .4, bulge));
  refr_b -= .2 * edge;
  refr_r *= u_refraction; refr_b *= u_refraction;
  vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);
  w[1] -= .02 * smoothstep(.0, 1., edge + bulge);
  float r = get_color_channel(color1.r, color2.r, mod(dir + refr_r, 1.), w, 0.02 + .03 * u_refraction * bulge, bulge);
  float g = get_color_channel(color1.g, color2.g, mod(dir, 1.), w, 0.01 / (1. - diagonal), bulge);
  float b = get_color_channel(color1.b, color2.b, mod(dir - refr_b, 1.), w, .01, bulge);
  fragColor = vec4(vec3(r, g, b) * opacity, opacity);
}`;

const hex = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };

/* Defaults are liquid-logo's own (params.ts); `dark` tints the shadow stripes. */
export function mountLiquidLogo(canvas, {
  src = bevelMap, patternScale = 2, refraction = 0.015, edge = 0.4, patternBlur = 0.005,
  liquid = 0.07, speed = 0.3, light = '#FBFAFF', dark = '#1A1A1A',
} = {}) {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: true });
  if (!gl) { canvas.classList.add('is-fallback'); return null; }
  const sh = (type, code) => { const s = gl.createShader(type); gl.shaderSource(s, code); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  const U = {};
  for (let i = 0; i < gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS); i++) {
    const n = gl.getActiveUniform(prog, i).name;
    U[n] = gl.getUniformLocation(prog, n);
  }
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_position');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1f(U.u_patternScale, patternScale);
  gl.uniform1f(U.u_refraction, refraction);
  gl.uniform1f(U.u_edge, edge);
  gl.uniform1f(U.u_patternBlur, patternBlur);
  gl.uniform1f(U.u_liquid, liquid);
  gl.uniform3fv(U.u_light, hex(light));
  gl.uniform3fv(U.u_dark, hex(dark));
  gl.uniform1f(U.u_ratio, 1);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  let total = 0;
  let last = 0;
  let visible = true;

  const size = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(2, Math.round(r.width * dpr));
    canvas.height = Math.max(2, Math.round(r.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(U.u_ratio, canvas.width / canvas.height);
  };

  const img = new Image();
  img.onload = () => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.uniform1i(U.u_image_texture, 0);
    gl.uniform1f(U.u_img_ratio, img.naturalWidth / img.naturalHeight);
    size();
    canvas.classList.add('is-live');
    last = performance.now();
    const frame = (now) => {
      total += (now - last) * speed;
      last = now;
      gl.uniform1f(U.u_time, reduced ? 1200 : total);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduced && visible) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduced) { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(frame); }
    }).observe(canvas);
  };
  img.src = src;
  new ResizeObserver(size).observe(canvas);
  return { stop: () => cancelAnimationFrame(raf) };
}
