import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { stripLang, useI18n } from "@/i18n/context";

const LINKS = [
  { id: "inicio", hash: "#inicio", bare: "/" },
  { id: "nosotros", hash: "#nosotros", bare: "/#nosotros" },
  { id: "ingenieria", hash: "#ingenieria", bare: "/#ingenieria" },
  { id: "productos", hash: "#productos", bare: "/#productos" },
  { id: "proyectos", hash: "#proyectos", bare: "/#proyectos" },
  { id: "contacto", hash: "#contacto", bare: "/#contacto" },
] as const;

export function Nav() {
  const { ui, lang, path, switchTo } = useI18n();
  const labels = [ui.nav.inicio, ui.nav.nosotros, ui.nav.ingenieria, ui.nav.productos, ui.nav.proyectos, ui.nav.contacto];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const location = useLocation();
  const onHome = stripLang(location.pathname) === "/";
  const [overDark, setOverDark] = useState(onHome);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const read = () => {
      setOverDark(Boolean(document.querySelector("[data-theme='dark'].is-in")));
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    const timer = window.setInterval(read, 400);
    return () => {
      window.removeEventListener("scroll", read);
      window.clearInterval(timer);
    };
  }, [location.pathname]);

  const close = () => {
    dialogRef.current?.close();
    setOpen(false);
  };

  return (
    <header className={overDark ? "nav" : "nav is-light"} data-theme-nav>
      <a className="nav-mark" href={path("/#inicio")}>
        SENDER
      </a>
      <nav className="nav-links" aria-label={ui.a11y.nav}>
        {LINKS.map((link, index) => (
          <a key={link.id} href={path(link.bare)}>
            {String(index + 1).padStart(2, "0")} {labels[index]}
          </a>
        ))}
      </nav>
      <div className="nav-tools">
        <button
          type="button"
          className="index-btn"
          aria-expanded={open}
          aria-controls="site-index"
          onClick={() => {
            dialogRef.current?.showModal();
            setOpen(true);
          }}
        >
          {ui.nav.index}
        </button>
        <div className="lang-switch" role="group" aria-label={ui.a11y.language}>
          <button type="button" aria-pressed={lang === "es"} onClick={() => switchTo("es")}>
            ES
          </button>
          <button type="button" aria-pressed={lang === "en"} onClick={() => switchTo("en")}>
            EN
          </button>
        </div>
      </div>
      <dialog
        ref={dialogRef}
        id="site-index"
        className="index-dialog"
        aria-label={ui.nav.index}
        onClose={() => setOpen(false)}
      >
        <div className="index-sheet">
          <button type="button" className="close-x" onClick={close}>
            {ui.a11y.closeIndex}
          </button>
          <ol>
            {LINKS.map((link, index) => (
              <li key={link.id}>
                <a href={path(link.bare)} onClick={close}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {labels[index]}
                </a>
              </li>
            ))}
          </ol>
          <NavLink to={path("/productos")} onClick={close} className="text-link">
            {ui.products.all}
          </NavLink>
        </div>
      </dialog>
    </header>
  );
}
