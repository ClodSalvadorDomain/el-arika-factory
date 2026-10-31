/* ==========================================================================
   Procedural 3D sofa (react-three-fiber)
   --------------------------------------------------------------------------
   Built from rounded boxes so it needs no model file. Modes:
     scroll  progress() 0..1 assembles the sofa: frame, legs, arms, seat
             cushions, backrest, pillows, then the raw linen takes the
             chosen fabric colour. Used by the showroom and home scroll acts.
     spin    fully assembled, orbit + auto-rotate: the product page 360° view.
   setColor(hex) on the returned handle recolours the fabric live.
   ========================================================================== */
import { createRoot } from 'react-dom/client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const RAW = new THREE.Color('#D9D0C3');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - (1 - x) ** 3);
const seg = (p, a, b) => ease((p - a) / (b - a));

const SEATS = [-0.61, 0, 0.61];
const LEGS = [[-0.9, -0.34], [0.9, -0.34], [-0.9, 0.34], [0.9, 0.34]];

function createStore(v) {
  const subs = new Set();
  return { get: () => v, set: (n) => { v = n; subs.forEach((f) => f()); } };
}

function Sofa({ progress, store, mode }) {
  const frame = useRef();
  const arms = useRef([]);
  const legs = useRef([]);
  const seats = useRef([]);
  const backs = useRef([]);
  const pillows = useRef([]);
  const group = useRef();
  const p = useRef(mode === 'scroll' ? 0 : 1);
  const tmp = useMemo(() => new THREE.Color(), []);
  const want = useMemo(() => new THREE.Color(), []);

  const fabric = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: mode === 'scroll' ? RAW.clone() : new THREE.Color(store.get()),
    roughness: 0.88, sheen: 1, sheenRoughness: 0.42, sheenColor: new THREE.Color('#ffffff'),
  }), []);
  const cushion = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#F2EDE5', roughness: 0.95, sheen: 0.7, sheenRoughness: 0.55, sheenColor: new THREE.Color('#ffffff'),
  }), []);
  const wood = useMemo(() => new THREE.MeshStandardMaterial({ color: '#4A3324', roughness: 0.42, metalness: 0.05 }), []);

  useFrame((state, dt) => {
    const goal = mode === 'scroll' && progress ? progress() : 1;
    p.current = reduced ? goal : THREE.MathUtils.damp(p.current, goal, 7, dt);
    const P = p.current;

    const mix = mode === 'scroll' ? seg(P, 0.8, 0.97) : 1;
    want.set(store.get());
    tmp.copy(RAW).lerp(want, mix);
    fabric.color.lerp(tmp, 1 - Math.exp(-9 * dt));

    if (frame.current) frame.current.position.y = (1 - seg(P, 0, 0.2)) * 1.8;
    legs.current.forEach((g) => { if (g) g.scale.y = Math.max(0.001, seg(P, 0.08, 0.24)); });
    arms.current.forEach((g, i) => { if (g) g.position.x = (i ? 1 : -1) * (1.01 + (1 - seg(P, 0.16, 0.38)) * 1.6); });
    seats.current.forEach((g, i) => { if (g) g.position.y = (1 - seg(P, 0.32 + i * 0.05, 0.52 + i * 0.05)) * 1.5; });
    backs.current.forEach((g, i) => {
      if (!g) return;
      const k = seg(P, 0.5 + i * 0.05, 0.72 + i * 0.05);
      g.position.z = -0.31 - (1 - k) * 1.4;
      g.rotation.x = -0.16 - (1 - k) * 0.9;
    });
    pillows.current.forEach((g) => { if (g) g.scale.setScalar(Math.max(0.001, seg(P, 0.72, 0.86))); });

    if (mode === 'scroll' && group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(-0.8, 0.38, P) + Math.sin(state.clock.elapsedTime * 0.35) * 0.015;
    }
  });

  return (
    <group ref={group}>
      <group ref={frame}>
        <RoundedBox args={[2.0, 0.2, 0.86]} radius={0.05} smoothness={4} position={[0, 0.24, 0]} material={fabric} />
        <RoundedBox args={[2.0, 0.46, 0.14]} radius={0.06} smoothness={4} position={[0, 0.5, -0.37]} material={fabric} />
      </group>
      {LEGS.map(([x, z], i) => (
        <group key={`l${i}`} ref={(el) => { legs.current[i] = el; }} position={[x, 0, z]}>
          <mesh position={[0, 0.07, 0]} material={wood}><cylinderGeometry args={[0.028, 0.019, 0.14, 20]} /></mesh>
        </group>
      ))}
      {[0, 1].map((i) => (
        <group key={`a${i}`} ref={(el) => { arms.current[i] = el; }} position={[i ? 1.01 : -1.01, 0, 0]}>
          <RoundedBox args={[0.2, 0.54, 0.9]} radius={0.08} smoothness={4} position={[0, 0.41, 0]} material={fabric} />
        </group>
      ))}
      {SEATS.map((x, i) => (
        <group key={`s${i}`} ref={(el) => { seats.current[i] = el; }} position={[x, 0, 0.05]}>
          <RoundedBox args={[0.6, 0.17, 0.72]} radius={0.07} smoothness={4} position={[0, 0.42, 0]} material={fabric} />
        </group>
      ))}
      {SEATS.map((x, i) => (
        <group key={`b${i}`} ref={(el) => { backs.current[i] = el; }} position={[x, 0.73, -0.31]} rotation={[-0.16, 0, 0]}>
          <RoundedBox args={[0.6, 0.46, 0.2]} radius={0.09} smoothness={4} material={fabric} />
        </group>
      ))}
      {[-1, 1].map((s, i) => (
        <group key={`p${i}`} ref={(el) => { pillows.current[i] = el; }} position={[s * 0.6, 0.67, -0.1]} rotation={[-0.28, s * -0.32, s * 0.08]}>
          <RoundedBox args={[0.4, 0.36, 0.12]} radius={0.06} smoothness={4} material={cushion} />
        </group>
      ))}
    </group>
  );
}

/* Pull the camera back on narrow canvases so the full width of the sofa stays in frame. */
function FitCamera({ mode }) {
  const { camera, size } = useThree();
  useEffect(() => {
    if (mode === 'spin') return;
    const aspect = size.width / size.height;
    const z = 4.6 * Math.max(1, 1.2 / aspect);
    camera.position.set(0, 1.25 * (z / 4.6), z);
    camera.lookAt(0, 0.42, 0);
  }, [camera, size, mode]);
  return null;
}

function Scene({ progress, store, mode }) {
  return (
    <>
      <FitCamera mode={mode} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 4, 3]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.3} position={[-5, 2, 1]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#FFE2DA" position={[5, 1.5, -1]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
      </Environment>
      <Sofa progress={progress} store={store} mode={mode} />
      <ContactShadows position={[0, 0, 0]} opacity={0.42} scale={6} blur={2.6} far={1.6} resolution={512} color="#3A1A1C" />
      {mode === 'spin' && (
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={2.6}
          maxDistance={6}
          minPolarAngle={0.6}
          maxPolarAngle={1.45}
          autoRotate={!reduced}
          autoRotateSpeed={0.9}
          target={[0, 0.42, 0]}
        />
      )}
    </>
  );
}

function Stage({ el, ...props }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '120px' });
    io.observe(el);
    return () => io.disconnect();
  }, [el]);
  const cam = props.mode === 'spin' ? { position: [2.6, 1.5, 3.6], fov: 32 } : { position: [0, 1.25, 4.6], fov: 30 };
  return (
    <Canvas
      frameloop={visible ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={cam}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ camera }) => camera.lookAt(0, 0.42, 0)}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Scene {...props} />
    </Canvas>
  );
}

export function mountSofa(el, { mode = 'scroll', progress = null, color = '#E30613' } = {}) {
  const store = createStore(color);
  const root = createRoot(el);
  root.render(<Stage el={el} mode={mode} progress={progress} store={store} />);
  requestAnimationFrame(() => el.classList.add('is-live'));
  return { setColor: (hex) => store.set(hex), unmount: () => root.unmount() };
}
