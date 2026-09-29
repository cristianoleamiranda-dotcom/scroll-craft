/**
 * Archivo visual de SENDER ya presente en el repositorio fuente.
 * No se generan fotografías nuevas ni se sustituye el sujeto.
 */

function media(file: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}media/${file}`;
}

export const images = {
  hero: media("hero.jpg"),
  heroWide: media("hero-wide.jpg"),
  about: media("about.jpg"),
  capAntennas: media("cap-antennas.jpg"),
  capBroadcast: media("cap-broadcast.jpg"),
  capCritical: media("cap-critical.jpg"),
  capRf: media("cap-rf.jpg"),
  capTransmission: media("cap-transmission.jpg"),
  projAm: media("proj-am.jpg"),
  projStl: media("proj-stl.jpg"),
  heroVideo: media("sender-hero.mp4"),
} as const;

export type ImageId = keyof typeof images;

/** Variantes WebP derivadas de los mismos originales. Nunca se agranda el archivo. */
export const srcset: Record<string, { srcSet: string; sizes: string }> = {
  [images.hero]: {
    srcSet: `${media("gen/hero-640.webp")} 640w, ${media("gen/hero-960.webp")} 960w`,
    sizes: "100vw",
  },
  [images.heroWide]: {
    srcSet: `${media("gen/hero-wide-640.webp")} 640w, ${media("gen/hero-wide-960.webp")} 960w, ${media("gen/hero-wide-1280.webp")} 1280w`,
    sizes: "100vw",
  },
  [images.about]: {
    srcSet: `${media("gen/about-640.webp")} 640w, ${media("gen/about-960.webp")} 960w`,
    sizes: "(min-width: 1100px) 62vw, 100vw",
  },
  [images.capAntennas]: {
    srcSet: `${media("gen/cap-antennas-640.webp")} 640w, ${media("gen/cap-antennas-960.webp")} 960w`,
    sizes: "(min-width: 1100px) 68vw, 100vw",
  },
  [images.capBroadcast]: {
    srcSet: `${media("gen/cap-broadcast-640.webp")} 640w, ${media("gen/cap-broadcast-960.webp")} 960w, ${media("gen/cap-broadcast-1280.webp")} 1280w`,
    sizes: "(min-width: 1100px) 68vw, 100vw",
  },
  [images.capCritical]: {
    srcSet: `${media("gen/cap-critical-640.webp")} 640w, ${media("gen/cap-critical-960.webp")} 960w, ${media("gen/cap-critical-1280.webp")} 1280w`,
    sizes: "(min-width: 1100px) 68vw, 100vw",
  },
  [images.capRf]: {
    srcSet: `${media("gen/cap-rf-640.webp")} 640w, ${media("gen/cap-rf-960.webp")} 960w`,
    sizes: "(min-width: 1100px) 68vw, 100vw",
  },
  [images.capTransmission]: {
    srcSet: `${media("gen/cap-transmission-640.webp")} 640w, ${media("gen/cap-transmission-960.webp")} 960w`,
    sizes: "(min-width: 1100px) 68vw, 100vw",
  },
  [images.projAm]: {
    srcSet: `${media("gen/proj-am-640.webp")} 640w, ${media("gen/proj-am-960.webp")} 960w`,
    sizes: "(min-width: 1100px) 58vw, 100vw",
  },
  [images.projStl]: {
    srcSet: `${media("gen/proj-stl-640.webp")} 640w, ${media("gen/proj-stl-960.webp")} 960w, ${media("gen/proj-stl-1280.webp")} 1280w`,
    sizes: "(min-width: 1100px) 62vw, 100vw",
  },
};

export const posters = {
  sm: media("gen/poster-640.webp"),
  md: media("gen/poster-960.webp"),
  lg: media("gen/poster-1280.webp"),
};

/**
 * Forma que espera el catálogo auditado (`image: img.projAm.sm`).
 * El string apunta al archivo real, no a un import de bundler.
 */
export const img = {
  about: { sm: images.about, md: images.about },
  capAntennas: { sm: images.capAntennas, md: images.capAntennas },
  capBroadcast: { sm: images.capBroadcast, md: images.capBroadcast },
  capCritical: { sm: images.capCritical, md: images.capCritical },
  capRf: { sm: images.capRf, md: images.capRf },
  capTransmission: { sm: images.capTransmission, md: images.capTransmission },
  heroWide: { sm: images.heroWide, md: images.heroWide },
  projAm: { sm: images.projAm, md: images.projAm },
  projStl: { sm: images.projStl, md: images.projStl },
};
