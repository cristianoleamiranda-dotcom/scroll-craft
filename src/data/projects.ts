import type { Project } from "@/data/types";
import { images } from "@/data/images";

/**
 * Solo instalaciones publicadas por Sender o cubiertas por prensa especializada.
 * Sin años, sin cifras de proyectos, sin clientes no documentados.
 */
export const projects: Project[] = [
  {
    id: "radio-colosal-ambato",
    index: "01",
    name: {
      es: "Transmisor Sender en Radio Colosal, Ambato",
      en: "Sender transmitter at Radio Colosal, Ambato",
    },
    category: { es: "Radiodifusión", en: "Broadcasting" },
    location: { es: "Ambato", en: "Ambato" },
    technology: {
      es: "Transmisor de radiodifusión · Instalación y puesta en marcha",
      en: "Broadcast transmitter · Installation and commissioning",
    },
    summary: {
      es: "Instalación de un transmisor Sender en Radio Colosal de Ambato, documentada por la prensa especializada internacional del sector de radiodifusión.",
      en: "Installation of a Sender transmitter at Radio Colosal in Ambato, documented by international trade press covering the broadcasting sector.",
    },
    image: images.capBroadcast,
    alt: {
      es: "Sala de transmisión con racks de equipos de radiodifusión",
      en: "Transmission hall with broadcast equipment racks",
    },
    source: {
      label: { es: "Radio World", en: "Radio World" },
      url: "https://www.radioworld.com/global/radio-colosal-installs-sender-transmitter-in-ambato",
    },
  },
  {
    id: "torre-armada-playa-ancha",
    index: "02",
    name: {
      es: "Torre autosoportada de 60 m · Armada de Chile",
      en: "60 m self-supporting tower · Chilean Navy",
    },
    category: { es: "Infraestructura", en: "Infrastructure" },
    location: { es: "Playa Ancha, Valparaíso", en: "Playa Ancha, Valparaíso" },
    technology: {
      es: "Ingeniería y montaje de infraestructura de telecomunicaciones",
      en: "Telecommunications infrastructure engineering and assembly",
    },
    summary: {
      es: "Proyecto de telecomunicaciones de alta complejidad: desmontaje de una torre autosoportada de 60 metros para la Armada de Chile.",
      en: "High-complexity telecommunications project: dismantling of a 60-metre self-supporting tower for the Chilean Navy.",
    },
    image: images.capAntennas,
    alt: {
      es: "Torre de telecomunicaciones con arreglo de antenas",
      en: "Telecommunications tower with antenna array",
    },
  },
  {
    id: "hf-isla-de-pascua",
    index: "03",
    name: {
      es: "Comunicaciones HF de largo alcance · Isla de Pascua",
      en: "Long-range HF communications · Easter Island",
    },
    category: { es: "HF", en: "HF" },
    location: { es: "Isla de Pascua", en: "Easter Island" },
    technology: {
      es: "Solución HF de largo alcance · Instalación y operación",
      en: "Long-range HF solution · Installation and operation",
    },
    summary: {
      es: "Solución de comunicaciones HF de largo alcance para entornos estratégicos, con instalación y operación en Isla de Pascua.",
      en: "Long-range HF communications solution for strategic environments, installed and operated on Easter Island.",
    },
    image: images.hero,
    alt: {
      es: "Torre contraventada y caseta de transmisión en un sitio costero",
      en: "Guyed tower and transmitter shelter on a coastal site",
    },
  },
  {
    id: "antena-mf-navtex",
    index: "04",
    name: {
      es: "Antena MF para sistema NAVTEX 490 / 518 kHz",
      en: "MF antenna for NAVTEX system 490 / 518 kHz",
    },
    category: { es: "NAVTEX", en: "NAVTEX" },
    location: { es: "Entornos marítimos", en: "Maritime environments" },
    technology: {
      es: "Transmisión MF · Sistema radiante · Automatización",
      en: "MF transmission · Radiating system · Automation",
    },
    summary: {
      es: "Soluciones de transmisión MF para sistemas NAVTEX, diseñadas para operación confiable en entornos marítimos y de defensa, con antena y torre específicas para 490 kHz y 518 kHz.",
      en: "MF transmission solutions for NAVTEX systems, designed for reliable operation in maritime and defense environments, with an antenna and tower specific to 490 kHz and 518 kHz.",
    },
    image: images.capCritical,
    alt: {
      es: "Estación costera de radio con mástil monopolo entre la niebla marina",
      en: "Coastal radio station with monopole mast in sea fog",
    },
  },
  {
    id: "antenas-hf-defensa",
    index: "05",
    name: {
      es: "Antenas HF de alto rendimiento",
      en: "High-performance HF antennas",
    },
    category: { es: "HF", en: "HF" },
    location: { es: "Chile y proyectos internacionales", en: "Chile and international projects" },
    technology: {
      es: "Antenas HF 2 – 30 MHz · 1 kW · Servicio continuo",
      en: "HF antennas 2 – 30 MHz · 1 kW · Continuous duty",
    },
    summary: {
      es: "Soluciones en antenas HF de alta eficiencia para comunicaciones profesionales, con instalación en proyectos de defensa y radiodifusión.",
      en: "High-efficiency HF antenna solutions for professional communications, installed in defense and broadcasting projects.",
    },
    image: images.capRf,
    alt: {
      es: "Módulo amplificador de radiofrecuencia con bobinas de cobre",
      en: "Radio-frequency amplifier module with copper coils",
    },
  },
  {
    id: "stl-enlaces",
    index: "06",
    name: {
      es: "Enlaces estudio–planta AM / FM",
      en: "AM / FM studio–transmitter links",
    },
    category: { es: "STL", en: "STL" },
    location: { es: "Radiodifusión profesional", en: "Professional broadcasting" },
    technology: {
      es: "STAL-200 · AL-100 · Yagi 134 – 174 MHz · Hasta 10 W",
      en: "STAL-200 · AL-100 · Yagi 134 – 174 MHz · Up to 10 W",
    },
    summary: {
      es: "Enlaces estudio–planta con encendido remoto del transmisor, operación Mono/MPX y antenas Yagi de aluminio 6162 para operación continua en ambientes exigentes.",
      en: "Studio–transmitter links with remote transmitter start, Mono/MPX operation and 6162 aluminium Yagi antennas for continuous operation in demanding environments.",
    },
    image: images.projStl,
    alt: {
      es: "Antena Yagi de enlace sobre azotea con vista a Santiago",
      en: "Yagi link antenna on a rooftop overlooking Santiago",
    },
  },
];
