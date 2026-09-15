import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// —————————————————————————————
// Lenis smooth scroll (must be before preloader uses it)
// —————————————————————————————
const lenis = new Lenis({
  duration: 1.1,
  easing: (t)=> Math.min(1, 1.001 - Math.pow(2, -10*t)),
  smoothWheel: true,
  syncTouch: false,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=> lenis.raf(time*1000));
gsap.ticker.lagSmoothing(0);

function refreshTriggers(){ ScrollTrigger.refresh(); }

// —————————————————————————————
// Preloader
// —————————————————————————————
const preloader = document.getElementById('preloader');
const countEl = document.getElementById('preloader-count');
const barEl = document.getElementById('preloader-bar');
const skipBtn = document.getElementById('preloader-skip');
let preloaderDone = false;
let counter = 0;
let counterTimer = null;

function finishPreloader(){
  if(preloaderDone) return;
  preloaderDone = true;
  clearInterval(counterTimer);
  if(countEl) countEl.textContent = "100";
  if(barEl) barEl.style.width = "100%";
  if(preloader) preloader.classList.add('hidden');
  document.body.style.overflow = "";
  // trigger hero animations
  setTimeout(()=> { try{ revealHero(); }catch(e){} refreshTriggers(); }, 220);
  // enable scroll
  try{ lenis.start(); }catch(e){}
}

function startCounter(){
  document.body.style.overflow = "hidden";
  try{ lenis.stop(); }catch(e){}
  counterTimer = setInterval(()=>{
    counter += Math.random()*9 + 4;
    if(counter >= 100){ counter = 100; finishPreloader(); return; }
    const v = Math.floor(counter);
    if(countEl) countEl.textContent = String(v).padStart(2,'0');
    if(barEl) barEl.style.width = v + "%";
  }, 90);
  // auto finish after 2.6s even if not 100
  setTimeout(finishPreloader, 2600);
}
startCounter();
skipBtn?.addEventListener('click', finishPreloader);
preloader?.addEventListener('click', (e)=>{
  if(e.target === preloader) finishPreloader();
});
// fallback if images take too long
setTimeout(()=>{ if(!preloaderDone) finishPreloader(); }, 4000);

// —————————————————————————————
// Nav hide on scroll + mobile toggle
// —————————————————————————————
const nav = document.getElementById('nav');
let lastY = 0;
lenis.on('scroll', ({scroll})=>{
  const y = scroll;
  if(y > lastY && y > 120) nav.classList.add('hidden');
  else nav.classList.remove('hidden');
  lastY = y;
  // hero progress
  const h = document.getElementById('hero');
  const prog = Math.min(1, y / (h.offsetHeight*0.8));
  document.getElementById('hero-scroll-progress').style.transform = `scaleY(${prog})`;
});
document.getElementById('nav-toggle')?.addEventListener('click', ()=>{
  document.getElementById('nav-mobile').classList.toggle('open');
});
document.querySelectorAll('#nav-mobile a, .nav-links a').forEach(a=>{
  a.addEventListener('click', ()=>{
    document.getElementById('nav-mobile').classList.remove('open');
  });
});
// smooth anchor
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const id = a.getAttribute('href');
    if(id.length>1){
      e.preventDefault();
      const target = document.querySelector(id);
      if(target) lenis.scrollTo(target, { offset: -64 });
    }
  });
});

// —————————————————————————————
// Hero reveal
// —————————————————————————————
function revealHero(){
  gsap.to('.hero-title .line-inner', {
    y: "0%", duration: 1.1, stagger: 0.12, ease: "expo.out", overwrite:true
  });
  gsap.to('.reveal', {
    opacity:1, y:0, duration:0.8, stagger:0.08, ease:"power3.out", delay:0.2,
    onComplete:()=>{
      document.querySelectorAll('.reveal').forEach(el=> el.classList.add('in'));
    }
  });
}
// fallback if preloader already hidden quickly
if(preloaderDone) revealHero();

// parallax hero card
gsap.to('.hero-image-card', {
  yPercent: -6,
  scrollTrigger: {
    trigger: "#hero",
    start:"top top",
    end:"bottom top",
    scrub: 0.8
  }
});

// —————————————————————————————
// Ingeniería — pinned + 4 steps
// —————————————————————————————
const steps = [...document.querySelectorAll('.step')];
const dots = [...document.querySelectorAll('#eng-dots .dot')];
const engProgress = document.getElementById('eng-progress');

function setActiveStep(i){
  steps.forEach((s, idx)=> s.classList.toggle('active', idx===i));
  dots.forEach((d, idx)=> d.classList.toggle('active', idx===i));
  engProgress.style.width = ((i+1)/steps.length*100) + "%";
}

// ScrollTrigger pinned section
let engST = ScrollTrigger.create({
  trigger: "#ingenieria",
  start:"top top",
  end:"+=300%",
  pin: ".ingenieria-sticky",
  pinSpacing:false,
  scrub: 0.6,
  onUpdate: (self)=>{
    const p = self.progress;
    const idx = Math.min(3, Math.floor(p * 4 * 0.99));
    // alternative: thresholds 0-0.25, etc.
    let active = 0;
    if(p < 0.25) active=0;
    else if(p < 0.50) active=1;
    else if(p < 0.75) active=2;
    else active=3;
    setActiveStep(active);
    // animate steps as they enter
    steps.forEach((s, i)=>{
      const dist = Math.abs(i - active);
      const op = dist===0 ? 1 : dist===1 ? 0.42 : 0.18;
      gsap.to(s, {opacity: op, y: dist===0?0:8, scale: dist===0?1:0.985, duration:0.35, overwrite:true});
    });
  }
});

// click dots
dots.forEach(d=>{
  d.addEventListener('click', ()=>{
    const step = parseInt(d.dataset.step);
    const offset = document.getElementById('ingenieria').offsetTop + (engST.end - engST.start) * (step/4 + 0.12);
    lenis.scrollTo(offset);
  });
});

// also intersection for non-pinned fallback (mobile where pin disabled)
ScrollTrigger.matchMedia({
  "(max-width: 900px)": function(){
    engST.kill();
    // simple observer scroll
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(ent=>{
        if(ent.isIntersecting){
          const idx = parseInt(ent.target.dataset.step);
          setActiveStep(idx);
        }
      });
    }, { threshold: 0.55 });
    steps.forEach(s=> obs.observe(s));
    // ensure first active
    setActiveStep(0);
  }
});

// —————————————————————————————
// Proyectos — horizontal scroll
// —————————————————————————————
const track = document.getElementById('proyectos-track');
const proyectosSection = document.getElementById('proyectos');

function setupHorizontal(){
  const trackWidth = track.scrollWidth;
  const viewport = window.innerWidth;
  const maxX = trackWidth - viewport + (parseInt(getComputedStyle(track).paddingLeft)||0)*2;
  // calculate x to move
  const getX = () => -(maxX);
  // kill existing if any
  ScrollTrigger.getById("proyectos-h")?.kill();

  gsap.set(track, { x:0 });

  ScrollTrigger.create({
    id:"proyectos-h",
    trigger: proyectosSection,
    start:"top top",
    end: `+=${Math.max(900, maxX*1.05)}`,
    pin: ".proyectos-sticky",
    scrub: 0.9,
    anticipatePin: 1,
    onUpdate: (self)=>{
      const prog = self.progress;
      const x = gsap.utils.interpolate(0, getX(), prog);
      gsap.set(track, { x });
    }
  });

  // also allow drag / wheel horizontal on sticky
  let isDown=false, startX=0, scrollLeft=0, currentX=0;
  const sticky = document.querySelector('.proyectos-sticky');
  sticky.addEventListener('pointerdown', (e)=>{
    isDown=true; startX=e.clientX; sticky.setPointerCapture(e.pointerId);
    currentX = gsap.getProperty(track, "x");
  });
  sticky.addEventListener('pointermove', (e)=>{
    if(!isDown) return;
    const dx = e.clientX - startX;
    // we don't directly drag pinned, but hint
  });
  sticky.addEventListener('pointerup', ()=> isDown=false);
}

setupHorizontal();
window.addEventListener('load', setupHorizontal);
window.addEventListener('resize', ()=>{
  clearTimeout(window._rh);
  window._rh = setTimeout(()=>{ setupHorizontal(); refreshTriggers(); }, 200);
});

// —————————————————————————————
// Productos — 12 familias + tabs
// —————————————————————————————
const familias = [
  {
    id: "am", name:"Transmisores AM", kicker:"Familia 01 — Transmisión AM", title:"Transmisores AM — Serie SS",
    desc:"Estado sólido, PWM de alta eficiencia. De 1 a 10 kW con el mismo gabinete y lógica de control. Diseñados para operar 20 años sin pedir perdón.",
    img:"assets/catalog/catalog-01.jpg", badge:"DISPONIBLE · ENTREGA 20 DÍAS",
    specs:["Modulación PWM, THD < 1.2%","Eficiencia 80–84% según modelo","Ancho de banda 10 Hz – 10 kHz ±0.5 dB","Protección VSWR, temperatura y red"],
    hasTabs:true
  },
  {
    id:"fm", name:"Transmisores FM", kicker:"Familia 02 — Transmisión FM", title:"Transmisores FM — Serie FMe",
    desc:"Exciter digital + amplificador LDMOS. Sonido denso, estéreo impecable y RDS. De 100 W a 5 kW.",
    img:"assets/catalog/catalog-02.jpg", badge:"DISPONIBLE · ENTREGA 25 DÍAS",
    specs:["SNR > 78 dB, separación estéreo > 55 dB","Entrada AES/EBU + analógica","Control remoto SNMP / Web","Refrigeración forzada silenciosa"]
  },
  {
    id:"ant-am", name:"Antenas AM", kicker:"Familia 03 — Radiantes AM", title:"Antenas AM — Monopolo &array",
    desc:"Monopolos de 42 a 110 m, con redes de acoplamiento y sistemas direccionales. Calculadas en campo, no en catálogo.",
    img:"assets/catalog/catalog-03.jpg", badge:"FABRICACIÓN A PEDIDO",
    specs:["Altura 0.18–0.45 λ","Ancho de banda > 30 kHz","Incluye unidad de sintonía","Galvanizado en caliente"]
  },
  {
    id:"ant-fm", name:"Antenas FM", kicker:"Familia 04 — Radiantes FM", title:"Antenas FM — Panel & Yagi",
    desc:"Arreglos de 1 a 8 bahías, polarización circular o vertical. ROE < 1.08 en 200 kHz.",
    img:"assets/catalog/catalog-04.jpg", badge:"STOCK LIMITADO",
    specs:["Ganancia 1.5–12 dBd según arreglo","Potencia hasta 10 kW por bahía","Conector 7/8” EIA","Radome opcional"]
  },
  {
    id:"consolas", name:"Consolas de Audio", kicker:"Familia 05 — Estudios", title:"Consolas — Serie C12 / C24",
    desc:"Consolas analógicas y híbridas para aire. Previos discretos, bus limpio y faders que no crujen a los 6 meses.",
    img:"assets/catalog/catalog-05.jpg", badge:"DEMO EN SALA",
    specs:["12 / 24 canales, 4 buses","USB + AoIP Dante opcional","Telco híbrido integrado","Fuente redundante"]
  },
  {
    id:"procesadores", name:"Procesadores", kicker:"Familia 06 — Audio", title:"Procesadores — Optimod-like",
    desc:"Cadena completa: AGC, limitador multibanda y clipper. Loudness competitivo sin fatiga.",
    img:"assets/catalog/catalog-06.jpg", badge:"LICENCIA INCLUIDA",
    specs:["5 bandas + clipper final","Presets AM / FM / Web","Control Ethernet","Bypass hardware"]
  },
  {
    id:"stl", name:"Enlaces STL", kicker:"Familia 07 — Transporte", title:"Enlaces STL — Digital 950 MHz",
    desc:"Enlace estudio-planta mono/bidireccional con audio sin compresión y telemetría.",
    img:"assets/catalog/catalog-07.jpg", badge:"ALCANCE 60 KM LOS",
    specs:["950 MHz, 300 kHz BW","Latencia < 8 ms","AES + MPX compuesto","RS-232 / GPIO"]
  },
  {
    id:"radiante", name:"Sistemas Radiantes", kicker:"Familia 08 — Infraestructura RF", title:"Sistemas Radiantes Completos",
    desc:"Desde el transmisor hasta la punta de la torre: línea rígida, desacoplos, iluminación y pararrayos.",
    img:"assets/catalog/catalog-08.jpg", badge:"LLAVE EN MANO",
    specs:["Línea rígida 1 5/8” – 3 1/8”","Desacoplo isocoupler","Baliza LED FAA","Puesta a tierra < 5 Ω"]
  },
  {
    id:"torres", name:"Torres", kicker:"Familia 09 — Estructuras", title:"Torres — Celosía & Monopolo",
    desc:"Torres arriostradas y autosoportadas hasta 120 m. Cálculo sísmico NCh433.",
    img:"assets/catalog/catalog-09.jpg", badge:"INGENIERÍA INCLUIDA",
    specs:["Acero ASTM A572, galvanizado","Viento 160 km/h","Escalera y línea de vida","Permiso municipal gestionado"]
  },
  {
    id:"energia", name:"Energía", kicker:"Familia 10 — Respaldo", title:"Grupos Electrógenos & UPS",
    desc:"Energía que no te deja en silencio. Grupos 10–60 kVA y UPS online de doble conversión.",
    img:"assets/catalog/catalog-10.jpg", badge:"AUTONOMÍA 12 H",
    specs:["Arranque < 10 s","Transferencia automática","Estanque 200 L","Monitoreo remoto"]
  },
  {
    id:"tierra", name:"Tierra & Pararrayos", kicker:"Familia 11 — Protección", title:"Mallas de Tierra & Pararrayos",
    desc:"Medición Wenner, malla de 60–120 radiales y pararrayos Franklin / ionizante. Lo que no se ve, pero salva el transmisor.",
    img:"assets/catalog/catalog-11.jpg", badge:"MEDICIÓN CERTIFICADA",
    specs:["Resistividad medida en sitio","Malla 120 radiales x 0.3 λ","Soldadura exotérmica","Informe con telurómetro"]
  },
  {
    id:"repuestos", name:"Repuestos", kicker:"Familia 12 — Soporte", title:"Repuestos & Mantenimiento",
    desc:"Stock crítico en Santiago: módulos RF, fuentes, ventiladores, MOSFETs y kits de mantención anual.",
    img:"assets/catalog/catalog-12.jpg", badge:"DESPACHO 24–48 H",
    specs:["Módulos RF intercambiables","Kits anuales por modelo","Capacitación incluida","Garantía 24 meses"]
  },
];

const modelosAM = {
  "1000SS": { potencia:"1.0 kW", eficiencia:"80%", consumo:"1.25 kW", audio:"20 Hz–10 kHz ±0.4 dB", thd:"<1.0%", peso:"98 kg", dim:"600×800×1200 mm" },
  "2500SS": { potencia:"2.5 kW", eficiencia:"82%", consumo:"3.05 kW", audio:"20 Hz–10 kHz ±0.4 dB", thd:"<1.1%", peso:"118 kg", dim:"600×900×1400 mm" },
  "5000SS": { potencia:"5.0 kW", eficiencia:"82%", consumo:"6.10 kW", audio:"10 Hz–10 kHz ±0.5 dB", thd:"<1.15%", peso:"162 kg", dim:"700×900×1600 mm" },
  "10000SS": { potencia:"10 kW", eficiencia:"84%", consumo:"11.9 kW", audio:"10 Hz–10 kHz ±0.5 dB", thd:"<1.2%", peso:"224 kg", dim:"800×1000×1800 mm" },
};

let currentFamilia = 0;
let currentModel = "1000SS";

const indexEl = document.getElementById('familias-index');
const viewerImg = document.getElementById('viewer-img');
const viewerBadge = document.getElementById('viewer-badge');
const viewerKicker = document.getElementById('viewer-kicker');
const viewerTitle = document.getElementById('viewer-title');
const viewerDesc = document.getElementById('viewer-desc');
const viewerSpecs = document.getElementById('viewer-specs');
const viewerCta = document.getElementById('viewer-cta');
const prodCounter = document.getElementById('prod-counter');
const amTabsWrap = document.getElementById('am-tabs');
const tabPanel = document.getElementById('tab-panel');

function renderIndex(){
  indexEl.innerHTML = "";
  familias.forEach((f, i)=>{
    const btn = document.createElement('button');
    btn.className = "familia-btn" + (i===currentFamilia? " active":"");
    btn.dataset.idx = i;
    btn.innerHTML = `<span class="idx">${String(i+1).padStart(2,'0')}</span><span class="name">${f.name}</span><span class="arrow">→</span>`;
    btn.addEventListener('click', ()=>{
      currentFamilia = i;
      renderViewer();
      renderIndex();
      // animate viewer
      gsap.fromTo(".familia-viewer", {y:10, opacity:0.85}, {y:0, opacity:1, duration:0.45, ease:"power3.out"});
    });
    indexEl.appendChild(btn);
  });
  prodCounter.textContent = `${String(currentFamilia+1).padStart(2,'0')} / ${String(familias.length).padStart(2,'0')}`;
}

function renderSpecs(f){
  viewerSpecs.innerHTML = "";
  f.specs.forEach(s=>{
    const li = document.createElement('li');
    li.textContent = s;
    viewerSpecs.appendChild(li);
  });
}

function renderTabs(){
  const m = modelosAM[currentModel];
  tabPanel.innerHTML = `
    <div class="model-head"><strong>${currentModel}</strong><span>${m.potencia} · Eficiencia ${m.eficiencia}</span></div>
    <div class="spec-grid">
      <div class="spec-cell"><small>Potencia</small><b>${m.potencia}</b></div>
      <div class="spec-cell"><small>Eficiencia</small><b>${m.eficiencia}</b></div>
      <div class="spec-cell"><small>Consumo</small><b>${m.consumo}</b></div>
      <div class="spec-cell"><small>Respuesta audio</small><b>${m.audio}</b></div>
      <div class="spec-cell"><small>THD</small><b>${m.thd}</b></div>
      <div class="spec-cell"><small>Peso / Dim</small><b>${m.peso}</b></div>
    </div>
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:2px">
      <span style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.08em; background:#0B0F14; color:#FFF8E7; padding:6px 10px; border-radius:999px">PWM · Estado sólido</span>
      <span style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.08em; border:1px solid rgba(11,15,20,0.12); padding:6px 10px; border-radius:999px">Garantía 24 meses</span>
    </div>
  `;
  // bind tab buttons
  amTabsWrap.querySelectorAll('.tab').forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.model===currentModel);
    btn.onclick = ()=>{
      currentModel = btn.dataset.model;
      renderTabs();
      // tiny flash
      gsap.fromTo(tabPanel, {opacity:0.4, y:6}, {opacity:1, y:0, duration:0.3});
    };
  });
}

function renderViewer(){
  const f = familias[currentFamilia];
  viewerImg.src = f.img;
  viewerImg.alt = f.title;
  viewerBadge.textContent = f.badge;
  viewerKicker.textContent = f.kicker;
  viewerTitle.textContent = f.title;
  viewerDesc.textContent = f.desc;
  renderSpecs(f);
  viewerCta.textContent = `Cotizar ${f.name} →`;
  viewerCta.href = "#contacto";
  // tabs visibility
  if(f.hasTabs){
    amTabsWrap.classList.remove('hidden-tabs');
    renderTabs();
  } else {
    amTabsWrap.classList.add('hidden-tabs');
  }
  // update whatsapp selector default
  const sel = document.getElementById('input-familia');
  if(sel) sel.value = f.name;
  updateWhatsApp();
}

document.getElementById('prod-prev').addEventListener('click',()=>{
  currentFamilia = (currentFamilia -1 + familias.length)%familias.length;
  renderViewer(); renderIndex();
});
document.getElementById('prod-next').addEventListener('click',()=>{
  currentFamilia = (currentFamilia +1)%familias.length;
  renderViewer(); renderIndex();
});

// keyboard arrows
document.addEventListener('keydown', (e)=>{
  if(e.key==="ArrowLeft" && document.activeElement?.tagName!=="INPUT" && document.activeElement?.tagName!=="TEXTAREA"){
    currentFamilia = (currentFamilia -1 + familias.length)%familias.length;
    renderViewer(); renderIndex();
  }
  if(e.key==="ArrowRight" && document.activeElement?.tagName!=="INPUT" && document.activeElement?.tagName!=="TEXTAREA"){
    currentFamilia = (currentFamilia +1)%familias.length;
    renderViewer(); renderIndex();
  }
});

// swipe for viewer
let touchX=0;
const viewer = document.getElementById('familia-viewer');
viewer.addEventListener('touchstart', e=> touchX=e.touches[0].clientX, {passive:true});
viewer.addEventListener('touchend', e=>{
  const dx = e.changedTouches[0].clientX - touchX;
  if(Math.abs(dx)>50){
    if(dx<0) document.getElementById('prod-next').click();
    else document.getElementById('prod-prev').click();
  }
}, {passive:true});

renderIndex();
renderViewer();

// —————————————————————————————
// Contacto — WhatsApp live rewrite
// —————————————————————————————
const inputNombre = document.getElementById('input-nombre');
const inputCorreo = document.getElementById('input-correo');
const inputFamilia = document.getElementById('input-familia');
const inputMensaje = document.getElementById('input-mensaje');
const waText = document.getElementById('wa-text');
const waBtn = document.getElementById('whatsapp-btn');

function escapeWa(s){ return s.trim() || "—"; }

function updateWhatsApp(){
  const nombre = escapeWa(inputNombre.value);
  const correo = escapeWa(inputCorreo.value);
  const familia = escapeWa(inputFamilia.value || familias[currentFamilia]?.name || "—");
  const mensaje = inputMensaje.value.trim() ? ` Mensaje: ${inputMensaje.value.trim()}` : "";
  const preview = `Hola equipo OLEA, soy <em>${nombre}</em>. Me interesa cotizar <em>${familia}</em>. Mi correo es <em>${correo}</em>.${mensaje ? ` <span style="color:var(--text-dim)">${mensaje}</span>` : ""}`;
  waText.innerHTML = preview;

  const plain = `Hola equipo OLEA, soy ${nombre} (${correo}). Me interesa cotizar ${familia}.${mensaje} ¿Me comparten plazo y valor?`;
  const encoded = encodeURIComponent(plain);
  waBtn.href = `https://wa.me/56912345678?text=${encoded}`;
  // also update familia selector if typed familia changed
  if(inputFamilia.value && familias.findIndex(f=> f.name===inputFamilia.value) !== currentFamilia){
    const idx = familias.findIndex(f=> f.name===inputFamilia.value);
    if(idx>=0){ currentFamilia = idx; renderViewer(); renderIndex(); }
  }
}
[inputNombre, inputCorreo, inputFamilia, inputMensaje].forEach(el=>{
  el.addEventListener('input', updateWhatsApp);
  el.addEventListener('change', updateWhatsApp);
});
updateWhatsApp();

// form submit (mock)
const form = document.getElementById('contacto-form');
const feedback = document.getElementById('form-feedback');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const nombre = inputNombre.value.trim();
  const correo = inputCorreo.value.trim();
  if(!nombre || !correo || !correo.includes('@')){
    feedback.textContent = "Revisa nombre y correo — necesitamos ambos para responderte.";
    feedback.className = "form-feedback err";
    gsap.fromTo(feedback, {x:-4}, {x:0, duration:0.3, ease:"power2.out"});
    return;
  }
  feedback.textContent = "¡Gracias! Te escribimos en menos de 24 hrs. También puedes usar el botón de WhatsApp.";
  feedback.className = "form-feedback ok";
  form.reset();
  setTimeout(updateWhatsApp, 50);
  // confetti-ish
  gsap.fromTo(form, {scale:0.99}, {scale:1, duration:0.4, ease:"back.out(1.2)"});
});

// —————————————————————————————
// Reveal on scroll (generic)
// —————————————————————————————
gsap.utils.toArray('.ingenieria-title, .productos-head h2, .contacto-left h2, .proyectos-title-row h2').forEach(el=>{
  gsap.from(el, {
    y: 22, opacity:0, duration:0.8,
    scrollTrigger:{ trigger:el, start:"top 88%", once:true }
  });
});

// productos viewer parallax a bit
gsap.from(".familias-index", {
  y: 18, opacity:0, duration:0.6,
  scrollTrigger:{ trigger:"#productos", start:"top 80%", once:true }
});

// —————————————————————————————
// Ensure images 200 — fallback placeholder if missing
// —————————————————————————————
document.querySelectorAll('img').forEach(img=>{
  img.addEventListener('error', ()=>{
    // replace with gradient placeholder via canvas
    img.style.background = "linear-gradient(135deg, #0E131C, #1A2130)";
    img.style.minHeight = "200px";
    img.alt = "Imagen no disponible — placeholder";
  });
});

// —————————————————————————————
// Accessibility: reduced motion
// —————————————————————————————
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  gsap.globalTimeline.timeScale(0.6);
}

// —————————————————————————————
// Final refresh
// —————————————————————————————
window.addEventListener('load', ()=> {
  refreshTriggers();
  setTimeout(refreshTriggers, 500);
});
setTimeout(refreshTriggers, 1000);
