import { useEffect, useRef } from "react";

interface Props {
  className?: string;
  variant: "hero" | "wave" | "contact";
  progress?: number;
}

/** 2D signal. Always available, including mobile and reduced motion (static). */
export function SignalCanvas({ className, variant, progress = 0 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth || 1;
      const height = canvas.clientHeight || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const width = canvas.clientWidth || 1;
      const height = canvas.clientHeight || 1;
      const p = progressRef.current;
      ctx.clearRect(0, 0, width, height);
      const amp =
        variant === "contact" ? height * 0.08 * (1 - p) : variant === "hero" ? 6 + p * height * 0.16 : height * 0.22;
      const freq = variant === "hero" ? 1.2 + p * 2.4 : 2.2;
      const mid = height * (variant === "contact" ? 0.5 : 0.5);

      const stroke = (color: string, widthPx: number, harmonic: number, phase: number) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = widthPx;
        for (let x = 0; x <= width; x += 3) {
          const u = x / width;
          const env = variant === "hero" ? Math.sin(u * Math.PI) : 1;
          const y = mid + Math.sin(u * Math.PI * 2 * freq * harmonic + phase) * amp * env * (1 / harmonic);
          const cx = variant === "contact" ? width / 2 + (x - width / 2) * (0.15 + (1 - p) * 0.85) : x;
          if (x === 0) ctx.moveTo(cx, y);
          else ctx.lineTo(cx, y);
        }
        ctx.stroke();
      };

      const phase = reduced ? 0.4 : time / 900;
      stroke("#ffffff", 1.4, 1, phase);
      if (variant !== "hero" || p > 0.15) stroke("#1e73be", 1.1, 2, phase + 0.6);
      if (p > 0.35 || variant === "wave") stroke("#0085b2", 1, 3, phase + 1.1);

      if (running && !reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    draw(0);
    const onResize = () => {
      resize();
      draw(performance.now());
    };
    window.addEventListener("resize", onResize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [variant]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
