import { Link, useParams } from "react-router-dom";
import { categories, products } from "@/data/catalog";
import { company, whatsappHref } from "@/data/company";
import { tx } from "@/data/types";
import { useI18n } from "@/i18n/context";
import { EditorialImage } from "@/components/immersive/Images";

export function CatalogPage() {
  const { ui, lang, path } = useI18n();
  return (
    <main id="main" className="page">
      <p className="kicker">{ui.catalog.kicker}</p>
      <h1 className="page-title">{ui.catalog.title}</h1>
      <p className="lede">{ui.catalog.intro}</p>
      <div>
        {categories.map((category) => (
          <Link key={category.id} className="station" to={path(`/productos/${category.slug}`)}>
            <span className="mono">{tx(category.index, lang)}</span>
            <h2>{tx(category.name, lang)}</h2>
            <p>{tx(category.description, lang)}</p>
            <span className="mono">
              {category.productSlugs.length} · {ui.catalog.view}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}

export function CategoryPage() {
  const { slug = "" } = useParams();
  const { ui, lang, path } = useI18n();
  const category = categories.find((item) => item.slug === slug);
  if (!category) {
    return (
      <main id="main" className="page">
        <h1>{ui.product.notFound}</h1>
        <Link to={path("/productos")}>{ui.category.back}</Link>
      </main>
    );
  }
  const items = products.filter((item) => item.categoryId === category.id);
  return (
    <main id="main" className="page">
      <Link className="crumb" to={path("/productos")}>
        {ui.category.back}
      </Link>
      <p className="kicker">
        {tx(category.index, lang)} · {tx(category.kicker, lang)}
      </p>
      <h1 className="page-title">{tx(category.name, lang)}</h1>
      <p className="lede">{tx(category.description, lang)}</p>
      <EditorialImage src={category.image} alt={tx(category.alt, lang)} />
      <ul className="feature-list">
        {category.scope.map((item) => (
          <li key={tx(item, lang)}>{tx(item, lang)}</li>
        ))}
      </ul>
      <h2>{ui.category.products}</h2>
      <div className="catalog-index">
        {items.map((item) => (
          <Link key={item.slug} to={path(`/producto/${item.slug}`)}>
            <span className="mono">{tx(item.index, lang)}</span>
            <span>{tx(item.name, lang)}</span>
            <span className="mono">{ui.products.view}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

export function ProductPage() {
  const { slug = "" } = useParams();
  const { ui, lang, path } = useI18n();
  const product = products.find((item) => item.slug === slug);
  if (!product) {
    return (
      <main id="main" className="page">
        <h1>{ui.product.notFound}</h1>
        <Link to={path("/productos")}>{ui.catalog.kicker}</Link>
      </main>
    );
  }
  const category = categories.find((item) => item.id === product.categoryId);
  const related = products.filter((item) => item.categoryId === product.categoryId && item.slug !== product.slug);
  const subject = encodeURIComponent(tx(product.name, lang));
  return (
    <main id="main" className="page">
      <Link className="crumb" to={path(category ? `/productos/${category.slug}` : "/productos")}>
        {ui.product.back}
        {category ? ` · ${tx(category.name, lang)}` : ""}
      </Link>
      <article className="product-hero">
        <EditorialImage src={product.image} alt={tx(product.alt, lang)} priority />
        <div>
          <p className="mono">{tx(product.index, lang)}</p>
          <h1>{tx(product.name, lang)}</h1>
          <p>{tx(product.summary, lang)}</p>
          <div className="actions">
            <a className="btn" href={`mailto:${company.email}?subject=${subject}`}>
              {ui.product.consult}
            </a>
            <a className="btn btn-ghost" href={whatsappHref(lang, tx(product.name, lang))}>
              {ui.product.quote}
            </a>
          </div>
        </div>
      </article>

      <h2>{ui.product.overview}</h2>
      <ul className="feature-list">
        {product.features.map((item) => (
          <li key={tx(item, lang)}>{tx(item, lang)}</li>
        ))}
      </ul>

      <h2>{ui.product.specs}</h2>
      {product.specs.map((group) => (
        <table className="specs" key={tx(group.title, lang)}>
          <caption className="mono">{tx(group.title, lang)}</caption>
          <tbody>
            {group.rows.map((row) => (
              <tr key={tx(row.k, lang)}>
                <th scope="row">{tx(row.k, lang)}</th>
                <td>{tx(row.v, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}

      <h2>{ui.product.applications}</h2>
      <ul className="feature-list">
        {product.applications.map((item) => (
          <li key={tx(item, lang)}>{tx(item, lang)}</li>
        ))}
      </ul>

      {product.variants?.length ? (
        <>
          <h2>{ui.product.variants}</h2>
          <ul className="feature-list">
            {product.variants.map((variant) => (
              <li key={tx(variant.model, lang)}>
                <strong>
                  {tx(variant.model, lang)} · {tx(variant.power, lang)}
                </strong>
                <p>{tx(variant.detail, lang)}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <p className="note">{ui.product.docs}</p>
      {product.sourceUrl ? (
        <p>
          <a href={product.sourceUrl} rel="noreferrer">
            {ui.product.source}
          </a>
        </p>
      ) : null}

      {related.length ? (
        <>
          <h2>{ui.product.related}</h2>
          <div className="catalog-index">
            {related.map((item) => (
              <Link key={item.slug} to={path(`/producto/${item.slug}`)}>
                <span className="mono">{tx(item.index, lang)}</span>
                <span>{tx(item.name, lang)}</span>
                <span className="mono">{ui.products.view}</span>
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </main>
  );
}

export function NotFoundPage() {
  const { ui, path } = useI18n();
  return (
    <main id="main" className="page">
      <p className="kicker">404</p>
      <h1 className="page-title">{ui.notFound.title}</h1>
      <p className="lede">{ui.notFound.body}</p>
      <p>
        <Link className="text-link" to={path("/")}>
          {ui.notFound.home}
        </Link>
      </p>
    </main>
  );
}
