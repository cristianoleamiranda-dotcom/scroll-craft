/* ============================================================
   SENDER — Engineering the Signal
   main.js · smooth scroll + immersive motion system
   ============================================================ */
(() => {
  'use strict';

  const doc = document.documentElement;
  doc.classList.add('js');

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad2 = n => String(n).padStart(2, '0');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)') && window.matchMedia('(pointer: fine)').matches;

  gsap.registerPlugin(ScrollTrigger);

  /* ----------------------------------------------------------
     LENIS — smooth scroll
  ---------------------------------------------------------- */
  let lenis = null;
  if (!prefersReduced) {
    lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToEl = (target, offset = -84) => {
    if (lenis) lenis.scrollTo(target, { offset });
    else target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  /* ----------------------------------------------------------
     CUSTOM CURSOR
  ---------------------------------------------------------- */
  const cursor = $('#cursor');
  if (cursor && finePointer && !prefersReduced) {
    document.body.classList.add('has-cursor');
    const dot = $('.cursor__dot');
    const ring = $('.cursor__ring');
    let mx = innerWidth / 2, my = innerHeight / 2;
    let dx = mx, dy = my, rx = mx, ry = my, shown = false;

    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; cursor.style.opacity = '1'; dx = rx = mx; dy = ry = my; }
    }, { passive: true });
    addEventListener('mousedown', () => cursor.classList.add('is-down'));
    addEventListener('mouseup', () => cursor.classList.remove('is-down'));
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; shown = false; });
    document.addEventListener('mouseenter', () => { if (shown) cursor.style.opacity = '1'; });

    (function tick() {
      dx += (mx - dx) * 0.42; dy += (my - dy) * 0.42;
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      dot.style.transform = `translate(${dx}px, ${dy}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(tick);
    })();

    const hoverSel = 'a, button, [data-cursor], .card, input, textarea, select';
    document.addEventListener('mouseover', e => {
      cursor.classList.toggle('is-hover', !!(e.target.closest && e.target.closest(hoverSel)));
    });
  }

  /* ----------------------------------------------------------
     SCRAMBLE / DECODE TEXT
  ---------------------------------------------------------- */
  function scramble(el, finalText, duration = 1.3) {
    if (prefersReduced) { el.textContent = finalText; return; }
    const chars = '█▓▒░/<>[]#%&0123456789';
    const len = finalText.length;
    const dur = duration * 1000;
    const start = performance.now();
    const tickNow = now => {
      const p = clamp((now - start) / dur, 0, 1);
      const solved = Math.floor(p * len);
      let out = '';
      for (let i = 0; i < len; i++) {
        const c = finalText[i];
        out += (i < solved || c === ' ' || c === '—') ? c : chars[(Math.random() * chars.length) | 0];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(tickNow);
    };
    requestAnimationFrame(tickNow);
  }

  /* ----------------------------------------------------------
     NAV + MENU OVERLAY
  ---------------------------------------------------------- */
  const nav = $('#nav');
  const menuBtn = $('#menuBtn');
  const menu = $('#menu');
  let menuOpen = false;

  if (menu) menu.inert = true;

  const menuTl = gsap.timeline({ paused: true, defaults: { ease: 'power4.inOut' } });
  if (menu) {
    menuTl
      .to(menu, { clipPath: 'inset(0% 0% 0% 0)', duration: 0.85 }, 0)
      .fromTo('.menu__link', { y: 64, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.05 }, 0.3)
      .fromTo('.menu__meta', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.6);
  }
  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;
    document.body.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    if (menu) menu.inert = false;
    if (lenis) lenis.stop();
    menuTl.timeScale(1).play();
  }
  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    document.body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
    menuTl.timeScale(1.5).reverse().eventCallback('onComplete', () => { if (menu) menu.inert = true; });
  }
  if (menuBtn) menuBtn.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  if (nav) {
    ScrollTrigger.create({
      trigger: doc, start: 'top -90',
      onEnter: () => nav.classList.add('scrolled'),
      onLeaveBack: () => nav.classList.remove('scrolled'),
    });
  }

  /* Anchor navigation */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      const el = $(href);
      if (!el) return;
      e.preventDefault();
      closeMenu();
      scrollToEl(el);
    });
  });

  /* ----------------------------------------------------------
     PRELOADER + HERO INTRO
  ---------------------------------------------------------- */
  const pre = $('#preloader');
  const preCount = $('#preCount');
  const heroTl = gsap.timeline({ paused: true });

  heroTl
    .to('#heroEyebrow', { autoAlpha: 1, duration: 0.5 }, 0)
    .call(() => scramble($('#heroEyebrow'), $('#heroEyebrow').dataset.text || $('#heroEyebrow').textContent, 1.5), null, 0.15)
    .fromTo('.hero__line-inner', { yPercent: 118 }, { yPercent: 0, duration: 1.3, ease: 'power4.out', stagger: 0.14 }, 0.2)
    .fromTo('.hero__meta > *', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 }, 0.85)
    .fromTo('.hero__scroll', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, 1.05)
    .fromTo('.nav', { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.45);

  if (pre) {
    gsap.set('#heroEyebrow', { autoAlpha: 0 });
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      pre.classList.add('is-done');
      const tl = gsap.timeline({ onComplete: () => { pre.style.display = 'none'; ScrollTrigger.refresh(); } });
      tl.to('.preloader__inner', { autoAlpha: 0, duration: 0.35, ease: 'power2.in' })
        .to('.preloader__panel--top', { yPercent: -100, duration: 0.95, ease: 'power4.inOut' }, '-=0.1')
        .to('.preloader__panel--bottom', { yPercent: 100, duration: 0.95, ease: 'power4.inOut' }, '<0.14')
        .add(() => heroTl.play(), '-=0.6');
    };
    if (prefersReduced) {
      preCount.textContent = '100';
      setTimeout(finish, 200);
    } else {
      const state = { v: 0 };
      gsap.to(state, {
        v: 100, duration: 1.55, delay: 0.25, ease: 'power2.inOut',
        onUpdate: () => { preCount.textContent = pad2(Math.round(state.v)); },
        onComplete: finish,
      });
      pre.addEventListener('click', finish);
    }
  } else {
    heroTl.play();
  }

  /* ----------------------------------------------------------
     HUD — section tracker
  ---------------------------------------------------------- */
  const hudIdx = $('#hudIndex');
  const hudName = $('#hudName');
  const sections = $$('[data-section]');
  function setHud(s) {
    const i = sections.indexOf(s);
    if (i < 0 || !hudIdx) return;
    hudIdx.textContent = pad2(i + 1);
    hudName.textContent = s.dataset.section;
  }
  sections.forEach(s => {
    ScrollTrigger.create({
      trigger: s, start: 'top 45%', end: 'bottom 45%',
      onEnter: () => setHud(s), onEnterBack: () => setHud(s),
    });
  });

  /* ----------------------------------------------------------
     GLOBAL PROGRESS BAR
  ---------------------------------------------------------- */
  const pbar = $('#progressBar');
  if (pbar) {
    gsap.to(pbar, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: doc, start: 0, end: 'max', scrub: 0.4 },
    });
  }

  /* ----------------------------------------------------------
     REVEALS
  ---------------------------------------------------------- */
  const reveals = $$('[data-reveal]');
  if (prefersReduced) {
    reveals.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
  } else {
    reveals.forEach(el => {
      gsap.to(el, {
        autoAlpha: 1, y: 0, duration: 1.05, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  }

  /* ----------------------------------------------------------
     SECTION TITLES — line mask reveal
  ---------------------------------------------------------- */
  if (!prefersReduced) {
    $$('.section-title, .footer__title').forEach(title => {
      const lines = title.innerHTML.split(/<br\s*\/?>/i);
      title.innerHTML = lines
        .map(l => `<span class="line"><span class="line-inner">${l.trim()}</span></span>`)
        .join('');
      $$('.line-inner', title).forEach((span, i) => {
        gsap.fromTo(span, { yPercent: 114 }, {
          yPercent: 0, duration: 1.15, ease: 'power4.out', delay: i * 0.1,
          scrollTrigger: { trigger: title, start: 'top 86%', once: true },
        });
      });
    });
  }

  /* ----------------------------------------------------------
     HERO — ken burns + parallax
  ---------------------------------------------------------- */
  if (!prefersReduced) {
    gsap.fromTo('.hero__bg img', { scale: 1.04 }, { scale: 1.14, duration: 22, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.fromTo('.hero__bg', { yPercent: -3 }, {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero__content', {
      yPercent: 16, autoAlpha: 0.15, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  /* ----------------------------------------------------------
     MARQUEE
  ---------------------------------------------------------- */
  [$('#marqueeTop'), $('#marqueeBottom')].forEach((track, i) => {
    if (!track) return;
    track.innerHTML += track.innerHTML;
    if (prefersReduced) return;
    const row = track.closest('.marquee__row');
    const from = i === 0 ? 0 : -50;
    const to = i === 0 ? -50 : 0;
    const st = gsap.fromTo(track, { xPercent: from }, {
      xPercent: to, ease: 'none',
      duration: i === 0 ? 26 : 34,
      repeat: -1,
    });
    row.addEventListener('mouseenter', () => st.pause());
    row.addEventListener('mouseleave', () => st.play());
  });

  /* ----------------------------------------------------------
     STATEMENT — word-by-word scrub reveal
  ---------------------------------------------------------- */
  if (!prefersReduced) {
    gsap.fromTo('#statementText .w', { opacity: 0.13 }, {
      opacity: 1, stagger: 0.07, ease: 'none',
      scrollTrigger: { trigger: '.statement', start: 'top 78%', end: 'bottom 60%', scrub: 0.5 },
    });
  }

  /* ----------------------------------------------------------
     ABOUT — clip reveal + parallax + counters
  ---------------------------------------------------------- */
  const aboutClip = $('.about__clip');
  if (aboutClip && !prefersReduced) {
    gsap.fromTo(aboutClip, { clipPath: 'inset(100% 0% 0% 0)' }, {
      clipPath: 'inset(0% 0% 0% 0)', duration: 1.25, ease: 'power4.inOut',
      scrollTrigger: { trigger: aboutClip, start: 'top 82%', once: true },
    });
    gsap.fromTo('.about__img', { yPercent: -8.5 }, {
      yPercent: 8.5, ease: 'none',
      scrollTrigger: { trigger: aboutClip, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }
  $$('.stat__count').forEach(el => {
    const target = +el.dataset.count || 0;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.7, ease: 'power2.out',
      onUpdate: () => { el.textContent = pad2(Math.round(obj.v)); },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  /* ----------------------------------------------------------
     PROCESS — pinned vertical steps
  ---------------------------------------------------------- */
  const steps = $$('.step');
  const procNum = $('#processNum');
  const procCount = $('#processCount');
  const procBar = $('#processBar');
  if (steps.length && !prefersReduced) {
    const N = steps.length;
    const seg = 1 / (N - 1);
    gsap.set(steps.slice(1), { autoAlpha: 0, y: 70 });
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '#processPin',
        start: 'top top',
        end: '+=260%',
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: self => {
          const idx = Math.min(N - 1, Math.floor(self.progress * N + 0.001));
          if (procNum) procNum.textContent = pad2(idx + 1);
          if (procCount) procCount.textContent = `${pad2(idx + 1)} / ${pad2(N)}`;
          if (procBar) gsap.set(procBar, { scaleX: self.progress });
        },
      },
    });
    steps.forEach((step, i) => {
      if (i === 0) return;
      const at = i * seg - seg * 0.42;
      tl.to(step, { autoAlpha: 1, y: 0, duration: seg * 0.42, ease: 'power2.out' }, at);
      tl.to(steps[i - 1], { autoAlpha: 0.1, y: -64, duration: seg * 0.42, ease: 'power2.in' }, at);
    });
  }

  /* ----------------------------------------------------------
     WORK — pinned horizontal gallery
  ---------------------------------------------------------- */
  const workTrack = $('#workTrack');
  const workBar = $('#workBar');
  ScrollTrigger.matchMedia({
    '(min-width: 920px)': () => {
      if (!workTrack) return;
      const distance = () => Math.max(0, workTrack.scrollWidth - window.innerWidth);
      gsap.to(workTrack, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: '#workPin',
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: self => { if (workBar) gsap.set(workBar, { scaleX: self.progress }); },
        },
      });
    },
    '(max-width: 919px)': () => {
      if (workTrack) gsap.set(workTrack, { x: 0 });
      if (workBar) gsap.set(workBar, { scaleX: 0 });
    },
  });

  /* ----------------------------------------------------------
     PRODUCTS — catalog + figure viewer
  ---------------------------------------------------------- */
  const WA_BASE = 'https://wa.me/56983864148';
  const EMAIL = 'sender@sender.cl';
  const IMG = p => `assets/img/${p}`;

  const FAMILIES = [
    {
      id: 1, name: 'TRANSMISORES AM', tag: 'Serie SS de 1 kW a 10 kW · Clase D · PWM',
      band: 'BANDA / RANGO: 490 kHz – 1700 kHz',
      img: IMG('product-am.jpg'),
      desc: 'La serie de transmisores AM de estado sólido SENDER SS está diseñada y fabricada para radiodifusión profesional en banda media (AM). Todos los equipos utilizan arquitectura modular de alta eficiencia, con amplificación en Clase D y modulación por ancho de pulso (PWM), garantizando estabilidad, alta eficiencia energética y operación continua 24/7.',
      features: ['Arquitectura modular de estado sólido.', 'Amplificación Clase D de alta eficiencia.', 'Modulación por ancho de pulso (PWM).', 'Operación continua 24/7.'],
      specs: [['Banda de operación', '490 kHz – 1700 kHz'], ['Impedancia de salida', '50 Ω'], ['Estabilidad de frecuencia', '±5 Hz'], ['Potencias disponibles', '1000 W · 2000 W · 5000 W · 10.000 W']],
      models: [
        { code: 'AM-1000SS', power: '1000 W', desc: 'Equipo transmisor AM de estado sólido con potencia nominal de 1000 W. Diseñado para operación en toda la banda de radiodifusión AM, con excelente estabilidad de frecuencia y alta eficiencia de modulación.', specs: [['Potencia nominal', '1000 W'], ['Rango de frecuencia', '490 kHz – 1700 kHz'], ['Impedancia de salida', '50 Ω'], ['Estabilidad de frecuencia', '±5 Hz'], ['Arquitectura', 'Estado sólido modular']] },
        { code: 'AM-2500SS', power: '2000 W', desc: 'Transmisor AM de estado sólido con potencia nominal de 2000 W, diseñado para operación en toda la banda de radiodifusión AM con alta capacidad de modulación y confiabilidad en operación continua.', specs: [['Potencia nominal', '2000 W'], ['Alimentación', 'Monofásica 220 V · 50/60 Hz'], ['Otras configuraciones', 'Bajo requerimiento']] },
        { code: 'AM-5000SS', power: '5000 W', desc: 'Transmisor AM profesional de 5000 W diseñado para estaciones de alta potencia. Incorpora alimentación trifásica y arquitectura de alta eficiencia para operación continua en entornos críticos de radiodifusión.', specs: [['Potencia nominal', '5000 W'], ['Alimentación', 'Trifásica 220 V / 380 V · 50/60 Hz'], ['Impedancia', '50 Ω'], ['Modulación', 'Alta capacidad de modulación']] },
        { code: 'AM-10000SS', power: '10.000 W', desc: 'Transmisor AM de muy alta potencia diseñado para grandes estaciones de radiodifusión. Su sintetizador digital permite una estabilidad de frecuencia superior y ajuste en toda la banda AM.', specs: [['Potencia nominal', '10.000 W'], ['Rango', '490 kHz – 1700 kHz'], ['Estabilidad', '±5 Hz'], ['Sintetizador', 'Digital de frecuencia']] },
      ],
      apps: ['Radiodifusión AM de baja, media y alta potencia', 'Operación continua en entornos críticos'],
      external: 'https://www.sender.cl/transmisor-en-estado-solido-de-2000w/',
    },
    {
      id: 2, name: 'TRANSMISORES FM', tag: 'De 50 W a 1 kW · 87.5 – 108 MHz',
      band: 'BANDA / RANGO: 87.5 – 108 MHz',
      img: IMG('product-fm.jpg'),
      desc: 'Transmisores FM de estado sólido para estaciones pequeñas y medianas. Sintetizador digital de frecuencia, control y monitoreo remoto, y arquitectura modular de alta eficiencia para operación continua 24/7.',
      features: ['Amplificación de estado sólido', 'Sintetizador digital de frecuencia', 'Control y monitoreo remoto', 'Operación continua 24/7'],
      specs: [['Banda', '87.5 – 108 MHz'], ['Potencias disponibles', '50 W a 1 kW'], ['Impedancia de salida', '50 Ω'], ['Arquitectura', 'Estado sólido modular']],
      models: [],
      apps: ['Estaciones FM pequeñas y medianas', 'Redes de emisoras regionales'],
    },
    {
      id: 3, name: 'AMPLIFICADOR MF', tag: '1000 W · Clase D · 490 kHz – 1700 kHz',
      band: 'BANDA / RANGO: 490 kHz – 1700 kHz',
      img: IMG('area-transmision.jpg'),
      desc: 'Amplificador de frecuencia media (MF) de 1000 W con arquitectura Clase D de alta eficiencia, para etapas de potencia y sistemas de transmisión en banda media.',
      features: ['Arquitectura Clase D de alta eficiencia', 'Rango completo de banda media', 'Estabilidad de frecuencia', 'Operación continua 24/7'],
      specs: [['Potencia', '1000 W'], ['Rango', '490 kHz – 1700 kHz'], ['Clase de operación', 'D (alta eficiencia)'], ['Impedancia', '50 Ω']],
      models: [],
      apps: ['Etapas de potencia MF', 'Sistemas de transmisión AM'],
    },
    {
      id: 4, name: 'NAVTEX', tag: 'Potencia y control · software · monitoreo · sistema radiante',
      band: 'SERVICIO MARÍTIMO · MONITOREO 24/7',
      img: IMG('area-automatizacion.jpg'),
      desc: 'Sistema NAVTEX marítimo completo: unidad de potencia y control, software de operación, monitoreo y sistema radiante, para servicios meteorológicos y de seguridad en mar.',
      features: ['Unidad de potencia y control', 'Software de operación y programación', 'Monitoreo y aviso remoto', 'Sistema radiante completo'],
      specs: [['Modo de operación', 'NAVTEX marítimo'], ['Monitoreo', 'Continuo 24/7'], ['Componentes', 'Potencia · control · software · radiante']],
      models: [],
      apps: ['Puertos y terminales marítimos', 'Unidades navales y costeras'],
    },
    {
      id: 5, name: 'STL / ENLACES', tag: 'STAL-200 · AL-100 · antenas Yagi 134–174 MHz',
      band: 'BANDA / RANGO: 134 – 174 MHz',
      img: IMG('area-stl.jpg'),
      desc: 'Enlaces estudio–planta (STL) y radioenlaces VHF para transporte confiable de la señal: unidades STAL-200 y AL-100 junto a antenas Yagi para la banda de 134 a 174 MHz.',
      features: ['Transporte confiable estudio–planta', 'Unidades STAL-200 y AL-100', 'Antenas Yagi 134–174 MHz', 'Integración y sintonía en campo'],
      specs: [['Banda', '134 – 174 MHz'], ['Modelos', 'STAL-200 · AL-100'], ['Antenas', 'Yagi 134 – 174 MHz']],
      models: [],
      apps: ['Enlaces estudio–planta', 'Redes regionales de transmisión'],
    },
    {
      id: 6, name: 'PROCESAMIENTO DE AUDIO', tag: 'Gabinete 19″ · 1U · AGC · PWM · salida 600 Ω',
      band: 'FORMATO: GABINETE 19″ · 1U',
      img: IMG('about.jpg'),
      desc: 'Gabinete de procesamiento de audio profesional 19″ 1U con control automático de ganancia (AGC), modulación por ancho de pulso (PWM) y salida de 600 Ω para estudios y salas de transmisión.',
      features: ['Formato rack 19″ · 1U', 'AGC de precisión', 'Modulación PWM', 'Salida 600 Ω'],
      specs: [['Formato', '19″ · 1U'], ['Control', 'AGC'], ['Modulación', 'PWM'], ['Salida', '600 Ω']],
      models: [],
      apps: ['Estudios de emisoras', 'Salas de transmisión'],
    },
    {
      id: 7, name: 'ANTENAS AM', tag: 'Monopolo plegado · 510 kHz – 1700 kHz · torre aterrizada',
      band: 'BANDA / RANGO: 510 kHz – 1700 kHz',
      img: IMG('area-radiodifusion.jpg'),
      desc: 'Antenas monopolo plegado para radiodifusión AM, de 510 kHz a 1700 kHz, diseñadas para torre aterrizada y sintonización en banda con baja pérdida.',
      features: ['Diseño monopolo plegado', 'Torre aterrizada', 'Sintonización en banda', 'Baja pérdida'],
      specs: [['Banda', '510 kHz – 1700 kHz'], ['Tipo', 'Monopolo plegado'], ['Soporte', 'Torre aterrizada']],
      models: [],
      apps: ['Sistemas radiantes AM', 'Torres de radiodifusión'],
    },
    {
      id: 8, name: 'ANTENA HF', tag: 'Banda HF completa · servicio continuo 24/7 · fabricación nacional',
      band: 'BANDA HF COMPLETA · SERVICIO 24/7',
      img: IMG('area-comunicaciones.jpg'),
      desc: 'Antena para comunicaciones HF con cobertura de banda completa, diseñada para servicio continuo 24/7 y fabricada en Chile.',
      features: ['Cobertura de banda HF completa', 'Servicio continuo 24/7', 'Fabricación nacional', 'Instalación y sintonía'],
      specs: [['Banda', 'HF completa'], ['Servicio', 'Continuo 24/7'], ['Fabricación', 'Nacional (Chile)']],
      models: [],
      apps: ['Comunicaciones HF marítimas y terrestres', 'Redes de comunicaciones críticas'],
    },
    {
      id: 9, name: 'TORRES', tag: 'Celosía triangular · tirantes en tres direcciones',
      band: 'ESTRUCTURA: CELOSÍA TRIANGULAR',
      img: IMG('product-torres.jpg'),
      desc: 'Torres de celosía triangular con sistema de tirantes en tres direcciones, diseñadas para radiodifusión, enlaces y comunicaciones.',
      features: ['Sección de celosía triangular', 'Tirantes en tres direcciones', 'Diseño estructural a norma', 'Fabricación e instalación'],
      specs: [['Sección', 'Triangular'], ['Tirantes', '3 direcciones'], ['Aplicación', 'Radiodifusión y enlaces']],
      models: [],
      apps: ['Torres de radiodifusión', 'Apoyos para enlaces'],
    },
    {
      id: 10, name: 'CABLE COAXIAL', tag: 'Líneas de transmisión de baja pérdida · 50 Ω',
      band: 'IMPEDANCIA: 50 Ω',
      img: IMG('area-rf.jpg'),
      desc: 'Líneas de transmisión coaxial de baja pérdida e impedancia de 50 Ω, para interconexión de equipos y sistemas radiantes.',
      features: ['Líneas de baja pérdida', 'Impedancia 50 Ω', 'Instalación en interior y exterior'],
      specs: [['Impedancia', '50 Ω'], ['Pérdida', 'Baja'], ['Aplicación', 'Interconexión de equipos']],
      models: [],
      apps: ['Interconexión de transmisores', 'Descenso hacia el sistema radiante'],
    },
    {
      id: 11, name: 'CONDENSADORES RF', tag: '100 pF a 6000 pF · alta tensión · operación continua',
      band: 'RANGO: 100 pF – 6000 pF',
      img: IMG('area-rf.jpg'),
      desc: 'Condensadores RF de alta tensión, de 100 pF a 6000 pF, para tanques sintonizados y circuitos de potencia en operación continua.',
      features: ['Rango de 100 pF a 6000 pF', 'Aislamiento para alta tensión', 'Operación continua 24/7'],
      specs: [['Rango', '100 pF – 6000 pF'], ['Tensión', 'Alta'], ['Servicio', 'Continuo']],
      models: [],
      apps: ['Tanques sintonizados', 'Circuitos de potencia RF'],
    },
    {
      id: 12, name: 'CIRCUITOS INTEGRADOS', tag: 'Componentes para control, amplificación y adquisición de señales',
      band: 'CONTROL · AMPLIFICACIÓN · ADQUISICIÓN',
      img: IMG('area-rf.jpg'),
      desc: 'Componentes y circuitos integrados para control, amplificación y adquisición de señales, para el desarrollo de equipos de transmisión y medición.',
      features: ['Control y conmutación', 'Amplificación de señal', 'Adquisición de señales'],
      specs: [['Función', 'Control · amplificación · adquisición'], ['Aplicación', 'Equipos de transmisión y medición']],
      models: [],
      apps: ['Desarrollo de equipos propios', 'Instrumentación de medición'],
    },
  ];

  const indexEl = $('#productIndex');
  const figEl = $('#productFig');
  let activeFamily = 0;
  let modelIdx = 0;

  if (indexEl && figEl) {
    FAMILIES.forEach(f => { const im = new Image(); im.src = f.img; });

    indexEl.innerHTML = FAMILIES.map((f, i) => `
      <button class="products__item${i === 0 ? ' is-active' : ''}" data-i="${i}" data-cursor aria-label="${f.name}">
        <span class="p-idx mono">${pad2(f.id)}</span>
        <span class="p-name">${f.name}</span>
        <span class="p-tag">${f.tag}</span>
      </button>`).join('');

    const figWrap = document.createElement('div');
    figWrap.className = 'fig';
    figEl.appendChild(figWrap);

    const modelHTML = (f, mi) => {
      const m = f.models[mi];
      return `
        <div class="fig-model">
          <div>
            <div class="fig-model-head">
              <span class="fig-model-code">${m.code}</span>
              <span class="fig-model-power mono">${m.power}</span>
            </div>
            <p>${m.desc}</p>
          </div>
          <dl>${m.specs.map(([k, v]) => `<div class="spec-row"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
        </div>`;
    };

    const figHTML = f => {
      const prev = FAMILIES[(activeFamily - 1 + FAMILIES.length) % FAMILIES.length];
      const next = FAMILIES[(activeFamily + 1) % FAMILIES.length];
      return `
        <div class="fig-head">
          <div class="fig-head-left">
            <span class="fig-code mono">FIG. ${pad2(f.id)}</span>
            <h3 class="fig-name">${f.name}</h3>
          </div>
          <span class="fig-band mono">${f.band}</span>
        </div>
        <div class="fig-media"><img src="${f.img}" alt="${f.name} — Sender" loading="lazy"></div>
        <p class="fig-desc">${f.desc}</p>
        <div class="fig-cols">
          <div class="fig-col">
            <h4 class="mono">CARACTERÍSTICAS PRINCIPALES</h4>
            <ul>${f.features.map(x => `<li>${x}</li>`).join('')}</ul>
          </div>
          <div class="fig-col">
            <h4 class="mono">ESPECIFICACIONES TÉCNICAS</h4>
            <dl>${f.specs.map(([k, v]) => `<div class="spec-row"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
          </div>
        </div>
        ${f.models.length ? `
        <div class="fig-models">
          <h4 class="mono fig-models-title">MODELOS Y CONFIGURACIONES</h4>
          <div class="fig-tabs" role="tablist">
            ${f.models.map((mo, i) => `<button class="fig-tab${i === modelIdx ? ' is-active' : ''}" data-model="${i}" role="tab" aria-selected="${i === modelIdx}">${mo.code}</button>`).join('')}
          </div>
          ${modelHTML(f, modelIdx)}
        </div>` : ''}
        ${f.apps.length ? `
        <div class="fig-apps fig-col">
          <h4 class="mono">APLICACIONES</h4>
          <ul>${f.apps.map(x => `<li>${x}</li>`).join('')}</ul>
        </div>` : ''}
        <div class="fig-actions">
          <a class="btn btn--accent magnetic" target="_blank" rel="noopener" data-cursor
             href="${WA_BASE}?text=${encodeURIComponent(`Hola Sender, necesito asesoría técnica en ${f.name}.`)}"
             ><span class="btn__label">COTIZAR POR WHATSAPP</span><span class="btn__arrow">↗</span></a>
          <a class="btn btn--ghost magnetic" data-cursor
             href="mailto:${EMAIL}?subject=${encodeURIComponent(`Consulta ${f.name} — ${f.tag.split('·')[0].trim()}`)}"
             ><span class="btn__label">SOLICITAR COTIZACIÓN</span><span class="btn__arrow">→</span></a>
          ${f.external ? `<a class="text-link mono" target="_blank" rel="noopener" data-cursor href="${f.external}">FICHA COMPLETA EN SENDER.CL ↗</a>` : ''}
        </div>
        <div class="fig-nav">
          <button data-goto="prev" data-cursor><span>←</span><span>${prev.name}</span></button>
          <span class="fig-nav-center mono"><b>${pad2(activeFamily + 1)}</b> / ${pad2(FAMILIES.length)}</span>
          <button data-goto="next" data-cursor><span>${next.name}</span><span>→</span></button>
        </div>`;
    };

    figWrap.innerHTML = figHTML(FAMILIES[0]);

    figWrap.addEventListener('click', e => {
      const tab = e.target.closest('.fig-tab');
      if (tab) {
        const f = FAMILIES[activeFamily];
        modelIdx = +tab.dataset.model;
        $$('.fig-tab', figWrap).forEach(t => {
          t.classList.toggle('is-active', t === tab);
          t.setAttribute('aria-selected', t === tab);
        });
        const block = $('.fig-model', figWrap);
        if (!block) return;
        if (prefersReduced) { block.outerHTML = modelHTML(f, modelIdx); return; }
        gsap.to(block, {
          autoAlpha: 0, y: 14, duration: 0.22, ease: 'power2.in',
          onComplete: () => {
            block.outerHTML = modelHTML(f, modelIdx);
            gsap.fromTo($('.fig-model', figWrap), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' });
          },
        });
        return;
      }
      const navBtn = e.target.closest('[data-goto]');
      if (navBtn) setFamily(activeFamily + (navBtn.dataset.goto === 'next' ? 1 : -1));
    });

    indexEl.addEventListener('click', e => {
      const b = e.target.closest('.products__item');
      if (b) setFamily(+b.dataset.i);
    });

    function setFamily(i) {
      const target = (i + FAMILIES.length) % FAMILIES.length;
      if (target === activeFamily) return;
      activeFamily = target;
      modelIdx = 0;
      $$('.products__item', indexEl).forEach((b, bi) => b.classList.toggle('is-active', bi === activeFamily));
      const activeBtn = $('.products__item.is-active', indexEl);
      if (activeBtn && window.innerWidth < 1180) activeBtn.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
      const apply = () => {
        figWrap.innerHTML = figHTML(FAMILIES[activeFamily]);
        if (!prefersReduced) gsap.fromTo(figWrap, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' });
      };
      if (prefersReduced) { apply(); return; }
      gsap.to(figWrap, { autoAlpha: 0, y: 26, duration: 0.3, ease: 'power2.in', onComplete: apply });
    }

    if (!prefersReduced) {
      gsap.fromTo(figWrap, { autoAlpha: 0, y: 40 }, {
        autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.products__grid', start: 'top 80%', once: true },
      });
    }
  }

  /* ----------------------------------------------------------
     QUOTE FORM — mailto + whatsapp builders
  ---------------------------------------------------------- */
  const form = $('#quoteForm');
  const waQuote = $('#waQuote');
  const formNote = $('#formNote');
  if (form) {
    const buildBody = () => {
      const d = Object.fromEntries(new FormData(form));
      return [
        'Solicitud de asesoría — Sender',
        '',
        `Nombre: ${d.nombre || ''}`,
        `Empresa / Emisora: ${d.empresa || ''}`,
        `Correo: ${d.correo || ''}`,
        `Teléfono: ${d.telefono || ''}`,
        `Área de interés: ${d.area || ''}`,
        '',
        d.mensaje || '',
      ].join('\n');
    };
    const refreshWA = () => {
      const d = Object.fromEntries(new FormData(form));
      const has = Object.values(d).some(v => v && String(v).trim());
      if (has) waQuote.href = `${WA_BASE}?text=${encodeURIComponent(buildBody())}`;
    };
    form.addEventListener('input', refreshWA);
    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      const nameField = form.elements.nombre.closest('.field');
      const mailField = form.elements.correo.closest('.field');
      const nameOk = form.elements.nombre.value.trim().length > 1;
      const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.elements.correo.value);
      nameField.classList.toggle('is-invalid', !nameOk);
      mailField.classList.toggle('is-invalid', !mailOk);
      if (!nameOk || !mailOk) {
        ok = false;
        formNote.textContent = 'Completa nombre y correo para continuar.';
        setTimeout(() => { nameField.classList.remove('is-invalid'); mailField.classList.remove('is-invalid'); }, 900);
      }
      if (!ok) return;
      const body = buildBody();
      const area = form.elements.area.value || 'Consultas';
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Solicitud de asesoría — ' + area)}&body=${encodeURIComponent(body)}`;
      formNote.textContent = 'Abriendo tu cliente de correo con la solicitud lista para Sender.';
    });
    refreshWA();
  }

  /* ----------------------------------------------------------
     MAGNETIC BUTTONS
  ---------------------------------------------------------- */
  if (finePointer && !prefersReduced) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const y = (e.clientY - r.top - r.height / 2) / r.height;
        gsap.to(el, { x: x * 14, y: y * 10, duration: 0.4, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.35)' });
      });
    });
  }

  /* ----------------------------------------------------------
     FOOTER — giant word parallax + back to top
  ---------------------------------------------------------- */
  if (!prefersReduced) {
    gsap.fromTo('#footerWord span', { yPercent: 34 }, {
      yPercent: -14, ease: 'none',
      scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
    });
  }
  const toTop = $('#toTop');
  if (toTop) {
    toTop.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0, { duration: 1.8 });
      else window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     REFRESH
  ---------------------------------------------------------- */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
  let rT;
  addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => ScrollTrigger.refresh(), 200); });
})();
