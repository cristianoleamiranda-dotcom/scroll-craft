import { useRef, useState } from "react";
import { projects } from "@/data/projects";
import { tx, type Project } from "@/data/types";
import { useI18n } from "@/i18n/context";
import { EditorialImage } from "@/components/immersive/Images";

export function Projects() {
  const { ui, lang } = useI18n();
  const copy = ui.projects;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<Project | null>(null);

  const show = (project: Project) => {
    setOpen(project);
    dialogRef.current?.showModal();
    document.body.classList.add("is-modal");
  };

  const close = () => {
    dialogRef.current?.close();
    setOpen(null);
    document.body.classList.remove("is-modal");
  };

  return (
    <section id="proyectos" className="archive" data-theme="dark" aria-labelledby="projects-title">
      <div className="archive-intro">
        <p className="kicker">
          <span>{copy.index}</span>
          {copy.kicker}
        </p>
        <h2 id="projects-title">{copy.title}</h2>
        <p className="lede">{copy.intro}</p>
      </div>
      {projects.map((project) => (
        <article key={project.id} className="project-spread">
          <div className="project-visual">
            <EditorialImage src={project.image} alt={tx(project.alt, lang)} />
          </div>
          <div className="project-copy">
            <p className="mono">
              {copy.fig} {project.index} · {tx(project.category, lang)}
            </p>
            <h3>{tx(project.name, lang)}</h3>
            <p>{tx(project.summary, lang)}</p>
            <p className="mono">
              {tx(project.location, lang)} · {tx(project.technology, lang)}
            </p>
            <button type="button" className="open" onClick={() => show(project)}>
              {copy.open}
            </button>
          </div>
        </article>
      ))}

      <dialog ref={dialogRef} className="project-dialog" aria-labelledby="project-dialog-title" onClose={close}>
        {open ? (
          <div className="project-scene">
            <EditorialImage src={open.image} alt={tx(open.alt, lang)} priority />
            <div className="sheet">
              <button type="button" className="close-x" onClick={close}>
                {copy.close}
              </button>
              <p className="mono">
                {copy.fig} {open.index} · {tx(open.category, lang)} · {tx(open.location, lang)}
              </p>
              <h3 id="project-dialog-title">{tx(open.name, lang)}</h3>
              <p>{tx(open.summary, lang)}</p>
              <p className="mono">{tx(open.technology, lang)}</p>
              {open.source ? (
                <p>
                  <a href={open.source.url} rel="noreferrer">
                    {copy.source}: {tx(open.source.label, lang)}
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
