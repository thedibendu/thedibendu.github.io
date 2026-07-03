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
   RESEARCH WORLDS  (research.html) — ONE distinct scene per ?topic=
   ───────────────────────────────────────────────────────────────
   Each research topic gets its own bespoke backdrop that reflects
   its content (read from research.js). The entry point keeps the
   name buildStructureWorld() so the WORLDS map + data-world stay
   unchanged; it just dispatches to the right builder by topic id.
═══════════════════════════════════════════════════════════════ */

/* small helper — the recurring emissive "glow node" material */
function glowMat(color, intensity) {
  return new THREE.MeshStandardMaterial({ color: WHITE, emissive: color, emissiveIntensity: intensity, roughness: 0.3 });
}

/* topic id → accent colour */
const TOPIC_TINT = {
  'dna-translocases':        CYAN,
  'molecular-motors':        BRIGHT,
  'viral-dna-packaging':     BRIGHT,
  'cryo-em':                 VIOLET,
  'model-building':          EMER,
  'computational-workflows': EMER,
};

/* ── dna-translocases: DNA gripped + screwed through a firing ATPase ring ──
   The idea from the page: an oligomeric ring ATPase around DNA whose subunits
   cycle through nucleotide states, their pore loops gripping and pulling the
   strand hand-over-hand into directional (vectorial) motion. */
function buildTranslocaseWorld(accent) {
  scene.fog = new THREE.FogExp2(BG, 0.024);
  const light = new THREE.PointLight(accent, 1.15, 60);
  light.position.set(3, 4, 7);
  scene.add(light);

  /* hexameric ring lying flat in the XZ plane (pore axis = vertical Y) */
  const ring = new THREE.Group();
  scene.add(ring);
  const R = 2.5;
  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(R, 0.14, 18, 120),
    new THREE.MeshStandardMaterial({ color: TEAL, emissive: accent, emissiveIntensity: 0.14, roughness: 0.55, metalness: 0.55 })
  );
  collar.rotation.x = Math.PI / 2;
  ring.add(collar);

  /* six subunits, each with an inward pore-loop "gripper" it drives when it fires */
  const subMats = [], grips = [];
  const subGeo = new THREE.DodecahedronGeometry(0.85, 0);
  const gripGeo = new THREE.SphereGeometry(0.15, 10, 10);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const mat = new THREE.MeshStandardMaterial({ color: TEAL, emissive: accent, emissiveIntensity: 0.25, roughness: 0.5, metalness: 0.55, flatShading: true });
    subMats.push(mat);
    const s = new THREE.Mesh(subGeo, mat);
    s.position.set(Math.cos(a) * R, 0, Math.sin(a) * R);
    s.rotation.set(a, a * 1.3, 0);
    ring.add(s);
    const grip = new THREE.Mesh(gripGeo, glowMat(accent, 1.2));
    grip.userData.a = a;
    ring.add(grip);
    grips.push(grip);
  }

  /* DNA double helix threaded vertically (Y) through the pore */
  const dna = new THREE.Group();
  scene.add(dna);
  const hR = 0.72, hH = 22, turns = 11;
  class Helix extends THREE.Curve {
    constructor(ph) { super(); this.ph = ph; }
    getPoint(t, tg = new THREE.Vector3()) {
      const a = t * Math.PI * 2 * turns + this.ph;
      return tg.set(Math.cos(a) * hR, (t - 0.5) * hH, Math.sin(a) * hR);
    }
  }
  const bb = new THREE.MeshStandardMaterial({ color: BRIGHT, emissive: accent, emissiveIntensity: 0.3, roughness: 0.35, metalness: 0.3 });
  dna.add(new THREE.Mesh(new THREE.TubeGeometry(new Helix(0), 520, 0.1, 12, false), bb));
  dna.add(new THREE.Mesh(new THREE.TubeGeometry(new Helix(Math.PI), 520, 0.1, 12, false), bb));
  const rungMat = new THREE.MeshStandardMaterial({ color: 0xdff2fb, emissive: accent, emissiveIntensity: 0.22, roughness: 0.5 });
  const s1 = new Helix(0), s2 = new Helix(Math.PI);
  for (let i = 0; i <= 48; i++) { const t = i / 48; dna.add(connect(s1.getPoint(t), s2.getPoint(t), rungMat, 0.04)); }

  const parts = dust(800, 46, accent, 0.05, 0.2);
  scene.add(parts);

  return function update(now, spin) {
    /* sequential hand-over-hand firing wave; grippers reach in as they fire */
    const t = now * 0.004;
    for (let i = 0; i < 6; i++) {
      const fire = Math.max(0, Math.sin(t - i * (Math.PI * 2 / 6))) ** 3;
      subMats[i].emissiveIntensity = 0.22 + fire * 1.7;
      const g = grips[i];
      const reach = R - 0.55 - fire * 1.15;
      g.position.set(Math.cos(g.userData.a) * reach, Math.sin(t * 1.3 - i) * 0.12, Math.sin(g.userData.a) * reach);
      g.material.emissiveIntensity = 0.6 + fire * 1.6;
    }
    ring.rotation.y += 0.0014 * spin;
    dna.rotation.y  += 0.006 * spin;               /* screw = translocation */
    dna.position.y  = Math.sin(now * 0.0006) * 0.3;
    parts.rotation.y += 0.0003 * spin;
  };
}

/* ── molecular-motors: a mechanochemical cycle with a power stroke ──
   The idea from the page: chemical states (ATP/ADP/apo…) reshape a free-energy
   landscape; coordinated transitions rectify motion into a lever power stroke.
   A ring of nucleotide states lights up in sequence around a central motor whose
   lever arm snaps forward (fast stroke) then slowly recovers. */
function buildMotorCycleWorld(accent) {
  scene.fog = new THREE.FogExp2(BG, 0.026);
  const light = new THREE.PointLight(accent, 1.05, 60);
  light.position.set(4, 3, 6);
  scene.add(light);

  /* outer cycle of nucleotide-state nodes on a faint circular track */
  const cycle = new THREE.Group();
  scene.add(cycle);
  const cR = 3.3;
  const stateMats = [];
  const stateN = 8;
  const stGeo = new THREE.OctahedronGeometry(0.28, 0);
  for (let i = 0; i < stateN; i++) {
    const a = (i / stateN) * Math.PI * 2;
    const mat = new THREE.MeshStandardMaterial({ color: WHITE, emissive: accent, emissiveIntensity: 0.5, roughness: 0.35 });
    stateMats.push(mat);
    const m = new THREE.Mesh(stGeo, mat);
    m.position.set(Math.cos(a) * cR, Math.sin(a) * cR, 0);
    cycle.add(m);
  }
  const track = new THREE.Mesh(
    new THREE.TorusGeometry(cR, 0.02, 8, 140),
    new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.18 })
  );
  cycle.add(track);

  /* central motor: stator ring + rotor hub + a lever arm (the power stroke) */
  const motor = new THREE.Group();
  scene.add(motor);
  motor.add(new THREE.Mesh(
    new THREE.TorusGeometry(1.55, 0.12, 16, 90),
    new THREE.MeshStandardMaterial({ color: TEAL, emissive: accent, emissiveIntensity: 0.12, roughness: 0.6, metalness: 0.5 })
  ));
  const hub = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.85, 1),
    new THREE.MeshStandardMaterial({ color: TEAL, emissive: accent, emissiveIntensity: 0.55, roughness: 0.4, metalness: 0.5, flatShading: true })
  );
  motor.add(hub);
  const lever = new THREE.Group();
  motor.add(lever);
  const armMat = new THREE.MeshStandardMaterial({ color: WHITE, emissive: accent, emissiveIntensity: 0.75, roughness: 0.35, metalness: 0.4 });
  lever.add(connect(new THREE.Vector3(0, 0, 0), new THREE.Vector3(2.3, 0, 0), armMat, 0.09));
  const tip = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), armMat);
  tip.position.set(2.3, 0, 0);
  lever.add(tip);

  const parts = dust(700, 44, accent, 0.05, 0.18);
  scene.add(parts);

  return function update(now, spin) {
    /* asymmetric stroke: quick power stroke, slow recovery */
    const cyc = (now * 0.00045 * spin) % 1;
    lever.rotation.z = cyc < 0.3
      ? (cyc / 0.3) * Math.PI * 0.85
      : Math.PI * 0.85 * (1 - (cyc - 0.3) / 0.7);
    hub.rotation.y += 0.01 * spin;
    hub.scale.setScalar(1 + Math.sin(now * 0.002) * 0.07);
    const t = now * 0.0016;
    for (let i = 0; i < stateN; i++) {
      stateMats[i].emissiveIntensity = 0.4 + Math.max(0, Math.sin(t - i * (Math.PI * 2 / stateN))) ** 2 * 1.5;
    }
    cycle.rotation.z += 0.0006 * spin;
    parts.rotation.y += 0.0003 * spin;
  };
}

/* ── viral-dna-packaging: capsid + terminase motor at the portal ──
   The idea from the page: a preassembled icosahedral procapsid, a terminase
   ATPase docked at a portal vertex translocating DNA in against rising internal
   pressure, the genome spooling into layered shells inside. */
function buildCapsidWorld(accent) {
  scene.fog = new THREE.FogExp2(BG, 0.026);
  const light = new THREE.PointLight(accent, 1.1, 60);
  light.position.set(4, 3, 6);
  scene.add(light);

  const capsid = new THREE.Group();
  scene.add(capsid);
  const ico = new THREE.IcosahedronGeometry(3.7, 0);               /* sharp 20-face shell */
  capsid.add(new THREE.Mesh(ico, new THREE.MeshStandardMaterial({
    color: TEAL, emissive: accent, emissiveIntensity: 0.12, roughness: 0.5, metalness: 0.4,
    flatShading: true, transparent: true, opacity: 0.12, side: THREE.DoubleSide,
  })));
  capsid.add(new THREE.LineSegments(
    new THREE.WireframeGeometry(ico),
    new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.32 })
  ));
  const vGeo = new THREE.SphereGeometry(0.1, 12, 12);
  const vMat = glowMat(accent, 1.3);
  const verts = ico.getAttribute('position');
  const seen = new Set();
  for (let i = 0; i < verts.count; i++) {
    const x = verts.getX(i), y = verts.getY(i), z = verts.getZ(i);
    const key = `${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const v = new THREE.Mesh(vGeo, vMat);
    v.position.set(x, y, z);
    capsid.add(v);
  }

  /* spooled genome coil inside — spirals outward in layers */
  const genome = new THREE.Group();
  capsid.add(genome);
  class Spool extends THREE.Curve {
    getPoint(t, tg = new THREE.Vector3()) {
      const a = t * Math.PI * 2 * 18;
      const rr = 0.5 + t * 1.95;
      const yy = Math.sin(t * Math.PI * 2 * 4) * 0.5;
      return tg.set(Math.cos(a) * rr, yy, Math.sin(a) * rr);
    }
  }
  genome.add(new THREE.Mesh(
    new THREE.TubeGeometry(new Spool(), 700, 0.05, 8, false),
    new THREE.MeshStandardMaterial({ color: BRIGHT, emissive: accent, emissiveIntensity: 0.35, roughness: 0.4 })
  ));

  /* portal + terminase motor ring below the bottom vertex */
  const portal = new THREE.Group();
  portal.position.set(0, -3.7, 0);
  scene.add(portal);
  const portalRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.14, 12, 44),
    new THREE.MeshStandardMaterial({ color: TEAL, emissive: accent, emissiveIntensity: 0.5, roughness: 0.4, metalness: 0.55 })
  );
  portalRing.rotation.x = Math.PI / 2;
  portal.add(portalRing);
  const term = new THREE.Group();
  term.position.y = -0.7;
  portal.add(term);
  const termMats = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const mt = new THREE.MeshStandardMaterial({ color: WHITE, emissive: accent, emissiveIntensity: 0.6, roughness: 0.4, flatShading: true });
    termMats.push(mt);
    const n = new THREE.Mesh(new THREE.IcosahedronGeometry(0.24, 0), mt);
    n.position.set(Math.cos(a) * 0.62, 0, Math.sin(a) * 0.62);
    term.add(n);
  }

  /* DNA double helix feeding up through the portal */
  const feed = new THREE.Group();
  scene.add(feed);
  const fR = 0.3;
  class Feed extends THREE.Curve {
    constructor(ph) { super(); this.ph = ph; }
    getPoint(t, tg = new THREE.Vector3()) {
      const a = t * Math.PI * 2 * 7 + this.ph;
      return tg.set(Math.cos(a) * fR, -8.4 + t * 4.2, Math.sin(a) * fR);
    }
  }
  const fMat = new THREE.MeshStandardMaterial({ color: BRIGHT, emissive: accent, emissiveIntensity: 0.3, roughness: 0.35 });
  feed.add(new THREE.Mesh(new THREE.TubeGeometry(new Feed(0), 220, 0.06, 8, false), fMat));
  feed.add(new THREE.Mesh(new THREE.TubeGeometry(new Feed(Math.PI), 220, 0.06, 8, false), fMat));

  const parts = dust(700, 48, accent, 0.05, 0.16);
  scene.add(parts);

  return function update(now, spin) {
    capsid.rotation.y += 0.0011 * spin;
    capsid.rotation.x = Math.sin(now * 0.00018) * 0.12;
    genome.rotation.y += 0.004 * spin;             /* genome spooling */
    portalRing.rotation.z += 0.012 * spin;
    term.rotation.y += 0.02 * spin;
    const t = now * 0.005;                          /* terminase firing wave */
    for (let i = 0; i < 5; i++) termMats[i].emissiveIntensity = 0.5 + Math.max(0, Math.sin(t - i * (Math.PI * 2 / 5))) ** 2 * 1.4;
    feed.rotation.y += 0.02 * spin;                 /* DNA screwing in */
    parts.rotation.y += 0.0003 * spin;
  };
}

/* ── cryo-em: many 2D particle views reconstructed into one 3D map ──
   The idea from the page: low-dose projections captured in every orientation,
   then computationally combined into a 3D density. Flat "image cards" face the
   central reconstruction; a few beam lines link views to the emerging map. */
function buildMicroscopeWorld(accent) {
  scene.fog = new THREE.FogExp2(BG, 0.028);
  const light = new THREE.PointLight(accent, 1.0, 60);
  light.position.set(-4, 3, 6);
  scene.add(light);

  /* central reconstruction: shaded core + wireframe shell + tight density halo */
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.6, 2),
    new THREE.MeshStandardMaterial({ color: TEAL, emissive: accent, emissiveIntensity: 0.5, roughness: 0.5, metalness: 0.4, flatShading: true })
  );
  scene.add(core);
  const coreShell = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.6, 2)),
    new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.28 })
  );
  scene.add(coreShell);
  const halo = dust(500, 4.4, accent, 0.06, 0.4);
  scene.add(halo);

  /* particle projection "image cards" on a shell, each facing the reconstruction */
  const cards = new THREE.Group();
  scene.add(cards);
  const cardGeo = new THREE.PlaneGeometry(0.95, 0.95);
  const beamPts = [];
  for (let i = 0; i < 48; i++) {
    const r = 4.2 + Math.random() * 2.4;
    const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    const p = new THREE.Vector3(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph));
    const c = new THREE.Mesh(cardGeo, new THREE.MeshStandardMaterial({
      color: WHITE, emissive: accent, emissiveIntensity: 0.55, roughness: 0.5,
      side: THREE.DoubleSide, transparent: true, opacity: 0.42,
    }));
    c.position.copy(p);
    c.lookAt(0, 0, 0);
    c.rotateZ(Math.random() * Math.PI);
    c.userData.spin = (Math.random() - 0.5) * 0.006;
    cards.add(c);
    if (i % 6 === 0) { beamPts.push(p.clone().multiplyScalar(0.42), p.clone()); }
  }
  const beams = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(beamPts),
    new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.14 })
  );
  cards.add(beams);

  /* faint Fourier-shell rings at varied tilts */
  const rings = new THREE.Group();
  scene.add(rings);
  for (let i = 1; i <= 3; i++) {
    const ringM = new THREE.Mesh(
      new THREE.TorusGeometry(2.0 + i * 0.75, 0.008, 8, 90),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.1 })
    );
    ringM.rotation.x = Math.PI / 2 + i * 0.3;
    rings.add(ringM);
  }

  const parts = dust(500, 46, accent, 0.05, 0.16);
  scene.add(parts);

  return function update(now, spin) {
    core.rotation.y += 0.0016 * spin; core.rotation.x += 0.0007 * spin;
    coreShell.rotation.y += 0.0016 * spin; coreShell.rotation.x += 0.0007 * spin;
    halo.rotation.y += 0.001 * spin;
    core.scale.setScalar(1 + Math.sin(now * 0.0015) * 0.06);
    cards.children.forEach((c) => { if (c.userData.spin) c.rotateZ(c.userData.spin * spin); });
    cards.rotation.y += 0.0005 * spin;
    rings.rotation.y += 0.0009 * spin; rings.rotation.z += 0.0005 * spin;
    parts.rotation.y += 0.0003 * spin;
  };
}

/* ── model-building: an atomic model fitted inside contoured density ──
   The idea from the page: turning experimental density into a chemically sensible
   atomic model — a backbone with sidechain stubs threaded through a translucent
   density envelope, the interpretation living inside the map. */
function buildModelWorld(accent) {
  scene.fog = new THREE.FogExp2(BG, 0.026);
  const light = new THREE.PointLight(accent, 1.0, 60);
  light.position.set(4, 3, 6);
  scene.add(light);

  const model = new THREE.Group();
  scene.add(model);

  /* helical Cα path */
  const N = 56;
  const path = [];
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const a = t * Math.PI * 2 * 4.5;
    path.push(new THREE.Vector3(Math.cos(a) * 1.9, (t - 0.5) * 6.4, Math.sin(a) * 1.9));
  }
  const atomMat = glowMat(accent, 1.3);
  const bondMat = new THREE.MeshStandardMaterial({ color: WHITE, emissive: accent, emissiveIntensity: 0.55, roughness: 0.4 });
  const atomGeo = new THREE.SphereGeometry(0.15, 12, 12);
  for (let i = 0; i < N; i++) {
    const s = new THREE.Mesh(atomGeo, atomMat);
    s.position.copy(path[i]);
    model.add(s);
    if (i > 0) model.add(connect(path[i - 1], path[i], bondMat, 0.05));
  }
  /* sidechain stubs pointing radially outward every few residues */
  const scGeo = new THREE.SphereGeometry(0.1, 8, 8);
  for (let i = 2; i < N; i += 3) {
    const dir = new THREE.Vector3(path[i].x, 0, path[i].z).normalize().multiplyScalar(0.65);
    const tipP = path[i].clone().add(dir);
    model.add(connect(path[i], tipP, bondMat, 0.035));
    const sc = new THREE.Mesh(scGeo, atomMat);
    sc.position.copy(tipP);
    model.add(sc);
  }

  /* translucent density "contour": overlapping soft blobs hugging the chain */
  const dens = new THREE.Group();
  model.add(dens);
  const densMat = new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.15, roughness: 0.9, transparent: true, opacity: 0.08, depthWrite: false });
  const densGeo = new THREE.IcosahedronGeometry(0.9, 1);
  for (let i = 0; i < N; i += 2) {
    const b = new THREE.Mesh(densGeo, densMat);
    b.position.copy(path[i]);
    b.scale.setScalar(0.8 + Math.random() * 0.5);
    dens.add(b);
  }
  /* additive point mesh for the fine "map" texture */
  const dcount = 1600;
  const dpos = new Float32Array(dcount * 3);
  for (let i = 0; i < dcount; i++) {
    const base = path[Math.floor(Math.random() * N)];
    dpos[i * 3]     = base.x + (Math.random() - 0.5) * 1.6;
    dpos[i * 3 + 1] = base.y + (Math.random() - 0.5) * 1.6;
    dpos[i * 3 + 2] = base.z + (Math.random() - 0.5) * 1.6;
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
  const pts = new THREE.Points(dg, new THREE.PointsMaterial({
    color: accent, size: 0.09, transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  model.add(pts);

  const parts = dust(500, 44, accent, 0.05, 0.14);
  scene.add(parts);

  return function update(now, spin) {
    model.rotation.y += 0.0016 * spin;
    dens.rotation.y  -= 0.0004 * spin;
    pts.rotation.y   += 0.0006 * spin;
    parts.rotation.y += 0.0003 * spin;
  };
}

/* ── computational-workflows: a provenance pipeline with data flowing ──
   The idea from the page: reproducible, traceable steps from raw data to
   interpretable structure — staged nodes linked by rails, data packets flowing
   forward, with branch outputs (validation tables / figures) along the way. */
function buildWorkflowWorld(accent) {
  scene.fog = new THREE.FogExp2(BG, 0.024);
  const warm = new THREE.PointLight(AMBER, 0.5, 60); warm.position.set(6, -2, 4); scene.add(warm);
  const light = new THREE.PointLight(accent, 0.9, 60); light.position.set(-4, 3, 6); scene.add(light);

  const pipe = new THREE.Group();
  scene.add(pipe);

  const S = 5;
  const nodePts = [];
  for (let i = 0; i < S; i++) {
    const t = i / (S - 1);
    const p = new THREE.Vector3((t - 0.5) * 9, Math.sin(t * Math.PI * 2) * 1.35, Math.cos(t * Math.PI * 1.5) * 0.85);
    nodePts.push(p);
    const hot = i % 2 === 0;
    const col = hot ? accent : AMBER;
    const node = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.5, 0),
      new THREE.MeshStandardMaterial({ color: TEAL, emissive: col, emissiveIntensity: 0.65, roughness: 0.4, metalness: 0.45, flatShading: true })
    );
    node.position.copy(p);
    pipe.add(node);
    /* orbiting file/param satellites (little data tiles) */
    for (let j = 0; j < 5; j++) {
      const a = (j / 5) * Math.PI * 2;
      const sat = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.16, 0.02), glowMat(col, 1.1));
      sat.position.set(p.x + Math.cos(a) * 0.82, p.y + Math.sin(a) * 0.82, p.z);
      sat.rotation.z = a;
      pipe.add(sat);
    }
    /* branch outputs (validation / figures) at a couple of stages */
    if (i === 2 || i === 4) {
      const bp = new THREE.Vector3(p.x, p.y - 1.9, p.z + 0.4);
      const bm = new THREE.MeshStandardMaterial({ color: WHITE, emissive: BRIGHT, emissiveIntensity: 0.7, roughness: 0.4 });
      pipe.add(connect(p, bp, bm, 0.02));
      const bn = new THREE.Mesh(new THREE.TetrahedronGeometry(0.24), bm);
      bn.position.copy(bp);
      pipe.add(bn);
    }
  }

  /* rails between consecutive stages */
  const railMat = new THREE.MeshStandardMaterial({ color: WHITE, emissive: accent, emissiveIntensity: 0.3, roughness: 0.5 });
  for (let i = 1; i < S; i++) pipe.add(connect(nodePts[i - 1], nodePts[i], railMat, 0.028));

  /* bright data packets flowing stage → stage */
  const packets = [];
  for (let i = 0; i < S - 1; i++) {
    for (let k = 0; k < 3; k++) {
      const pkt = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), glowMat(BRIGHT, 1.9));
      pkt.userData = { from: nodePts[i], to: nodePts[i + 1], t: Math.random(), speed: 0.004 + Math.random() * 0.003 };
      pipe.add(pkt);
      packets.push(pkt);
    }
  }

  const parts = dust(600, 46, accent, 0.045, 0.14);
  scene.add(parts);

  return function update(now, spin) {
    pipe.rotation.y = Math.sin(now * 0.0002) * 0.22;   /* gentle sway */
    packets.forEach((p) => {
      p.userData.t += p.userData.speed * spin;
      if (p.userData.t > 1) p.userData.t -= 1;
      p.position.lerpVectors(p.userData.from, p.userData.to, p.userData.t);
    });
    parts.rotation.y += 0.0002 * spin;
  };
}

/* ── dispatcher: keeps the name buildStructureWorld for the WORLDS map ── */
function buildStructureWorld() {
  const topic  = new URLSearchParams(location.search).get('topic');
  const accent = TOPIC_TINT[topic] || CYAN;
  const BUILD = {
    'dna-translocases':        buildTranslocaseWorld,
    'molecular-motors':        buildMotorCycleWorld,
    'viral-dna-packaging':     buildCapsidWorld,
    'cryo-em':                 buildMicroscopeWorld,
    'model-building':          buildModelWorld,
    'computational-workflows': buildWorkflowWorld,
  };
  return (BUILD[topic] || buildCapsidWorld)(accent);
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
    size: 0.15, vertexColors: true, transparent: true, opacity: 0.75,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  scene.add(parts);

  /* big soft glow orbs floating slowly (bokeh) */
  const orbs = [];
  const orbColors = [AMBER, BRIGHT, CYAN, AMBER, BRIGHT];
  for (let i = 0; i < 5; i++) {
    const o = new THREE.Mesh(
      new THREE.SphereGeometry(1.3 + Math.random() * 1.0, 24, 24),
      new THREE.MeshBasicMaterial({ color: orbColors[i], transparent: true, opacity: 0.13, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    o.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6 - 2);
    o.userData.phase = Math.random() * Math.PI * 2;
    o.userData.baseY = o.position.y;
    scene.add(o);
    orbs.push(o);
  }

  /* bright drifting "fireflies" — solid glow cores so the scene clearly reads 3D */
  const flies = [];
  const flyGeo = new THREE.SphereGeometry(0.12, 14, 14);
  for (let i = 0; i < 16; i++) {
    const warmFly = Math.random() < 0.45;
    const f = new THREE.Mesh(flyGeo, glowMat(warmFly ? AMBER : BRIGHT, 1.8));
    f.position.set((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8 - 1);
    f.userData = { phase: Math.random() * Math.PI * 2, baseY: f.position.y, amp: 0.8 + Math.random() * 1.4, spd: 0.0003 + Math.random() * 0.0004 };
    scene.add(f);
    flies.push(f);
  }

  return function update(now, spin) {
    parts.rotation.y += 0.0002 * spin;
    parts.rotation.x = Math.sin(now * 0.00015) * 0.08;
    for (const o of orbs) {
      o.position.y = o.userData.baseY + Math.sin(now * 0.0004 + o.userData.phase) * 1.2;
      o.scale.setScalar(1 + Math.sin(now * 0.0007 + o.userData.phase) * 0.12);
    }
    for (const f of flies) {
      f.position.y = f.userData.baseY + Math.sin(now * f.userData.spd + f.userData.phase) * f.userData.amp;
    }
  };
}

/* ── Pick the world for this page ── */
const WORLDS = { motor: buildMotorWorld, structure: buildStructureWorld, network: buildNetworkWorld, field: buildFieldWorld };
let updateWorld;
try {
  updateWorld = (WORLDS[WORLD] || buildMotorWorld)();
} catch (err) {
  /* never blank the canvas if one world fails — fall back to the motor world */
  console.error('[three-scene] world build failed, falling back:', err);
  updateWorld = buildMotorWorld();
}

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
