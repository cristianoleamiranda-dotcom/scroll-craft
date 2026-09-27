/**
 * Depth travel for a project scene.
 * The photograph stays itself: only camera-like scale and translation.
 */

export function projectDepth(progress: number, reduced: boolean) {
  if (reduced) return "none";
  const p = Math.min(1, Math.max(0, progress));
  const scale = 1.08 - p * 0.08;
  const y = (1 - p) * 18;
  return `translate3d(0, ${y}px, 0) scale(${scale})`;
}

export function signalWipe(progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  const inset = (1 - p) * 46;
  return `inset(${inset}% 0 ${inset}% 0)`;
}
