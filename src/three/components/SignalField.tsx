import { useEffect, useRef } from "react";
import type { SignalHandle, SignalMode } from "@/three/scenes/SignalScene";

interface Props {
  className?: string;
  mode: SignalMode;
  progress?: number;
  state?: number;
  active?: boolean;
}

function canUseWebGL() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(pointer: coarse), (max-width: 1099px)").matches) return false;
  return true;
}

/** Lazy WebGL field. One context, disposed on unmount. 2D canvas covers the fallback. */
export function SignalField({ className, mode, progress = 0, state = 0, active = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<SignalHandle | null>(null);

  useEffect(() => {
    if (!active || !canUseWebGL()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;

    void import("@/three/scenes/SignalScene")
      .then(({ mountSignalScene }) => {
        if (cancelled || !canvasRef.current) return;
        const handle = mountSignalScene(canvasRef.current);
        if (!handle) return;
        handle.setMode(mode);
        handle.setProgress(progress);
        handle.setState(state);
        handleRef.current = handle;
      })
      .catch((error) => {
        console.warn("No se pudo iniciar la escena de señal.", error);
      });

    const onResize = () => handleRef.current?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      handleRef.current?.dispose();
      handleRef.current = null;
    };
    // Mount once per activation. Live values are pushed in the next effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;
    handle.setMode(mode);
    handle.setProgress(progress);
    handle.setState(state);
  }, [mode, progress, state]);

  if (!active) return null;
  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
