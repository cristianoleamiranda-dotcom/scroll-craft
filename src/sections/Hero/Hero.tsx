import { useEffect, useState } from "react";
import { images, posters } from "@/data/images";
import { company } from "@/data/company";
import { useI18n } from "@/i18n/context";
import { SignalCanvas } from "@/components/motion/SignalCanvas";
import { SignalField } from "@/three/components/SignalField";

export function Hero() {
  const { ui } = useI18n();
  const [progress, setProgress] = useState(0);
  const [videoOn, setVideoOn] = useState(false);

  useEffect(() => {
    const root = document.querySelector("[data-hero]");
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 1099px)").matches;
    let raf = 0;

    const measure = () => {
      const rect = root.getBoundingClientRect();
      const total = root.clientHeight - window.innerHeight;
      const p = total <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / total));
      setProgress(p);
      const photo = root.querySelector<HTMLElement>("[data-hero-photo]");
      if (photo && !reduced) {
        const inset = 46 * (1 - p);
        const side = 6 * (1 - p);
        photo.style.clipPath = `inset(${inset}% ${side}% ${inset}% ${side}%)`;
        photo.style.transform = `scale(${1.08 - p * 0.08})`;
      }
      if (!reduced && !narrow && p > 0.42) setVideoOn(true);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="inicio" className="hero" data-theme="dark" data-hero>
      <div className="hero-pin">
        <img
          data-hero-photo
          className="hero-photo"
          src={images.hero}
          srcSet={`${posters.sm} 640w, ${posters.md} 960w, ${posters.lg} 1280w`}
          sizes="100vw"
          alt={ui.meta.ogAlt}
          fetchPriority="high"
          decoding="async"
        />
        {videoOn ? (
          <video
            className="hero-video is-on"
            poster={posters.lg}
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
            aria-label={ui.hero.videoLabel}
          >
            <source src={images.heroVideo} type="video/mp4" />
          </video>
        ) : null}
        <SignalCanvas className="hero-canvas" variant="hero" progress={progress} />
        <SignalField className="hero-gl" mode="hero" progress={progress} active />
        <div className="hero-veil" />
        <div className="hero-copy">
          <p className="hero-disciplines">
            {ui.hero.disciplines.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </p>
          <h1>
            <span className="wordmark">SENDER</span>
            <span className="hero-lines">
              {ui.hero.lineA}
              <br />
              {ui.hero.lineB}
            </span>
          </h1>
          <p className="hero-place">{ui.hero.place}</p>
          <div className="hero-foot">
            <span>
              {company.address.commune} · {company.address.city}
            </span>
            <span className="scroll-cue">
              {ui.hero.scroll}
              <i />
            </span>
            <span>AM · FM · HF · NAVTEX</span>
            <span>20+</span>
          </div>
        </div>
      </div>
    </section>
  );
}
