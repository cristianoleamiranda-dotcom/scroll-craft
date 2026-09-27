import { images } from "@/data/images";
import { useI18n } from "@/i18n/context";
import { DepthImage } from "@/components/immersive/Images";

export function About() {
  const { ui } = useI18n();
  const copy = ui.about;
  return (
    <section id="nosotros" className="scene" aria-labelledby="about-title">
      <div className="about-grid">
        <div>
          <p className="kicker">
            <span>{copy.index}</span>
            {copy.kicker}
          </p>
          <h2 id="about-title">{copy.title}</h2>
          <p className="lede">{copy.lead}</p>
          <div className="prose">
            {copy.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p>
            <strong>{copy.missionLabel}. </strong>
            {copy.mission}
          </p>
          <dl className="facts">
            {copy.facts.map((fact) => (
              <div key={fact.k}>
                <dt>{fact.k}</dt>
                <dd>{fact.v}</dd>
              </div>
            ))}
          </dl>
          <p className="note">{copy.note}</p>
        </div>
        <DepthImage src={images.about} alt={ui.about.fig.replace("Fig. 02 — ", "")} caption={copy.fig} />
      </div>
    </section>
  );
}
