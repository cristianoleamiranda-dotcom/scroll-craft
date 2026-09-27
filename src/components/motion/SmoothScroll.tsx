import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Lenis smooth scroll + GSAP ticker. Disabled when the user prefers reduced motion. */
export function SmoothScroll() {
  const location = useLocation();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let alive = true;
    let destroy = () => {};

    void (async () => {
      try {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (!alive) return;
      if (typeof Lenis !== "function") return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      const ctx = gsap.context(() => {
        const line = document.querySelector<HTMLElement>("[data-chain-line]");
        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "left center",
              ease: "none",
              scrollTrigger: {
                trigger: "[data-chain]",
                start: "top 70%",
                end: "bottom 60%",
                scrub: 0.6,
              },
            },
          );
        }
      });

      destroy = () => {
        ctx.revert();
        gsap.ticker.remove(ticker);
        lenis.destroy();
      };
      } catch (error) {
        console.warn("Scroll suave no disponible.", error);
      }
    })();

    return () => {
      alive = false;
      destroy();
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return null;
}
