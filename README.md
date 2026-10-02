import { Component, type ReactNode } from "react"; import { Navigate, Route, Routes } from "react-router-dom"; import { I18nProvider } from "@/i18n/context"; import { Nav } from "@/components/navigation/Nav"; import { SmoothScroll } from "@/components/motion/SmoothScroll"; import { Footer } from "@/sections/Contact/Contact"; import { Seo } from "@/seo/Seo"; import { Home } from "@/pages/Home"; import { CatalogPage, CategoryPage, NotFoundPage, ProductPage } from "@/pages/CatalogPages"; import { useI18n } from "@/i18n/context";

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> { state = { failed: false }; static getDerivedStateFromError() { return { failed: true }; } render() { if (this.state.failed) { return (

La página no pudo completar esta vista.
Recarga el sitio. El contenido sigue disponible en las otras secciones.

<button type="button" className="btn" onClick={() => window.location.reload()}> Recargar ); } return this.props.children; } }
function Skip() { const { ui } = useI18n(); return ( {ui.a11y.skip} ); }

function Shell() { return ( <>

<Route path="/" element={} /> <Route path="/en" element={} /> <Route path="/productos" element={} /> <Route path="/en/productos" element={} /> <Route path="/productos/:slug" element={} /> <Route path="/en/productos/:slug" element={} /> <Route path="/producto/:slug" element={} /> <Route path="/en/producto/:slug" element={} /> <Route path="/soluciones" element={} /> <Route path="/en/soluciones" element={} /> <Route path="*" element={} /> </> ); }
export function App() { return ( ); }