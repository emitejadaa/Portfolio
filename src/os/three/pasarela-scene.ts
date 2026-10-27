import {
  AmbientLight,
  BoxGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
  type Object3D,
} from "three";

export type PasarelaOptions = {
  ids: string[];
  theme: "midnight" | "daylight";
  /** "strip": todos en fila (escritorio) · "single": un objeto a la vez (mobile). */
  mode: "strip" | "single";
  reducedMotion: boolean;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  onIndex?: (index: number) => void;
};

export type PasarelaController = {
  setTheme: (t: "midnight" | "daylight") => void;
  step: (dir: 1 | -1) => void;
  boost: (amount: number) => void;
  dispose: () => void;
};

const SPACING = 2.4;
const BASE_SPEED = 0.55; // ≈ 80 px/s at the desktop scale
const SPIN = (Math.PI * 2) / 4; // una vuelta cada 4 s

function clay(theme: "midnight" | "daylight") {
  return new MeshStandardMaterial({
    color: theme === "midnight" ? 0xc8ccd4 : 0xe9e4d8,
    roughness: 0.82,
    metalness: 0.02,
  });
}

function box(w: number, h: number, d: number, m: MeshStandardMaterial, x = 0, y = 0, z = 0) {
  const mesh = new Mesh(new BoxGeometry(w, h, d), m);
  mesh.position.set(x, y, z);
  return mesh;
}
function cyl(rt: number, rb: number, h: number, m: MeshStandardMaterial, x = 0, y = 0, z = 0, seg = 20) {
  const mesh = new Mesh(new CylinderGeometry(rt, rb, h, seg), m);
  mesh.position.set(x, y, z);
  return mesh;
}

function header(m: MeshStandardMaterial, count: number, x0: number, z: number, step = 0.1) {
  const g = new Group();
  for (let i = 0; i < count; i++) g.add(box(0.06, 0.1, 0.06, m, x0 + i * step, 0.08, z));
  return g;
}

/** Low-poly, un único material clay: solo forma. */
function buildObject(id: string, m: MeshStandardMaterial): Object3D {
  const g = new Group();
  switch (id) {
    case "laptop": {
      g.add(box(1.7, 0.07, 1.15, m, 0, 0, 0));
      const screen = new Group();
      screen.add(box(1.7, 1.08, 0.05, m, 0, 0.54, 0));
      screen.add(box(1.5, 0.9, 0.02, m, 0, 0.56, 0.03));
      screen.position.set(0, 0.04, -0.55);
      screen.rotation.x = -0.32;
      g.add(screen);
      g.add(box(1.4, 0.02, 0.5, m, 0, 0.045, -0.12));
      g.add(box(0.5, 0.02, 0.3, m, 0, 0.045, 0.36));
      g.position.y = -0.35;
      break;
    }
    case "raspberry": {
      g.add(box(1.5, 0.05, 1.0, m));
      g.add(box(0.36, 0.3, 0.42, m, 0.62, 0.17, 0.22));
      g.add(box(0.36, 0.28, 0.32, m, 0.62, 0.16, -0.2));
      g.add(box(0.36, 0.26, 0.32, m, 0.62, 0.15, -0.46 + 0.04));
      g.add(box(0.36, 0.07, 0.36, m, -0.18, 0.06, 0));
      g.add(box(0.22, 0.05, 0.22, m, 0.15, 0.05, 0.12));
      const h = header(m, 13, -0.62, -0.42, 0.1);
      g.add(h);
      const h2 = header(m, 13, -0.62, -0.32, 0.1);
      g.add(h2);
      g.rotation.x = 0.18;
      break;
    }
    case "esp32": {
      g.add(box(0.62, 0.04, 1.3, m));
      g.add(box(0.46, 0.08, 0.62, m, 0, 0.06, -0.14));
      g.add(box(0.46, 0.015, 0.22, m, 0, 0.03, -0.56));
      g.add(box(0.12, 0.06, 0.1, m, 0, 0.05, 0.58));
      for (let i = 0; i < 12; i++) {
        g.add(box(0.05, 0.12, 0.05, m, -0.27, -0.06, -0.52 + i * 0.095));
        g.add(box(0.05, 0.12, 0.05, m, 0.27, -0.06, -0.52 + i * 0.095));
      }
      g.rotation.set(0.5, 0, -0.25);
      break;
    }
    case "git": {
      const plate = box(1.05, 1.05, 0.14, m);
      plate.rotation.z = Math.PI / 4;
      g.add(plate);
      const knob = (x: number, y: number) => {
        const c = cyl(0.11, 0.11, 0.12, m, x, y, 0.1, 18);
        c.rotation.x = Math.PI / 2;
        return c;
      };
      g.add(knob(-0.18, -0.34));
      g.add(knob(-0.18, 0.08));
      g.add(knob(0.2, 0.0));
      const bar = box(0.06, 0.62, 0.06, m, -0.18, -0.06, 0.12);
      g.add(bar);
      const diag = box(0.06, 0.44, 0.06, m, 0.02, 0.18, 0.12);
      diag.rotation.z = -0.95;
      g.add(diag);
      break;
    }
    case "arduino": {
      g.add(box(1.4, 0.05, 1.0, m));
      g.add(box(0.36, 0.28, 0.32, m, -0.6, 0.16, 0.22));
      const jack = cyl(0.11, 0.11, 0.34, m, -0.6, 0.14, -0.24);
      jack.rotation.z = Math.PI / 2;
      g.add(jack);
      g.add(box(0.7, 0.1, 0.22, m, 0.22, 0.08, 0.1));
      g.add(header(m, 10, -0.2, -0.44, 0.1));
      g.add(header(m, 8, 0.0, 0.44, 0.1));
      g.rotation.x = 0.18;
      break;
    }
    case "breadboard": {
      g.add(box(1.7, 0.16, 0.8, m));
      g.add(box(1.55, 0.02, 0.05, m, 0, 0.09, 0));
      for (let i = 0; i < 14; i++) g.add(box(0.04, 0.02, 0.22, m, -0.65 + i * 0.1, 0.09, 0.2));
      const led = new Group();
      led.add(cyl(0.11, 0.11, 0.18, m, 0, 0.45, 0, 18));
      const dome = new Mesh(new SphereGeometry(0.11, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), m);
      dome.position.y = 0.54;
      led.add(dome);
      led.add(cyl(0.12, 0.12, 0.03, m, 0, 0.36, 0, 18));
      led.add(cyl(0.012, 0.012, 0.32, m, -0.04, 0.2, 0, 6));
      led.add(cyl(0.012, 0.012, 0.28, m, 0.04, 0.22, 0, 6));
      led.position.set(0.25, 0, -0.1);
      g.add(led);
      g.rotation.x = 0.28;
      break;
    }
    case "dip": {
      g.add(box(1.3, 0.16, 0.44, m));
      const notch = cyl(0.06, 0.06, 0.02, m, -0.55, 0.085, 0, 14);
      g.add(notch);
      for (let i = 0; i < 9; i++) {
        const x = -0.56 + i * 0.14;
        g.add(box(0.05, 0.03, 0.14, m, x, 0, 0.27));
        g.add(box(0.05, 0.22, 0.03, m, x, -0.11, 0.33));
        g.add(box(0.05, 0.03, 0.14, m, x, 0, -0.27));
        g.add(box(0.05, 0.22, 0.03, m, x, -0.11, -0.33));
      }
      g.rotation.set(0.45, 0.2, 0);
      break;
    }
    case "rack": {
      for (let i = 0; i < 3; i++) {
        const y = -0.4 + i * 0.4;
        g.add(box(1.4, 0.34, 0.9, m, 0, y, 0));
        for (let v = 0; v < 6; v++) g.add(box(0.08, 0.2, 0.02, m, -0.55 + v * 0.11, y, 0.46));
        g.add(cyl(0.035, 0.035, 0.03, m, 0.52, y + 0.05, 0.46, 10).rotateX(Math.PI / 2));
        g.add(cyl(0.035, 0.035, 0.03, m, 0.6, y + 0.05, 0.46, 10).rotateX(Math.PI / 2));
      }
      g.add(box(0.06, 1.3, 0.06, m, -0.74, 0, 0.47));
      g.add(box(0.06, 1.3, 0.06, m, 0.74, 0, 0.47));
      g.rotation.y = -0.35;
      break;
    }
    case "database": {
      for (let i = 0; i < 3; i++) g.add(cyl(0.55, 0.55, 0.3, m, 0, -0.38 + i * 0.36, 0, 32));
      g.add(new Mesh(new TorusGeometry(0.55, 0.015, 6, 40), m).rotateX(Math.PI / 2).translateZ(0.02));
      g.rotation.x = 0.25;
      break;
    }
    case "terminal":
    default: {
      g.add(box(1.6, 1.1, 0.1, m));
      g.add(box(1.6, 0.16, 0.12, m, 0, 0.47, 0.02));
      const chevA = box(0.3, 0.06, 0.06, m, -0.48, 0.12, 0.08);
      chevA.rotation.z = -0.6;
      const chevB = box(0.3, 0.06, 0.06, m, -0.48, -0.04, 0.08);
      chevB.rotation.z = 0.6;
      g.add(chevA, chevB);
      g.add(box(0.36, 0.06, 0.06, m, -0.05, -0.12, 0.08));
      for (let i = 0; i < 3; i++) g.add(cyl(0.035, 0.035, 0.04, m, -0.68 + i * 0.1, 0.47, 0.09, 10).rotateX(Math.PI / 2));
      g.rotation.y = 0.3;
      break;
    }
  }
  g.userData.id = id;
  return g;
}

export function createPasarela(canvas: HTMLCanvasElement, opts: PasarelaOptions): PasarelaController {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);

  // Luz de estudio fija.
  const hemi = new HemisphereLight(0xffffff, 0x404050, 1.1);
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(-3, 5, 6);
  const rim = new DirectionalLight(opts.theme === "midnight" ? 0x8b5cff : 0x1f3bff, 0.8);
  rim.position.set(4, 2, -4);
  scene.add(hemi, key, rim, new AmbientLight(0xffffff, 0.15));

  let material = clay(opts.theme);
  const track = new Group();
  scene.add(track);
  const items: Group[] = opts.ids.map((id, i) => {
    const holder = new Group();
    holder.add(buildObject(id, material));
    holder.userData.id = id;
    holder.position.x = i * SPACING;
    holder.rotation.y = i * 0.6;
    track.add(holder);
    return holder;
  });
  const span = items.length * SPACING;

  let width = 1;
  let height = 1;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    if (opts.mode === "single") {
      camera.position.set(0, 0.5, 5.2);
    } else {
      // Fit ~3.5 objects across the strip.
      const visible = Math.min(4.2, Math.max(2.2, width / 105));
      const dist = (visible * SPACING) / 2 / Math.tan((camera.fov * Math.PI) / 360) / camera.aspect;
      camera.position.set(0, 0.6, Math.max(5, dist));
    }
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // Motion state
  let offset = 0;
  let speedMul = 1;
  let boostTarget = 1;
  let paused = false;
  let hovered: string | null = null;
  let singleIndex = 0;
  let singleTarget = 0;

  const raycaster = new Raycaster();
  const pointer = new Vector2();
  let dragging = false;
  let lastX = 0;
  let dragDist = 0;

  const pick = (e: PointerEvent): string | null => {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(track.children, true)[0];
    let o: Object3D | null = hit?.object ?? null;
    while (o && !o.userData.id) o = o.parent;
    return (o?.userData.id as string) ?? null;
  };

  const onMove = (e: PointerEvent) => {
    if (dragging) {
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      dragDist += Math.abs(dx);
      if (opts.mode === "single") return;
      offset -= dx * 0.012;
      boostTarget = Math.min(4, 1 + Math.abs(dx) * 0.4);
      return;
    }
    const id = pick(e);
    if (id !== hovered) {
      hovered = id;
      paused = !!id && opts.mode === "strip";
      canvas.style.cursor = id ? "pointer" : "grab";
      opts.onHover?.(id);
    }
  };
  let startX = 0;
  const onDown = (e: PointerEvent) => {
    dragging = true;
    dragDist = 0;
    lastX = e.clientX;
    startX = e.clientX;
    canvas.setPointerCapture(e.pointerId);
  };
  const onUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    // Mobile: un objeto a la vez con swipe.
    if (opts.mode === "single" && Math.abs(e.clientX - startX) > 30) {
      controller.step(e.clientX < startX ? 1 : -1);
      return;
    }
    if (dragDist < 6) {
      const id = pick(e);
      if (id) opts.onSelect?.(id);
    }
    boostTarget = 1;
  };
  const onLeave = () => {
    if (hovered) opts.onHover?.(null);
    hovered = null;
    paused = false;
  };
  const onWheel = (e: WheelEvent) => {
    if (opts.mode === "single") return;
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) && !e.shiftKey) return; // no robar el scroll vertical
    e.preventDefault();
    offset += (e.deltaX || e.deltaY) * 0.006;
    boostTarget = Math.min(4, 1 + Math.abs(e.deltaX || e.deltaY) * 0.05);
  };

  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  let visible = true;
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((en) => en.isIntersecting);
  });
  io.observe(canvas);

  let raf = 0;
  let last = performance.now();
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible || document.hidden) return;

    // Al soltar vuelve al ritmo base en ~1,2 s con inercia.
    speedMul += (boostTarget - speedMul) * Math.min(1, dt * 3.2);
    if (!dragging) boostTarget += (1 - boostTarget) * Math.min(1, dt * 2.5);

    if (opts.mode === "strip") {
      if (!paused && !opts.reducedMotion) offset += BASE_SPEED * speedMul * dt;
      for (let i = 0; i < items.length; i++) {
        const it = items[i]!;
        let px = i * SPACING - offset;
        px = ((((px + span / 2) % span) + span) % span) - span / 2;
        it.position.x = px;
        const isHover = hovered === it.userData.id;
        if (!opts.reducedMotion && !(paused && isHover)) it.rotation.y += SPIN * dt * (isHover ? 0.2 : 1);
        const s = isHover ? 1.12 : 1;
        it.scale.setScalar(it.scale.x + (s - it.scale.x) * Math.min(1, dt * 10));
      }
    } else {
      singleIndex += (singleTarget - singleIndex) * Math.min(1, dt * 6);
      for (let i = 0; i < items.length; i++) {
        const it = items[i]!;
        it.position.x = (i - singleIndex) * SPACING * 1.4;
        it.visible = Math.abs(i - singleIndex) < 1.6;
        if (!opts.reducedMotion) it.rotation.y += SPIN * dt;
      }
    }
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(loop);
  if (opts.reducedMotion) renderer.render(scene, camera);

  const controller: PasarelaController = {
    setTheme(t) {
      const next = clay(t);
      items.forEach((it) =>
        it.traverse((o) => {
          if ((o as Mesh).isMesh) (o as Mesh).material = next;
        }),
      );
      material.dispose();
      material = next;
      rim.color.set(t === "midnight" ? 0x8b5cff : 0x1f3bff);
    },
    step(dir) {
      if (opts.mode === "single") {
        singleTarget = (singleTarget + dir + items.length) % items.length;
        if (singleTarget === 0 && dir === 1) singleIndex = -1;
        if (singleTarget === items.length - 1 && dir === -1) singleIndex = items.length;
        opts.onIndex?.(singleTarget);
      } else {
        offset += dir * SPACING;
        boostTarget = 2.5;
      }
    },
    boost(amount) {
      boostTarget = Math.min(4, Math.max(1, amount));
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("wheel", onWheel);
      scene.traverse((o) => {
        if ((o as Mesh).isMesh) (o as Mesh).geometry.dispose();
      });
      material.dispose();
      renderer.dispose();
    },
  };
  return controller;
}
