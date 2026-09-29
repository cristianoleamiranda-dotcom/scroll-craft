import type { Loc } from "@/data/types";
import { images } from "@/data/images";

export interface EngineeringState {
  id: string;
  index: string;
  code: string;
  name: Loc;
  range: Loc;
  text: Loc;
  note: Loc;
  image: string;
  alt: Loc;
}

/**
 * Capacidades confirmadas en el catálogo y en sender.cl.
 * Los rótulos de frecuencia son rangos publicados, no mediciones de una instalación.
 */
export const engineeringStates: EngineeringState[] = [
  {
    id: "rf",
    index: "01",
    code: "RF",
    name: { es: "Ingeniería RF", en: "RF engineering" },
    range: { es: "Sistemas radiantes · Acoplamiento", en: "Radiating systems · Matching" },
    text: {
      es: "Ingeniería de radiofrecuencia: sistemas radiantes, antenas, acoplamiento, amplificación y componentes de alta potencia.",
      en: "Radio-frequency engineering: radiating systems, antennas, matching, amplification and high-power components.",
    },
    note: {
      es: "Cálculo de sistemas radiantes, acoplamiento y protecciones.",
      en: "Radiating-system calculation, matching and protections.",
    },
    image: images.capRf,
    alt: {
      es: "Módulo amplificador RF de estado sólido con transistores y bobinas de cobre",
      en: "Solid-state RF amplifier module with transistors and copper coils",
    },
  },
  {
    id: "broadcast",
    index: "02",
    code: "BC",
    name: { es: "Radiodifusión", en: "Broadcasting" },
    range: { es: "AM 490 – 1700 kHz · FM 87.5 – 108 MHz", en: "AM 490 – 1700 kHz · FM 87.5 – 108 MHz" },
    text: {
      es: "Transmisores AM y FM de estado sólido, procesamiento de audio y enlaces estudio–planta para radiodifusión profesional.",
      en: "Solid-state AM and FM transmitters, audio processing and studio–transmitter links for professional broadcasting.",
    },
    note: {
      es: "Operación continua 24/7. Arquitectura modular Clase D y PLL digital.",
      en: "Continuous 24/7 operation. Modular Class D architecture and digital PLL.",
    },
    image: images.capBroadcast,
    alt: {
      es: "Sala de transmisión con racks de equipos de radiodifusión",
      en: "Transmission hall with broadcast equipment racks",
    },
  },
  {
    id: "transmission",
    index: "03",
    code: "TX",
    name: { es: "Transmisión", en: "Transmission" },
    range: { es: "Estudio → antena", en: "Studio → antenna" },
    text: {
      es: "Un sistema de transmisión es una cadena. Sender participa desde el estudio hasta el sistema radiante: procesamiento, amplificación, enlace y antena.",
      en: "A transmission system is a chain. Sender takes part from the studio to the radiating system: processing, amplification, link and antenna.",
    },
    note: {
      es: "Diseño, fabricación, implementación y soporte.",
      en: "Design, manufacture, deployment and support.",
    },
    image: images.projAm,
    alt: {
      es: "Gabinete de transmisor AM de estado sólido Serie SENDER SS",
      en: "SENDER SS series solid-state AM transmitter cabinet",
    },
  },
  {
    id: "antennas",
    index: "04",
    code: "ANT",
    name: { es: "Antenas", en: "Antennas" },
    range: { es: "HF 2 – 30 MHz · Monopolo AM", en: "HF 2 – 30 MHz · AM monopole" },
    text: {
      es: "Antenas HF profesionales de 2 a 30 MHz y 1 kW, monopolos AM de 510 a 1700 kHz y torres contraventadas galvanizadas.",
      en: "Professional HF antennas from 2 to 30 MHz at 1 kW, AM monopoles from 510 to 1700 kHz and galvanized guyed towers.",
    },
    note: {
      es: "Servicio continuo. Instalación en radiodifusión y defensa.",
      en: "Continuous duty. Installed in broadcasting and defense.",
    },
    image: images.capAntennas,
    alt: {
      es: "Torre de telecomunicaciones con arreglo de antenas",
      en: "Telecommunications tower with antenna array",
    },
  },
  {
    id: "stl",
    index: "05",
    code: "STL",
    name: { es: "Enlaces STL", en: "STL links" },
    range: { es: "134 – 174 MHz · Hasta 10 W", en: "134 – 174 MHz · Up to 10 W" },
    text: {
      es: "Enlaces estudio–planta STAL-200 y AL-100, con encendido remoto del transmisor, operación Mono/MPX y antenas Yagi de 3 a 7 elementos.",
      en: "STAL-200 and AL-100 studio–transmitter links, with remote transmitter start, Mono/MPX operation and 3- to 7-element Yagi antennas.",
    },
    note: {
      es: "Yagi de aluminio 6162 para operación continua.",
      en: "6162 aluminium Yagi antennas for continuous operation.",
    },
    image: images.projStl,
    alt: {
      es: "Antena Yagi de enlace estudio–planta sobre azotea con vista a Santiago",
      en: "Studio–transmitter Yagi link antenna on a rooftop overlooking Santiago",
    },
  },
  {
    id: "audio",
    index: "06",
    code: "AUD",
    name: { es: "Audio", en: "Audio" },
    range: { es: "BIS-AP735 · ±15 dBu", en: "BIS-AP735 · ±15 dBu" },
    text: {
      es: "Procesamiento de la señal de programa para radiodifusión AM: control automático de ganancia, control de peak, pre-énfasis y filtrado activo.",
      en: "Program-signal processing for AM broadcasting: automatic gain control, peak control, pre-emphasis and active filtering.",
    },
    note: {
      es: "Un gabinete de 19 pulgadas por una unidad de rack. Salida 600 Ω.",
      en: "One 19-inch cabinet, one rack unit. 600 Ω output.",
    },
    image: images.capTransmission,
    alt: {
      es: "Base de torre y línea de alimentación de un sistema radiante",
      en: "Tower base and feed line of a radiating system",
    },
  },
  {
    id: "automation",
    index: "07",
    code: "AUTO",
    name: { es: "Automatización", en: "Automation" },
    range: { es: "Software propio · Telemetría", en: "In-house software · Telemetry" },
    text: {
      es: "Plataforma desarrollada por Sender para programar, administrar y supervisar transmisiones, con monitoreo remoto y alarmas en tiempo real.",
      en: "Platform developed by Sender to schedule, manage and supervise transmissions, with remote monitoring and real-time alarms.",
    },
    note: {
      es: "Los valores de una consola en pantalla serían una simulación, no telemetría en vivo. Aquí no se simulan cifras.",
      en: "On-screen console values would be a simulation, not live telemetry. No figures are simulated here.",
    },
    image: images.capCritical,
    alt: {
      es: "Estación costera de radio con mástil monopolo entre la niebla marina",
      en: "Coastal radio station with monopole mast in sea fog",
    },
  },
  {
    id: "critical",
    index: "08",
    code: "NAV",
    name: { es: "Comunicaciones críticas", en: "Critical communications" },
    range: { es: "NAVTEX 490 / 518 kHz", en: "NAVTEX 490 / 518 kHz" },
    text: {
      es: "Sistema NAVTEX profesional para seguridad marítima, con unidad de potencia y control, software de automatización propio y sistema radiante dedicado. También, proyectos de defensa documentados.",
      en: "Professional NAVTEX system for maritime safety, with a power and control unit, in-house automation software and a dedicated radiating system. Also, documented defense projects.",
    },
    note: {
      es: "490 / 518 kHz. Estaciones costeras y entornos de defensa.",
      en: "490 / 518 kHz. Coastal stations and defense environments.",
    },
    image: images.heroWide,
    alt: {
      es: "Sitio de transmisión costero con torre contraventada y caseta",
      en: "Coastal transmission site with guyed tower and shelter",
    },
  },
];

export const transmissionChain: { id: string; index: string; title: Loc; text: Loc }[] = [
  {
    id: "studio",
    index: "01",
    title: { es: "Estudio", en: "Studio" },
    text: { es: "La señal de programa se origina y se controla.", en: "The program signal originates and is controlled." },
  },
  {
    id: "processing",
    index: "02",
    title: { es: "Procesamiento", en: "Processing" },
    text: {
      es: "AGC, control de peak, pre-énfasis y filtrado activo.",
      en: "AGC, peak control, pre-emphasis and active filtering.",
    },
  },
  {
    id: "tx",
    index: "03",
    title: { es: "Transmisión", en: "Transmission" },
    text: {
      es: "Amplificación Clase D y modulación PWM en el transmisor.",
      en: "Class D amplification and PWM modulation in the transmitter.",
    },
  },
  {
    id: "link",
    index: "04",
    title: { es: "Enlace RF", en: "RF link" },
    text: {
      es: "Transporte estudio–planta y líneas coaxiales de baja pérdida.",
      en: "Studio–transmitter transport and low-loss coaxial lines.",
    },
  },
  {
    id: "antenna",
    index: "05",
    title: { es: "Antena", en: "Antenna" },
    text: {
      es: "Sistema radiante, acoplamiento y torre aterrizada.",
      en: "Radiating system, matching and grounded tower.",
    },
  },
  {
    id: "audience",
    index: "06",
    title: { es: "Audiencia", en: "Audience" },
    text: {
      es: "Cobertura entregada con operación continua 24/7.",
      en: "Coverage delivered with continuous 24/7 operation.",
    },
  },
];

export const bands: { code: string; range: string; use: Loc }[] = [
  {
    code: "AM",
    range: "490 – 1700 kHz",
    use: {
      es: "Radiodifusión en banda media · Transmisores Serie SS · Antenas monopolo",
      en: "Medium-wave broadcasting · SS Series transmitters · Monopole antennas",
    },
  },
  {
    code: "FM",
    range: "87.5 – 108 MHz",
    use: {
      es: "Radiodifusión FM · 50 W a 1 kW · PLL digital de alta estabilidad",
      en: "FM broadcasting · 50 W to 1 kW · High-stability digital PLL",
    },
  },
  {
    code: "HF",
    range: "2 – 30 MHz",
    use: {
      es: "Antenas HF profesionales · 1 kW · Comunicaciones de largo alcance",
      en: "Professional HF antennas · 1 kW · Long-range communications",
    },
  },
  {
    code: "VHF",
    range: "134 – 174 MHz",
    use: {
      es: "Enlaces estudio–planta · Antenas Yagi de 3 a 7 elementos",
      en: "Studio–transmitter links · 3 to 7-element Yagi antennas",
    },
  },
  {
    code: "UHF",
    range: "UHF",
    use: {
      es: "Enlaces de radiodifusión · Antenas direccionales",
      en: "Broadcast links · Directional antennas",
    },
  },
  {
    code: "NAVTEX",
    range: "490 / 518 kHz",
    use: {
      es: "Seguridad marítima · Automatización propia · Telemetría",
      en: "Maritime safety · In-house automation · Telemetry",
    },
  },
];
