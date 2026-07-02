/* ═══════════════════════════════════════════════════════════════
   three-scene.js — Dibendu Singh · 3D immersive backgrounds
   ONE engine, several "worlds" — each page picks one that fits its
   context, chosen via <body data-world="...">:

     motor      · home       — hexameric ATPase motor + DNA + capsid
     structure  · research    — icosahedral capsid lattice (topic-tinted)
     network    · publications — glowing knowledge-graph constellation
     field      · journal      — soft warm bokeh / density field

   Camera intensity is separate: <body data-scene="calm"> gives a
   gentle ambient camera for reading pages; the default flies.
   Shared: renderer + ACES tone mapping, light rig, restrained bloom
   (bright cores only), damped scroll/mouse camera, resize.
═══════════════════════════════════════════════════════════════ */

import * as THREE from 'three';
import { EffectComposer }   from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }       from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass }  from 'three/addons/postprocessing/UnrealBloomPass.js';

const canvas = document.getElementById('bg-canvas');

const SCENE = document.body.dataset.scene || 'full';
const CALM  = SCENE === 'calm';
const WORLD = document.body.dataset.world || 'motor';

/* Palette */
const CYAN   = 0x06b6d4;
const BRIGHT = 0x22d3ee;
const TEAL   = 0x0a5a70;
const VIOLET = 0x8b5cf6;
const EMER   = 0x34d399;
const AMBER  = 0xf59e0b;
const WHITE  = 0xffffff;
const BG     = 0x030912;

/* Bail out gracefully if WebGL is unavailable */
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
} catch (e) {
  canvas.style.display = 'none';
  document.body.classList.add('no-webgl');
  throw e;
}

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 0, 8);

/* ── Base light rig (worlds may add accent lights) ── */
scene.add(new THREE.HemisphereLight(0x1b3a52, 0x01040a, 0.7));
scene.add(new THREE.AmbientLight(0x0a1a2a, 0.5));
const key = new THREE.DirectionalLight(0xbfefff, 1.5);
key.position.set(5, 7, 8);
scene.add(key);
const rim = new THREE.PointLight(CYAN, 1.3, 60);
rim.position.set(-7, -3, -5);
scene.add(rim);

/* ── helpers ── */
function connect(p1, p2, mat, r) {
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, dir.length(), 8), mat);
  mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return mesh;
}
function dust(count, spread, color, size, opacity) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * spread;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ color, size, transparent: true, opacity, depthWrite: false }));
}

/* ═══════════════════════════════════════════════════════════════
   WORLD: motor  (home)
═══════════════════════════════════════════════════════════════ */
function buildMotorWorld() {
  scene.fog = new THREE.FogExp2(BG, 0.026);
  const accent = new THREE.PointLight(BRIGHT, 0.9, 30);
  accent.position.set(0, 0, 3);
  scene.add(accent);

  const motor = new THREE.Group();
  scene.add(motor);
  const ringRadius = 1.75;
  const subGeo = new THREE.IcosahedronGeometry(0.62, 1);
  const subMat = new THREE.MeshStandardMaterial({ color: TEAL, emissive: CYAN, emissiveIntensity: 0.14, roughness: 0.55, metalness: 0.5, flatShading: true });
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const s = new THREE.Mesh(subGeo, subMat);
    s.position.set(Math.cos(a) * ringRadius, Math.sin(a) * ringRadius, 0);
    s.rotation.set(a, a * 1.3, a);
    s.scale.set(1, 1, 0.82);
    motor.add(s);
  }
  motor.add(new THREE.Mesh(
    new THREE.TorusGeometry(ringRadius, 0.055, 16, 90),
    new THREE.MeshStandardMaterial({ color: TEAL, emissive: CYAN, emissiveIntensity: 0.1, roughness: 0.6, metalness: 0.5 })
  ));
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.44, 32, 32),
    new THREE.MeshStandardMaterial({ color: WHITE, emissive: BRIGHT, emissiveIntensity: 1.8, roughness: 0.25 })
  );
  motor.add(core);

  const dna = new THREE.Group();
  scene.add(dna);
  const hR = 0.62, hH = 18, turns = 7;
  class Helix extends THREE.Curve {
    constructor(ph) { super(); this.ph = ph; }
    getPoint(t, tg = new THREE.Vector3()) {
      const a = t * Math.PI * 2 * turns + this.ph;
      return tg.set(Math.cos(a) * hR, Math.sin(a) * hR, (t - 0.5) * hH);
    }
  }
  const bbMat = new THREE.MeshStandardMaterial({ color: BRIGHT, emissive: CYAN, emissiveIntensity: 0.18, roughness: 0.35, metalness: 0.3 });
  dna.add(new THREE.Mesh(new THREE.TubeGeometry(new Helix(0), 420, 0.075, 10, false), bbMat));
  dna.add(new THREE.Mesh(new THREE.TubeGeometry(new Helix(Math.PI), 420, 0.075, 10, false), bbMat));
  const rungMat = new THREE.MeshStandardMaterial({ color: 0xcfeffb, emissive: CYAN, emissiveIntensity: 0.12, roughness: 0.5 });
  const s1 = new Helix(0), s2 = new Helix(Math.PI);
  for (let i = 0; i <= 34; i++) { const t = i / 34; dna.add(connect(s1.getPoint(t), s2.getPoint(t), rungMat, 0.03)); }

  const capOuter = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(5.6, 1)), new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.09 }));
  const capInner = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(4.8, 1)), new THREE.LineBasicMaterial({ color: BRIGHT, transparent: true, opacity: 0.06 }));
  scene.add(capOuter, capInner);

  const parts = dust(1100, 46, BRIGHT, 0.05, CALM ? 0.22 : 0.34);
  scene.add(parts);

  return function update(now, spin) {
    motor.rotation.z += 0.0030 * spin;
    dna.rotation.z   += 0.0038 * spin;
    capOuter.rotation.y += 0.0008 * spin; capOuter.rotation.x += 0.0004 * spin;
    capInner.rotation.y -= 0.0011 * spin;
    parts.rotation.y += 0.0003 * spin;
    core.scale.setScalar(1 + Math.sin(now * 0.0018) * 0.1);
  };
}

/* ═══════════════════════════════════════════════════════════════
   WORLD: structure  (research) — capsid lattice, tinted by topic
═══════════════════════════════════════════════════════════════ */
function buildStructureWorld() {
  scene.fog = new THREE.FogExp2(BG, 0.03);

  /* topic → accent colour (context reaction) */
  const topic = new URLSearchParams(location.search).get('topic');
  const TINT = {
    'cryo-em': VIOLET,
    'model-building': EMER,
    'computational-workflows': EMER,
    'viral-dna-packaging': BRIGHT,
  };
  const accentColor = TINT[topic] || CYAN;

  const accent = new THREE.PointLight(accentColor, 1.1, 60);
  accent.position.set(4, 2, 6);
  scene.add(accent);

  const group = new THREE.Group();
  scene.add(group);

  /* geodesic lattice: wireframe shell + glowing vertices */
  const ico = new THREE.IcosahedronGeometry(4.3, 2);
  group.add(new THREE.LineSegments(
    new THREE.WireframeGeometry(ico),
    new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0.16 })
  ));

  const vGeo = new THREE.SphereGeometry(0.075, 12, 12);
  const vMat = new THREE.MeshStandardMaterial({ color: WHITE, emissive: accentColor, emissiveIntensity: 1.4, roughness: 0.3 });
  const verts = ico.getAttribute('position');
  const seen = new Set();
  for (let i = 0; i < verts.count; i++) {
    const x = verts.getX(i), y = verts.getY(i), z = verts.getZ(i);
    const key = `${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const v = new THREE.Mesh(vGeo, vMat);
    v.position.set(x, y, z);
    group.add(v);
  }

  /* inner rotating core + a faint second shell */
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.1, 1),
    new THREE.MeshStandardMaterial({ color: TEAL, emissive: accentColor, emissiveIntensity: 0.6, roughness: 0.4, metalness: 0.5, flatShading: true })
  );
  scene.add(core);
  const shell2 = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.6, 1)),
    new THREE.LineBasicMaterial({ color: WHITE, transparent: true, opacity: 0.05 })
  );
  scene.add(shell2);

  const parts = dust(900, 46, accentColor, 0.05, 0.2);
  scene.add(parts);

  return function update(now, spin) {
    group.rotation.y += 0.0016 * spin;
    group.rotation.x += 0.0006 * spin;
    core.rotation.y  -= 0.0030 * spin; core.rotation.z += 0.0018 * spin;
    shell2.rotation.y += 0.0022 * spin;
    parts.rotation.y += 0.00025 * spin;
    core.scale.setScalar(1 + Math.sin(now * 0.0016) * 0.08);
  };
}

/* ═══════════════════════════════════════════════════════════════
   WORLD: network  (publications) — glowing knowledge graph
═══════════════════════════════════════════════════════════════ */
function buildNetworkWorld() {
  scene.fog = new THREE.FogExp2(BG, 0.028);
  const accent = new THREE.PointLight(VIOLET, 0.9, 60);
  accent.position.set(-5, 3, 5);
  scene.add(accent);

  const group = new THREE.Group();
  scene.add(group);

  /* nodes in a spherical volume */
  const N = 58;
  const nodes = [];
  const nodeGeo = new THREE.SphereGeometry(0.11, 14, 14);
  for (let i = 0; i < N; i++) {
    const r = 2 + Math.random() * 3.4;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    const p = new THREE.Vector3(
      r * Math.sin(ph) * Math.cos(th),
      r * Math.sin(ph) * Math.sin(th),
      r * Math.cos(ph)
    );
    const hot = Math.random() < 0.22;                 // a few violet "hubs"
    const mat = new THREE.MeshStandardMaterial({
      color: WHITE, emissive: hot ? VIOLET : BRIGHT,
      emissiveIntensity: hot ? 1.6 : 1.1, roughness: 0.3,
    });
    const m = new THREE.Mesh(nodeGeo, mat);
    m.position.copy(p);
    m.scale.setScalar(hot ? 1.5 : 1);
    group.add(m);
    nodes.push(p);
  }

  /* edges between nearby nodes */
  const linePts = [];
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      if (nodes[i].distanceTo(nodes[j]) < 2.1) { linePts.push(nodes[i], nodes[j]); }
    }
  }
  const eGeo = new THREE.BufferGeometry().setFromPoints(linePts);
  group.add(new THREE.LineSegments(eGeo, new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.16 })));

  const parts = dust(700, 44, BRIGHT, 0.045, 0.18);
  scene.add(parts);

  return function update(now, spin) {
    group.rotation.y += 0.0015 * spin;
    group.rotation.x = Math.sin(now * 0.0002) * 0.15;
    parts.rotation.y -= 0.0002 * spin;
  };
}

/* ═══════════════════════════════════════════════════════════════
   WORLD: field  (journal) — soft warm bokeh / density
═══════════════════════════════════════════════════════════════ */
function buildFieldWorld() {
  scene.fog = new THREE.FogExp2(BG, 0.02);
  const warm = new THREE.PointLight(AMBER, 0.7, 60);
  warm.position.set(6, -2, 4);
  scene.add(warm);

  /* two-tone drifting particles (warm + cyan), additive for bokeh */
  const count = 2400;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const cWarm = new THREE.Color(AMBER), cCyan = new THREE.Color(BRIGHT);
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 40;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    const c = Math.random() < 0.4 ? cWarm : cCyan;
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const parts = new THREE.Points(g, new THREE.PointsMaterial({
    size: 0.11, vertexColors: true, transparent: true, opacity: 0.5,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  scene.add(parts);

  /* big soft glow orbs floating slowly (bokeh) */
  const orbs = [];
  const orbColors = [AMBER, BRIGHT, CYAN, AMBER, BRIGHT];
  for (let i = 0; i < 5; i++) {
    const o = new THREE.Mesh(
      new THREE.SphereGeometry(1.1 + Math.random() * 0.8, 24, 24),
      new THREE.MeshBasicMaterial({ color: orbColors[i], transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    o.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6 - 2);
    o.userData.phase = Math.random() * Math.PI * 2;
    o.userData.baseY = o.position.y;
    scene.add(o);
    orbs.push(o);
  }

  return function update(now, spin) {
    parts.rotation.y += 0.0002 * spin;
    parts.rotation.x = Math.sin(now * 0.00015) * 0.08;
    for (const o of orbs) {
      o.position.y = o.userData.baseY + Math.sin(now * 0.0004 + o.userData.phase) * 1.2;
      o.scale.setScalar(1 + Math.sin(now * 0.0007 + o.userData.phase) * 0.12);
    }
  };
}

/* ── Pick the world for this page ── */
const WORLDS = { motor: buildMotorWorld, structure: buildStructureWorld, network: buildNetworkWorld, field: buildFieldWorld };
const updateWorld = (WORLDS[WORLD] || buildMotorWorld)();

/* ═══════════════════════════════════════
   POST-PROCESSING — restrained bloom (bright cores only)
═══════════════════════════════════════ */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.5, 0.5, 0.55));

/* ═══════════════════════════════════════
   SCROLL + MOUSE DRIVEN CAMERA
═══════════════════════════════════════ */
let targetScroll = 0, scroll = 0, mouseX = 0, mouseY = 0, mx = 0, my = 0;
function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  targetScroll = max > 0 ? window.scrollY / max : 0;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
window.addEventListener('pointermove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = (e.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animate() {
  requestAnimationFrame(animate);
  scroll += (targetScroll - scroll) * 0.07;
  mx += (mouseX - mx) * 0.05;
  my += (mouseY - my) * 0.05;

  const p = scroll;
  let angle, radius, height, parX, parY;
  if (CALM) {
    angle  = 0.38 + p * 0.55;
    radius = 11.5 - p * 1.0;
    height = -0.6 + p * 1.7;
    parX = 0.5; parY = 0.4;
  } else {
    angle  = p * Math.PI * 1.5 + 0.15;
    radius = 8 - Math.sin(Math.min(p, 1) * Math.PI) * 4.3;
    height = Math.sin(p * Math.PI * 2) * 2.2;
    parX = 0.9; parY = 0.6;
  }
  camera.position.set(Math.sin(angle) * radius + mx * parX, height + my * parY, Math.cos(angle) * radius);
  camera.lookAt(0, CALM ? 0.2 : height * 0.1, 0);

  updateWorld(performance.now(), reduce ? 0.15 : 1);
  composer.render();
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});
