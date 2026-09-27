import { Link } from "react-router-dom";
import { categories, products } from "@/data/catalog";
import { tx } from "@/data/types";
import { useI18n } from "@/i18n/context";
import { EditorialImage } from "@/components/immersive/Images";

const FEATURED = ["serie-sender-ss", "serie-fm", "antena-hf-2-30", "sistema-navtex-490-518"];

export function Products() {
  const { ui, lang, path } = useI18n();
  const copy = ui.products;
  const featured = FEATURED.map((slug) => products.find((item) => item.slug === slug)).filter((item) => item != null);

  return (
    <section id="productos" className="scene" aria-labelledby="products-title">
      <p className="kicker">
        <span>{copy.index}</span>
        {copy.kicker}
      </p>
      <h2 id="products-title">{copy.title}</h2>
      <p className="lede">{copy.intro}</p>

      <div>
        {featured.map((product) => {
          const spec = product.specs[0]?.rows.slice(0, 4) ?? [];
          return (
            <article key={product.slug} className="object">
              <div className="object-visual">
                <EditorialImage src={product.image} alt={tx(product.alt, lang)} />
              </div>
              <div>
                <p className="object-meta">
                  <span>{tx(product.index, lang)}</span>
                  <span>{categories.find((item) => item.id === product.categoryId)?.name[lang]}</span>
                </p>
                <h3>{tx(product.name, lang)}</h3>
                <p>{tx(product.summary, lang)}</p>
                <dl className="spec-row">
                  {spec.map((row) => (
                    <div key={tx(row.k, lang)}>
                      <dt>{tx(row.k, lang)}</dt>
                      <dd>{tx(row.v, lang)}</dd>
                    </div>
                  ))}
                </dl>
                <Link className="text-link" to={path(`/producto/${product.slug}`)}>
                  {copy.view}
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="catalog-index" aria-label={copy.catalog}>
        <p className="kicker">{copy.catalog}</p>
        {products.map((product) => (
          <Link key={product.slug} to={path(`/producto/${product.slug}`)}>
            <span className="mono">{tx(product.index, lang)}</span>
            <span className="ci-name">{tx(product.name, lang)}</span>
            <span className="mono">{categories.find((item) => item.id === product.categoryId)?.index[lang]}</span>
          </Link>
        ))}
        <Link className="text-link" to={path("/productos")}>
          {copy.all}
        </Link>
      </div>
    </section>
  );
}
