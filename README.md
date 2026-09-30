import { Component, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { I18nProvider } from "@/i18n/context";
import { Nav } from "@/components/navigation/Nav";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/sections/Contact/Contact";
import { Seo } from "@/seo/Seo";
import { Home } from "@/pages/Home";
import { CatalogPage, CategoryPage, NotFoundPage, ProductPage } from "@/pages/CatalogPages";
import { useI18n } from "@/i18n/context";

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <main id="main" className="page">
          <h1 className="page-title">La página no pudo completar esta vista.</h1>
          <p className="lede">Recarga el sitio. El contenido sigue disponible en las otras secciones.</p>
          <button type="button" className="btn" onClick={() => window.location.reload()}>
            Recargar
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}

function Skip() {
  const { ui } = useI18n();
  return (
    <a className="skip" href="#main">
      {ui.a11y.skip}
    </a>
  );
}

function Shell() {
  return (
    <>
      <Seo />
      <SmoothScroll />
      <Skip />
      <Nav />
      <Boundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/en" element={<Home />} />
        <Route path="/productos" element={<CatalogPage />} />
        <Route path="/en/productos" element={<CatalogPage />} />
        <Route path="/productos/:slug" element={<CategoryPage />} />
        <Route path="/en/productos/:slug" element={<CategoryPage />} />
        <Route path="/producto/:slug" element={<ProductPage />} />
        <Route path="/en/producto/:slug" element={<ProductPage />} />
        <Route path="/soluciones" element={<Navigate to="/productos" replace />} />
        <Route path="/en/soluciones" element={<Navigate to="/en/productos" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Boundary>
      <Footer />
    </>
  );
}

export function App() {
  return (
    <I18nProvider>
      <Shell />
    </I18nProvider>
  );
}
