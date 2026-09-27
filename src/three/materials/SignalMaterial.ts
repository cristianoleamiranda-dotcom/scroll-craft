import { LineBasicMaterial, PointsMaterial } from "three";

/** Materials limited to the SENDER palette. No extra hues. */

export function signalLine(color: number, opacity = 0.9) {
  return new LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  });
}

export function signalPoints(color: number, size: number) {
  return new PointsMaterial({
    color,
    size,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    depthWrite: false,
  });
}

export const PALETTE = {
  white: 0xffffff,
  blue: 0x1e73be,
  cyan: 0x0085b2,
  gray: 0x494949,
} as const;
