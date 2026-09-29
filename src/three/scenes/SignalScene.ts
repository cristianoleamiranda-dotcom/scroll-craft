import {
  BufferAttribute,
  BufferGeometry,
  GridHelper,
  Line,
  PerspectiveCamera,
  Points,
  Scene,
  WebGLRenderer,
  type Material,
} from "three";
import { PALETTE, signalLine, signalPoints } from "@/three/materials/SignalMaterial";

export type SignalMode = "hero" | "engineering" | "project" | "contact";

export interface SignalHandle {
  setMode: (mode: SignalMode) => void;
  setProgress: (value: number) => void;
  setState: (index: number) => void;
  resize: () => void;
  dispose: () => void;
}

const SAMPLES = 240;
const PARTICLES = 520;

/**
 * Abstract signal propagation. No physical devices.
 * One renderer, disposed by the caller.
 */
export function mountSignalScene(canvas: HTMLCanvasElement): SignalHandle | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false,
    });
  } catch (error) {
    console.warn("WebGL no disponible; se usa la señal en canvas.", error);
    return null;
  }
  renderer.setClearColor(PALETTE.gray, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  const scene = new Scene();
  const camera = new PerspectiveCamera(36, 1, 0.1, 80);
  camera.position.set(0, 0.2, 8.4);

  const lines: Line[] = [];
  const colors = [PALETTE.white, PALETTE.blue, PALETTE.cyan];
  const opacities = [0.92, 0.62, 0.45];

  for (let i = 0; i < 3; i += 1) {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(SAMPLES * 3), 3));
    const line = new Line(geometry, signalLine(colors[i], opacities[i]));
    scene.add(line);
    lines.push(line);
  }

  const particleGeometry = new BufferGeometry();
  const particleBase = new Float32Array(PARTICLES * 3);
  const seeds = new Float32Array(PARTICLES);
  for (let i = 0; i < PARTICLES; i += 1) {
    particleBase[i * 3] = (Math.random() - 0.5) * 14;
    particleBase[i * 3 + 1] = (Math.random() - 0.5) * 6;
    particleBase[i * 3 + 2] = (Math.random() - 0.5) * 6;
    seeds[i] = Math.random() * Math.PI * 2;
  }
  particleGeometry.setAttribute("position", new BufferAttribute(particleBase.slice(), 3));
  const points = new Points(particleGeometry, signalPoints(PALETTE.white, 0.028));
  scene.add(points);

  const grid = new GridHelper(20, 20, PALETTE.blue, PALETTE.cyan);
  const gridMaterial = grid.material;
  const fadeGrid = (opacity: number) => {
    const list = Array.isArray(gridMaterial) ? gridMaterial : [gridMaterial];
    list.forEach((material) => {
      material.transparent = true;
      material.opacity = opacity;
    });
  };
  fadeGrid(0.16);
  grid.position.y = -1.8;
  scene.add(grid);

  let mode: SignalMode = "hero";
  let progress = 0;
  let state = 0;
  let running = true;
  let raf = 0;
  const started = performance.now();

  const resize = () => {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const frame = () => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    try {
    const t = (performance.now() - started) / 1000;
    const collapsed = mode === "contact" ? 1 - progress : 1;
    const amp = (0.28 + progress * 0.9 + state * 0.05) * collapsed;
    const freq = 0.7 + state * 0.18 + (mode === "engineering" ? 0.4 : 0);

    lines.forEach((line, index) => {
      const attr = line.geometry.getAttribute("position") as BufferAttribute;
      const arr = attr.array as Float32Array;
      const harm = index + 1;
      for (let i = 0; i < SAMPLES; i += 1) {
        const u = i / (SAMPLES - 1);
        const x = (u - 0.5) * 12 * (mode === "contact" ? 0.35 + collapsed * 0.65 : 1);
        const y = Math.sin(u * Math.PI * 2 * freq * harm + t * (0.55 + progress * 0.4)) * amp * (1 / harm);
        arr[i * 3] = x;
        arr[i * 3 + 1] = y;
        arr[i * 3 + 2] = Math.cos(u * 4 + t * 0.2) * 0.25 * index;
      }
      attr.needsUpdate = true;
    });

    const pAttr = particleGeometry.getAttribute("position") as BufferAttribute;
    const pArr = pAttr.array as Float32Array;
    for (let i = 0; i < PARTICLES; i += 1) {
      pArr[i * 3] = particleBase[i * 3];
      pArr[i * 3 + 1] = particleBase[i * 3 + 1] + Math.sin(t * 0.35 + seeds[i]) * 0.08;
      pArr[i * 3 + 2] = particleBase[i * 3 + 2];
    }
    pAttr.needsUpdate = true;

    const dolly = mode === "hero" ? progress * 2.2 : mode === "project" ? 1.1 : 0.45;
    camera.position.z = 8.4 - dolly;
    camera.position.y = 0.2 - progress * 0.15;
    camera.lookAt(0, 0, 0);
    fadeGrid(mode === "contact" ? 0.05 : 0.16);
    renderer.render(scene, camera);
    } catch (error) {
      running = false;
      console.warn("La escena WebGL se detuvo.", error);
    }
  };

  resize();
  frame();

  return {
    setMode(next) {
      mode = next;
    },
    setProgress(value) {
      progress = Math.min(1, Math.max(0, value));
    },
    setState(index) {
      state = index;
    },
    resize,
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      try {
        lines.forEach((line) => {
          line.geometry.dispose();
          (line.material as Material).dispose();
        });
        particleGeometry.dispose();
        (points.material as Material).dispose();
        grid.geometry.dispose();
        const list = Array.isArray(grid.material) ? grid.material : [grid.material];
        list.forEach((material) => material.dispose());
        renderer.dispose();
        renderer.forceContextLoss();
      } catch (error) {
        console.warn("Limpieza WebGL incompleta.", error);
      }
    },
  };
}
