import { FormEvent } from "react";
import { Link } from "react-router-dom";
import { company, whatsappHref } from "@/data/company";
import { useI18n } from "@/i18n/context";
import { SignalCanvas } from "@/components/motion/SignalCanvas";

export function Contact() {
  const { ui, lang, path } = useI18n();
  const copy = ui.contact;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = lang === "es" ? "Consulta técnica — Sender" : "Technical enquiry — Sender";
    const body = [
      `${copy.name}: ${String(data.get("name") ?? "")}`,
      `${copy.company}: ${String(data.get("company") ?? "")}`,
      `${copy.emailField}: ${String(data.get("email") ?? "")}`,
      `${copy.type}: ${String(data.get("type") ?? "")}`,
      "",
      String(data.get("message") ?? ""),
    ].join("\n");
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contacto" className="contact" data-theme="dark" aria-labelledby="contact-title">
      <SignalCanvas className="contact-canvas" variant="contact" progress={0.85} />
      <div className="contact-grid">
        <div>
          <p className="kicker">
            <span>{copy.index}</span>
            {copy.kicker}
          </p>
          <h2 id="contact-title">{copy.title}</h2>
          <p className="lede">{copy.sub}</p>
          <address>
            <div>
              <strong>{copy.address}</strong>
              <a href={company.mapsHref}>{company.addressOneLine[lang]}</a>
            </div>
            <div>
              <strong>{copy.phone}</strong>
              <a href={company.phoneHref}>{company.phone}</a>
            </div>
            <div>
              <strong>{copy.email}</strong>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </div>
            <div>
              <strong>{copy.sales}</strong>
              <a href={`mailto:${company.salesEmail}`}>{company.salesEmail}</a>
            </div>
          </address>
          <div className="actions">
            <a className="btn" href={whatsappHref(lang)}>
              {copy.whatsapp}
            </a>
            <a className="btn btn-ghost" href={company.mapsHref}>
              {copy.map}
            </a>
            <Link className="btn btn-ghost" to={path("/productos")}>
              {copy.products}
            </Link>
          </div>
        </div>
        <form className="form" onSubmit={onSubmit}>
          <p className="mono">{copy.formTitle}</p>
          <label>
            {copy.name}
            <input name="name" autoComplete="name" required />
          </label>
          <label>
            {copy.company}
            <input name="company" autoComplete="organization" />
          </label>
          <label>
            {copy.emailField}
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            {copy.type}
            <select name="type" defaultValue={copy.types[0]}>
              {copy.types.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            {copy.message}
            <textarea name="message" required />
          </label>
          <button type="submit">{copy.submit}</button>
          <p className="note">{copy.note}</p>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  const { ui, path } = useI18n();
  const links = [
    [ui.nav.inicio, "/#inicio"],
    [ui.nav.nosotros, "/#nosotros"],
    [ui.nav.ingenieria, "/#ingenieria"],
    [ui.nav.productos, "/productos"],
    [ui.nav.proyectos, "/#proyectos"],
    [ui.nav.contacto, "/#contacto"],
  ] as const;
  return (
    <footer className="footer">
      <p className="footer-mark">SENDER</p>
      <p className="mono">{ui.footer.concept}</p>
      <p>{ui.footer.claim}</p>
      <nav aria-label={ui.footer.nav}>
        {links.map(([label, href]) => (
          <a key={href} href={path(href)}>
            {label}
          </a>
        ))}
      </nav>
      <div className="footer-legal">
        <span>{ui.footer.legal}</span>
        <a href="#inicio">{ui.footer.back}</a>
      </div>
    </footer>
  );
}
