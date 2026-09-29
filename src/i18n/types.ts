export interface UiCopy {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogAlt: string;
  };
  a11y: {
    skip: string;
    nav: string;
    language: string;
    openIndex: string;
    closeIndex: string;
    current: string;
  };
  nav: {
    inicio: string;
    nosotros: string;
    ingenieria: string;
    productos: string;
    proyectos: string;
    contacto: string;
    index: string;
  };
  hero: {
    disciplines: [string, string, string];
    lineA: string;
    lineB: string;
    place: string;
    scroll: string;
    videoLabel: string;
  };
  signal: {
    index: string;
    kicker: string;
    title: string;
    lead: string;
    body: string[];
    stages: { name: string; text: string }[];
  };
  about: {
    index: string;
    kicker: string;
    title: string;
    lead: string;
    body: string[];
    missionLabel: string;
    mission: string;
    facts: { k: string; v: string }[];
    note: string;
    fig: string;
  };
  engineering: {
    index: string;
    kicker: string;
    title: string;
    intro: string;
    stateLabel: string;
  };
  transmission: {
    index: string;
    kicker: string;
    title: string;
    intro: string;
    note: string;
  };
  products: {
    index: string;
    kicker: string;
    title: string;
    intro: string;
    view: string;
    catalog: string;
    all: string;
    spec: string;
  };
  projects: {
    index: string;
    kicker: string;
    title: string;
    intro: string;
    open: string;
    close: string;
    source: string;
    fig: string;
  };
  contact: {
    index: string;
    kicker: string;
    title: string;
    sub: string;
    address: string;
    phone: string;
    email: string;
    sales: string;
    map: string;
    whatsapp: string;
    products: string;
    formTitle: string;
    name: string;
    company: string;
    emailField: string;
    type: string;
    message: string;
    submit: string;
    note: string;
    types: string[];
  };
  footer: {
    claim: string;
    concept: string;
    nav: string;
    channels: string;
    legal: string;
    back: string;
  };
  catalog: {
    kicker: string;
    title: string;
    intro: string;
    view: string;
    count: string;
  };
  category: {
    back: string;
    products: string;
  };
  product: {
    back: string;
    overview: string;
    specs: string;
    features: string;
    applications: string;
    variants: string;
    source: string;
    consult: string;
    quote: string;
    related: string;
    docs: string;
    notFound: string;
  };
  notFound: {
    title: string;
    body: string;
    home: string;
  };
}
