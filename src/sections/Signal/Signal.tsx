import { useI18n } from "@/i18n/context";
import { SignalCanvas } from "@/components/motion/SignalCanvas";

export function Signal() {
  const { ui } = useI18n();
  const copy = ui.signal;
  return (
    <section id="senal" className="scene" aria-labelledby="signal-title">
      <div className="signal-layout">
        <div>
          <p className="kicker">
            <span>{copy.index}</span>
            {copy.kicker}
          </p>
          <h2 id="signal-title">{copy.title}</h2>
          <p className="lede">{copy.lead}</p>
          <div className="prose">
            {copy.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div>
          <SignalCanvas className="signal-wave" variant="wave" progress={1} />
          <ol className="signal-stages">
            {copy.stages.map((stage, index) => (
              <li key={stage.name}>
                <span className="mono">{String.fromCharCode(65 + index)}</span>
                <strong>{stage.name}</strong>
                <span>{stage.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
