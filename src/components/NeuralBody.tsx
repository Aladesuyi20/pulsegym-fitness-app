import { useEffect, useRef } from "react";

/**
 * Animated 3D-ish "nerves forming a body" hero background.
 * Particles scatter from chaos, drift into a humanoid silhouette,
 * connect via glowing filaments, gently rotate on Y-axis, then loop.
 */
export default function NeuralBody() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let W = 0,
      H = 0,
      DPR = 1;

    // Body silhouette target points in normalized model space (x: -1..1, y: -1..1, z: -0.3..0.3)
    // Head, neck, torso, arms, legs — sampled along body outline.
    const targets: { x: number; y: number; z: number }[] = [];

    const addLine = (
      x1: number,
      y1: number,
      z1: number,
      x2: number,
      y2: number,
      z2: number,
      n: number,
    ) => {
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        targets.push({
          x: x1 + (x2 - x1) * t,
          y: y1 + (y2 - y1) * t,
          z: z1 + (z2 - z1) * t,
        });
      }
    };
    const addCircle = (cx: number, cy: number, cz: number, r: number, n: number, squash = 1) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        targets.push({
          x: cx + Math.cos(a) * r,
          y: cy + Math.sin(a) * r * squash,
          z: cz + Math.sin(a) * r * 0.35,
        });
      }
    };

    // Head
    addCircle(0, -0.78, 0, 0.14, 40, 1.15);
    // Neck
    addLine(-0.05, -0.6, 0, 0.05, -0.6, 0, 6);
    // Shoulders
    addLine(-0.42, -0.5, 0, 0.42, -0.5, 0, 30);
    // Torso sides
    addLine(-0.35, -0.5, 0, -0.28, 0.05, 0, 22);
    addLine(0.35, -0.5, 0, 0.28, 0.05, 0, 22);
    // Waist
    addLine(-0.28, 0.05, 0, 0.28, 0.05, 0, 20);
    // Spine
    addLine(0, -0.55, 0, 0, 0.05, 0, 24);
    // Chest cross
    addLine(-0.3, -0.35, 0, 0.3, -0.35, 0, 22);
    // Arms
    addLine(-0.42, -0.5, 0.05, -0.62, -0.05, 0.15, 22);
    addLine(-0.62, -0.05, 0.15, -0.72, 0.38, 0.05, 22);
    addLine(0.42, -0.5, 0.05, 0.62, -0.05, 0.15, 22);
    addLine(0.62, -0.05, 0.15, 0.72, 0.38, 0.05, 22);
    // Hips
    addLine(-0.28, 0.05, 0, -0.22, 0.15, 0, 6);
    addLine(0.28, 0.05, 0, 0.22, 0.15, 0, 6);
    // Legs
    addLine(-0.22, 0.15, 0, -0.28, 0.55, 0, 24);
    addLine(-0.28, 0.55, 0, -0.24, 0.95, 0, 22);
    addLine(0.22, 0.15, 0, 0.28, 0.55, 0, 24);
    addLine(0.28, 0.55, 0, 0.24, 0.95, 0, 22);

    const N = targets.length;

    type P = {
      // origin (chaos)
      ox: number;
      oy: number;
      oz: number;
      // target
      tx: number;
      ty: number;
      tz: number;
      // current
      x: number;
      y: number;
      z: number;
      phase: number;
    };
    const parts: P[] = targets.map((t, i) => ({
      ox: (Math.random() - 0.5) * 3,
      oy: (Math.random() - 0.5) * 3,
      oz: (Math.random() - 0.5) * 1.5,
      tx: t.x,
      ty: t.y,
      tz: t.z,
      x: 0,
      y: 0,
      z: 0,
      phase: (i / N) * Math.PI * 2,
    }));

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    const FORM_MS = 3200; // scatter -> formed
    const LOOP_MS = 12000; // full cycle: form, hold, drift

    const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    const project = (x: number, y: number, z: number) => {
      const scale = Math.min(W, H) * 0.42;
      const persp = 1 / (1 + z * 0.55);
      return {
        px: W / 2 + x * scale * persp,
        py: H / 2 + y * scale * persp,
        depth: persp,
      };
    };

    const draw = (now: number) => {
      const elapsed = now - start;
      const cyc = (elapsed % LOOP_MS) / LOOP_MS;
      // formation progress inside each cycle
      const formT = Math.min(1, (elapsed % LOOP_MS) / FORM_MS);
      const form = easeInOut(formT);
      // gentle Y rotation
      const rotY = Math.sin(elapsed * 0.0004) * 0.55 + cyc * Math.PI * 0.15;
      const cosY = Math.cos(rotY),
        sinY = Math.sin(rotY);

      ctx.clearRect(0, 0, W, H);
      // background gradient
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      bg.addColorStop(0, "#0a0a0a");
      bg.addColorStop(1, "#000000");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // update particles
      const projected: {
        px: number;
        py: number;
        depth: number;
        x: number;
        y: number;
        z: number;
      }[] = [];
      for (let i = 0; i < N; i++) {
        const p = parts[i];
        // per-particle stagger
        const localT = Math.max(0, Math.min(1, form * 1.3 - (i / N) * 0.3));
        const e = easeInOut(localT);
        // breathe: slight target oscillation
        const breathe = Math.sin(elapsed * 0.001 + p.phase) * 0.008;
        const tx = p.tx + breathe;
        const ty = p.ty + breathe * 0.5;
        const tz = p.tz + Math.cos(elapsed * 0.0008 + p.phase) * 0.02;

        p.x = p.ox + (tx - p.ox) * e;
        p.y = p.oy + (ty - p.oy) * e;
        p.z = p.oz + (tz - p.oz) * e;

        // rotate around Y
        const rx = p.x * cosY + p.z * sinY;
        const rz = -p.x * sinY + p.z * cosY;

        const proj = project(rx, p.y, rz);
        projected.push({ ...proj, x: rx, y: p.y, z: rz });
      }

      // connecting nerves
      ctx.lineWidth = 1;
      const MAX_D = 55;
      for (let i = 0; i < N; i++) {
        const a = projected[i];
        for (let j = i + 1; j < N; j++) {
          const b = projected[j];
          const dx = a.px - b.px;
          const dy = a.py - b.py;
          const d2 = dx * dx + dy * dy;
          if (d2 < MAX_D * MAX_D) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / MAX_D) * 0.55 * form;
            // red-ish nerve near center, white filaments outside
            const isNerve = Math.random() < 0.02;
            if (isNerve) {
              ctx.strokeStyle = `rgba(230, 57, 70, ${alpha * 0.9})`;
              ctx.lineWidth = 1.2;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.35})`;
              ctx.lineWidth = 0.6;
            }
            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.stroke();
          }
        }
      }

      // particles as glowing nodes
      for (let i = 0; i < N; i++) {
        const p = projected[i];
        const r = 1.4 * p.depth + Math.sin(elapsed * 0.004 + i) * 0.4 + 0.6;
        const glow = 0.75 * form;
        // core
        ctx.fillStyle = `rgba(255, 255, 255, ${glow})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
        ctx.fill();
        // occasional red pulse traveling through nerves
        if ((i + Math.floor(elapsed * 0.04)) % 37 === 0) {
          ctx.fillStyle = `rgba(230, 57, 70, ${0.9 * form})`;
          ctx.beginPath();
          ctx.arc(p.px, p.py, r * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
