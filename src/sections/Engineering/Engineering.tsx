import { useEffect, useState } from "react";
import { engineeringStates, transmissionChain } from "@/data/engineering";
import { tx } from "@/data/types";
import { useI18n } from "@/i18n/context";
import { EditorialImage } from "@/components/immersive/Images";
import { drawEngineeringDiagram } from "@/three/scenes/EngineeringScene";

export function Engineering() {
  const { ui, lang } = useI18n();
  const [active, setActive] = useState(0);
  const copy = ui.engineering;

  useEffect(() => {
    const canvas = document.querySelector<HTMLCanvasElement>("[data-eng-draw]");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth || 320;
      const height = canvas.clientHeight || 92;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawEngineeringDiagram(ctx, width, height, active, tx(engineeringStates[active].range, lang));
    };
    paint();
    window.addEventListener("resize", paint);
    return () => window.removeEventListener("resize", paint);
  }, [active, lang]);

  useEffect(() => {
    const section = document.querySelector("[data-eng]");
    if (!section) return;
    const desktop = window.matchMedia("(min-width: 1100px)");
    if (!desktop.matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const total = section.clientHeight - window.innerHeight;
        const p = total <= 0 ? 0 : Math.min(0.999, Math.max(0, -rect.top / total));
        setActive(Math.min(engineeringStates.length - 1, Math.floor(p * engineeringStates.length)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section id="ingenieria" className="eng" aria-labelledby="eng-title" data-eng>
      <div className="eng-desktop">
        <div className="eng-pin">
          <div className="eng-index">
            <p className="kicker">
              <span>{copy.index}</span>
              {copy.kicker}
            </p>
            <h2 id="eng-title">{copy.title}</h2>
            <p>{copy.intro}</p>
            <ol>
              {engineeringStates.map((state, index) => (
                <li key={state.id}>
                  <button
                    type="button"
                    className={index === active ? "is-active" : ""}
                    aria-pressed={index === active}
                    onClick={() => setActive(index)}
                  >
                    {state.index} {state.code}
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="eng-stage">
            {engineeringStates.map((state, index) => (
              <article
                key={state.id}
                className={index === active ? "eng-panel is-active" : "eng-panel"}
                aria-hidden={index !== active}
              >
                <div className="eng-visual">
                  <EditorialImage src={state.image} alt={tx(state.alt, lang)} position="center" />
                  <canvas className="eng-diagram" data-eng-draw={index === active ? "1" : undefined} />
                </div>
                <div className="eng-copy">
                  <p className="eng-range">
                    {copy.stateLabel} {state.index} · {state.code} · {tx(state.range, lang)}
                  </p>
                  <h3>{tx(state.name, lang)}</h3>
                  <p>{tx(state.text, lang)}</p>
                  <p className="note">{tx(state.note, lang)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="eng-mobile scene">
        <p className="kicker">
          <span>{copy.index}</span>
          {copy.kicker}
        </p>
        <h2>{copy.title}</h2>
        <p className="lede">{copy.intro}</p>
        <div className="eng-flow">
          {engineeringStates.map((state) => (
            <article key={state.id}>
              <EditorialImage src={state.image} alt={tx(state.alt, lang)} />
              <div>
                <p className="eng-range">
                  {state.index} · {state.code} · {tx(state.range, lang)}
                </p>
                <h3>{tx(state.name, lang)}</h3>
                <p>{tx(state.text, lang)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Transmission() {
  const { ui, lang } = useI18n();
  const copy = ui.transmission;
  return (
    <section className="scene" aria-labelledby="tx-title" data-chain>
      <p className="kicker">
        <span>{copy.index}</span>
        {copy.kicker}
      </p>
      <h2 id="tx-title">{copy.title}</h2>
      <p className="lede">{copy.intro}</p>
      <ol className="chain">
        {transmissionChain.map((stage) => (
          <li key={stage.id}>
            <span className="mono">{stage.index}</span>
            <div>
              <strong>{tx(stage.title, lang)}</strong>
              <p>{tx(stage.text, lang)}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="chain-line" aria-hidden="true">
        <span data-chain-line />
      </div>
      <p className="note">{copy.note}</p>
    </section>
  );
}
