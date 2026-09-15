// OLEA Broadcast — Scroll Craft (offline, no CDN)
// Vanilla JS only — works without internet
(function(){
  "use strict";

  // ——— Preloader ———
  const preloader = document.getElementById('preloader');
  const countEl = document.getElementById('preloader-count');
  const barEl = document.getElementById('preloader-bar');
  const skipBtn = document.getElementById('preloader-skip');
  let preloaderDone = false;
  let counter = 0;
  let timer = null;

  function finishPreloader(){
    if(preloaderDone) return;
    preloaderDone = true;
    clearInterval(timer);
    if(countEl) countEl.textContent = "100";
    if(barEl) barEl.style.width = "100%";
    if(window.__hidePreloader) window.__hidePreloader();
    else if(preloader){ preloader.classList.add('hidden'); document.body.style.overflow=""; }
    // reveal hero with CSS (inline fallback already does)
    document.querySelectorAll('.hero-title .line-inner').forEach((el,i)=>{
      el.style.transform='translateY(0)';
    });
    document.querySelectorAll('.reveal').forEach(el=>{
      el.style.opacity='1'; el.style.transform='none'; el.classList.add('in');
    });
  }

  function startCounter(){
    document.body.style.overflow="hidden";
    timer = setInterval(()=>{
      counter += Math.random()*9 + 4;
      if(counter >= 100){ counter=100; finishPreloader(); return; }
      const v=Math.floor(counter);
      if(countEl) countEl.textContent = String(v).padStart(2,'0');
      if(barEl) barEl.style.width = v+"%";
    }, 85);
    setTimeout(finishPreloader, 2600);
    setTimeout(()=>{ if(!preloaderDone) finishPreloader(); }, 4000);
  }
  if(preloader && countEl && barEl){
    startCounter();
  } else {
    // if no preloader, ensure hero visible
    setTimeout(finishPreloader, 100);
  }
  if(skipBtn) skipBtn.addEventListener('click', finishPreloader);
  if(preloader) preloader.addEventListener('click', (e)=>{ if(e.target===preloader) finishPreloader(); });

  // ——— Nav hide on scroll + mobile ———
  const nav=document.getElementById('nav');
  let lastY=window.scrollY;
  const hero=document.getElementById('hero');
  const heroProg=document.getElementById('hero-scroll-progress');
  window.addEventListener('scroll', ()=>{
    const y=window.scrollY;
    if(nav){
      if(y>lastY && y>120) nav.classList.add('hidden');
      else nav.classList.remove('hidden');
    }
    lastY=y;
    if(hero && heroProg){
      const prog=Math.min(1, y/(hero.offsetHeight*0.8));
      heroProg.style.transform=`scaleY(${prog})`;
    }
    onScrollEng();
    onScrollProyectos();
    onScrollParallax();
  }, {passive:true});

  const toggle=document.getElementById('nav-toggle');
  const mobile=document.getElementById('nav-mobile');
  if(toggle && mobile){
    toggle.addEventListener('click', ()=> mobile.classList.toggle('open'));
  }
  document.querySelectorAll('#nav-mobile a, .nav-links a').forEach(a=>{
    a.addEventListener('click', ()=>{
      if(mobile) mobile.classList.remove('open');
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id=a.getAttribute('href');
      if(id && id.length>1 && id!=="#"){
        const target=document.querySelector(id);
        if(target){
          e.preventDefault();
          const top=target.getBoundingClientRect().top + window.scrollY - 64;
          window.scrollTo({top, behavior:'smooth'});
          if(mobile) mobile.classList.remove('open');
        }
      }
    });
  });

  // ——— Hero parallax ———
  const heroCard=document.querySelector('.hero-image-card');
  function onScrollParallax(){
    if(!heroCard || !hero) return;
    const rect=hero.getBoundingClientRect();
    // when hero top is negative, move card slightly up
    const prog=Math.min(1, Math.max(0, -rect.top / (hero.offsetHeight*0.6)));
    heroCard.style.transform=`translateY(${-prog*28}px)`;
  }

  // ——— Reveal on scroll ———
  const revealEls=document.querySelectorAll('.reveal, .ingenieria-title, .productos-head h2, .contacto-left h2, .proyectos-title-row h2');
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(ent=>{
        if(ent.isIntersecting){
          ent.target.style.opacity='1';
          ent.target.style.transform='none';
          ent.target.classList.add('in');
          io.unobserve(ent.target);
        }
      });
    }, {threshold:0.12});
    revealEls.forEach(el=>{
      // ensure initial hidden handled via CSS; observe
      io.observe(el);
    });
  } else {
    revealEls.forEach(el=>{ el.style.opacity='1'; el.style.transform='none'; });
  }
  // force hero lines initial state
  document.querySelectorAll('.hero-title .line-inner').forEach(el=>{
    el.style.transform='translateY(0)';
    el.style.transition='transform 0.9s cubic-bezier(0.76,0,0.24,1)';
  });

  // ——— Ingeniería — 4 pasos con sticky ———
  const steps=[...document.querySelectorAll('.step')];
  const dots=[...document.querySelectorAll('#eng-dots .dot')];
  const engProgress=document.getElementById('eng-progress');
  const engSection=document.getElementById('ingenieria');
  const engSticky=document.querySelector('.ingenieria-sticky');
  let activeStep=0;
  function setActiveStep(i){
    if(i===activeStep) return;
    activeStep=i;
    steps.forEach((s,idx)=> s.classList.toggle('active', idx===i));
    dots.forEach((d,idx)=> d.classList.toggle('active', idx===i));
    if(engProgress) engProgress.style.width=((i+1)/steps.length*100)+"%";
    // animate steps opacity via CSS transition
    steps.forEach((s, idx)=>{
      const dist=Math.abs(idx-i);
      const op= dist===0?1 : dist===1?0.45:0.18;
      s.style.opacity=op;
      s.style.transform= dist===0?'none':'translateY(8px) scale(0.985)';
    });
  }
  // initial
  if(steps.length) setActiveStep(0);
  // on scroll, compute progress within engSection
  function onScrollEng(){
    if(!engSection || !steps.length) return;
    const rect=engSection.getBoundingClientRect();
    const vh=window.innerHeight;
    // engSection is taller than sticky; we want progress when sticky is pinned
    // approximate: when engSection top <= 96, progress starts; when bottom <= vh, ends
    const total=engSection.offsetHeight - vh + 200; // fudge
    let prog=0;
    if(rect.top <= 96){
      prog=Math.min(1, Math.max(0, (96 - rect.top)/ Math.max(1,total)));
    } else {
      prog=0;
    }
    let idx=0;
    if(prog<0.25) idx=0;
    else if(prog<0.50) idx=1;
    else if(prog<0.75) idx=2;
    else idx=3;
    setActiveStep(idx);
  }
  // dots click scroll to step
  dots.forEach(d=>{
    d.addEventListener('click', ()=>{
      const step=parseInt(d.dataset.step,10);
      if(!engSection) return;
      const rect=engSection.getBoundingClientRect();
      const start=window.scrollY + rect.top;
      const total=engSection.offsetHeight - window.innerHeight + 200;
      const offset=start + 96 + (total * (step/4 + 0.06));
      window.scrollTo({top: offset, behavior:'smooth'});
    });
  });
  // also observe steps on mobile
  if('IntersectionObserver' in window && window.innerWidth<=900){
    const io2=new IntersectionObserver((entries)=>{
      entries.forEach(ent=>{
        if(ent.isIntersecting){
          const idx=parseInt(ent.target.dataset.step,10);
          if(!isNaN(idx)) setActiveStep(idx);
        }
      });
    }, {threshold:0.55});
    steps.forEach(s=> io2.observe(s));
  }

  // ——— Proyectos — horizontal scroll ———
  const track=document.getElementById('proyectos-track');
  const proyectos=document.getElementById('proyectos');
  const sticky=document.querySelector('.proyectos-sticky');
  let maxX=0;
  function calcMaxX(){
    if(!track) return 0;
    return Math.max(0, track.scrollWidth - window.innerWidth + 32);
  }
  function onScrollProyectos(){
    if(!track || !proyectos || !sticky) return;
    // make proyectos tall enough to have scroll distance
    const rect=proyectos.getBoundingClientRect();
    const vh=window.innerHeight;
    // determine if proyectos is in sticky phase
    // we want progress 0 when proyectos top hits 0, 1 when proyectos bottom hits vh
    const total=proyectos.offsetHeight - vh;
    if(total<=0){
      track.style.transform='translateX(0)';
      return;
    }
    let prog=0;
    if(rect.top <= 0 && rect.bottom >= vh){
      prog=Math.min(1, Math.max(0, -rect.top / total));
    } else if(rect.top > 0){
      prog=0;
    } else {
      prog=1;
    }
    const x= -(maxX * prog);
    track.style.transform=`translateX(${x}px)`;
  }
  function setupProyectosHeight(){
    if(!track || !proyectos) return;
    maxX=calcMaxX();
    // set proyectos height to allow full horizontal scroll: vh + maxX (+ some padding)
    const needed = Math.max(900, maxX*1.05) + window.innerHeight;
    // only set if not mobile narrow where we use drag?
    if(window.innerWidth>560){
      proyectos.style.minHeight= needed + 'px';
      // sticky should be sticky
      if(sticky){
        sticky.style.position='sticky';
        sticky.style.top='0';
        sticky.style.height='560px';
      }
    } else {
      proyectos.style.minHeight='';
      if(sticky){
        sticky.style.position='relative';
        sticky.style.top='';
        sticky.style.height='520px';
      }
    }
    onScrollProyectos();
  }
  if(track && proyectos){
    setupProyectosHeight();
    window.addEventListener('load', setupProyectosHeight);
    window.addEventListener('resize', ()=>{
      clearTimeout(window._rh);
      window._rh=setTimeout(()=>{ setupProyectosHeight(); onScrollProyectos(); }, 200);
    });
    // allow drag / touch horizontal for manual control
    let isDown=false, startX=0, startTrans=0;
    const getX=()=>{
      const m=track.style.transform.match(/translateX\((-?\d+\.?\d*)px\)/);
      return m? parseFloat(m[1]) : 0;
    };
    sticky.addEventListener('pointerdown', (e)=>{
      isDown=true; startX=e.clientX; startTrans=getX(); sticky.setPointerCapture(e.pointerId);
      sticky.style.cursor='grabbing';
    });
    sticky.addEventListener('pointermove', (e)=>{
      if(!isDown) return;
      const dx=e.clientX - startX;
      // allow slight manual offset, but clamp
      let nx=startTrans + dx*0.6;
      nx=Math.max(-maxX, Math.min(0, nx));
      track.style.transform=`translateX(${nx}px)`;
    });
    const endDrag=()=>{
      if(!isDown) return;
      isDown=false;
      sticky.style.cursor='';
      // after drag, auto snap back to scroll-driven? keep manual until next scroll
    };
    sticky.addEventListener('pointerup', endDrag);
    sticky.addEventListener('pointerleave', endDrag);
    // wheel horizontal over sticky: prevent vertical scroll and translate
    sticky.addEventListener('wheel', (e)=>{
      // if user scrolls vertically over sticky while proyectos is pinned, we already handle via page scroll.
      // But allow horizontal wheel to nudge track
      if(Math.abs(e.deltaX) > Math.abs(e.deltaY)){
        e.preventDefault();
        let cur=getX();
        cur += -e.deltaX;
        cur=Math.max(-maxX, Math.min(0, cur));
        track.style.transform=`translateX(${cur}px)`;
      }
    }, {passive:false});
    // touch swipe for mobile
    let touchStartX=0;
    track.addEventListener('touchstart', e=>{ touchStartX=e.touches[0].clientX; }, {passive:true});
    track.addEventListener('touchmove', e=>{
      // allow native scroll, but if horizontal swipe, prevent
      const dx=e.touches[0].clientX - touchStartX;
      if(Math.abs(dx)>10 && track.scrollWidth > window.innerWidth){
        // no prevent, just hint
      }
    }, {passive:true});
  }

  // ——— Productos — 12 familias ———
  const familias=[
    {id:"am", name:"Transmisores AM", kicker:"Familia 01 — Transmisión AM", title:"Transmisores AM — Serie SS", desc:"Estado sólido, PWM de alta eficiencia. De 1 a 10 kW con el mismo gabinete y lógica de control. Diseñados para operar 20 años sin pedir perdón.", img:"assets/catalog/catalog-01.jpg", badge:"DISPONIBLE · ENTREGA 20 DÍAS", specs:["Modulación PWM, THD < 1.2%","Eficiencia 80–84% según modelo","Ancho de banda 10 Hz – 10 kHz ±0.5 dB","Protección VSWR, temperatura y red"], hasTabs:true},
    {id:"fm", name:"Transmisores FM", kicker:"Familia 02 — Transmisión FM", title:"Transmisores FM — Serie FMe", desc:"Exciter digital + amplificador LDMOS. Sonido denso, estéreo impecable y RDS. De 100 W a 5 kW.", img:"assets/catalog/catalog-02.jpg", badge:"DISPONIBLE · ENTREGA 25 DÍAS", specs:["SNR > 78 dB, separación estéreo > 55 dB","Entrada AES/EBU + analógica","Control remoto SNMP / Web","Refrigeración forzada silenciosa"]},
    {id:"ant-am", name:"Antenas AM", kicker:"Familia 03 — Radiantes AM", title:"Antenas AM — Monopolo &array", desc:"Monopolos de 42 a 110 m, con redes de acoplamiento y sistemas direccionales. Calculadas en campo, no en catálogo.", img:"assets/catalog/catalog-03.jpg", badge:"FABRICACIÓN A PEDIDO", specs:["Altura 0.18–0.45 λ","Ancho de banda > 30 kHz","Incluye unidad de sintonía","Galvanizado en caliente"]},
    {id:"ant-fm", name:"Antenas FM", kicker:"Familia 04 — Radiantes FM", title:"Antenas FM — Panel & Yagi", desc:"Arreglos de 1 a 8 bahías, polarización circular o vertical. ROE < 1.08 en 200 kHz.", img:"assets/catalog/catalog-04.jpg", badge:"STOCK LIMITADO", specs:["Ganancia 1.5–12 dBd según arreglo","Potencia hasta 10 kW por bahía","Conector 7/8” EIA","Radome opcional"]},
    {id:"consolas", name:"Consolas de Audio", kicker:"Familia 05 — Estudios", title:"Consolas — Serie C12 / C24", desc:"Consolas analógicas y híbridas para aire. Previos discretos, bus limpio y faders que no crujen a los 6 meses.", img:"assets/catalog/catalog-05.jpg", badge:"DEMO EN SALA", specs:["12 / 24 canales, 4 buses","USB + AoIP Dante opcional","Telco híbrido integrado","Fuente redundante"]},
    {id:"procesadores", name:"Procesadores", kicker:"Familia 06 — Audio", title:"Procesadores — Optimod-like", desc:"Cadena completa: AGC, limitador multibanda y clipper. Loudness competitivo sin fatiga.", img:"assets/catalog/catalog-06.jpg", badge:"LICENCIA INCLUIDA", specs:["5 bandas + clipper final","Presets AM / FM / Web","Control Ethernet","Bypass hardware"]},
    {id:"stl", name:"Enlaces STL", kicker:"Familia 07 — Transporte", title:"Enlaces STL — Digital 950 MHz", desc:"Enlace estudio-planta mono/bidireccional con audio sin compresión y telemetría.", img:"assets/catalog/catalog-07.jpg", badge:"ALCANCE 60 KM LOS", specs:["950 MHz, 300 kHz BW","Latencia < 8 ms","AES + MPX compuesto","RS-232 / GPIO"]},
    {id:"radiante", name:"Sistemas Radiantes", kicker:"Familia 08 — Infraestructura RF", title:"Sistemas Radiantes Completos", desc:"Desde el transmisor hasta la punta de la torre: línea rígida, desacoplos, iluminación y pararrayos.", img:"assets/catalog/catalog-08.jpg", badge:"LLAVE EN MANO", specs:["Línea rígida 1 5/8” – 3 1/8”","Desacoplo isocoupler","Baliza LED FAA","Puesta a tierra < 5 Ω"]},
    {id:"torres", name:"Torres", kicker:"Familia 09 — Estructuras", title:"Torres — Celosía & Monopolo", desc:"Torres arriostradas y autosoportadas hasta 120 m. Cálculo sísmico NCh433.", img:"assets/catalog/catalog-09.jpg", badge:"INGENIERÍA INCLUIDA", specs:["Acero ASTM A572, galvanizado","Viento 160 km/h","Escalera y línea de vida","Permiso municipal gestionado"]},
    {id:"energia", name:"Energía", kicker:"Familia 10 — Respaldo", title:"Grupos Electrógenos & UPS", desc:"Energía que no te deja en silencio. Grupos 10–60 kVA y UPS online de doble conversión.", img:"assets/catalog/catalog-10.jpg", badge:"AUTONOMÍA 12 H", specs:["Arranque < 10 s","Transferencia automática","Estanque 200 L","Monitoreo remoto"]},
    {id:"tierra", name:"Tierra & Pararrayos", kicker:"Familia 11 — Protección", title:"Mallas de Tierra & Pararrayos", desc:"Medición Wenner, malla de 60–120 radiales y pararrayos Franklin / ionizante. Lo que no se ve, pero salva el transmisor.", img:"assets/catalog/catalog-11.jpg", badge:"MEDICIÓN CERTIFICADA", specs:["Resistividad medida en sitio","Malla 120 radiales x 0.3 λ","Soldadura exotérmica","Informe con telurómetro"]},
    {id:"repuestos", name:"Repuestos", kicker:"Familia 12 — Soporte", title:"Repuestos & Mantenimiento", desc:"Stock crítico en Santiago: módulos RF, fuentes, ventiladores, MOSFETs y kits de mantención anual.", img:"assets/catalog/catalog-12.jpg", badge:"DESPACHO 24–48 H", specs:["Módulos RF intercambiables","Kits anuales por modelo","Capacitación incluida","Garantía 24 meses"]},
  ];
  const modelosAM={
    "1000SS":{potencia:"1.0 kW", eficiencia:"80%", consumo:"1.25 kW", audio:"20 Hz–10 kHz ±0.4 dB", thd:"<1.0%", peso:"98 kg", dim:"600×800×1200 mm"},
    "2500SS":{potencia:"2.5 kW", eficiencia:"82%", consumo:"3.05 kW", audio:"20 Hz–10 kHz ±0.4 dB", thd:"<1.1%", peso:"118 kg", dim:"600×900×1400 mm"},
    "5000SS":{potencia:"5.0 kW", eficiencia:"82%", consumo:"6.10 kW", audio:"10 Hz–10 kHz ±0.5 dB", thd:"<1.15%", peso:"162 kg", dim:"700×900×1600 mm"},
    "10000SS":{potencia:"10 kW", eficiencia:"84%", consumo:"11.9 kW", audio:"10 Hz–10 kHz ±0.5 dB", thd:"<1.2%", peso:"224 kg", dim:"800×1000×1800 mm"},
  };
  let currentFamilia=0;
  let currentModel="1000SS";
  const indexEl=document.getElementById('familias-index');
  const viewerImg=document.getElementById('viewer-img');
  const viewerBadge=document.getElementById('viewer-badge');
  const viewerKicker=document.getElementById('viewer-kicker');
  const viewerTitle=document.getElementById('viewer-title');
  const viewerDesc=document.getElementById('viewer-desc');
  const viewerSpecs=document.getElementById('viewer-specs');
  const viewerCta=document.getElementById('viewer-cta');
  const prodCounter=document.getElementById('prod-counter');
  const amTabsWrap=document.getElementById('am-tabs');
  const tabPanel=document.getElementById('tab-panel');

  function renderIndex(){
    if(!indexEl) return;
    indexEl.innerHTML="";
    familias.forEach((f,i)=>{
      const btn=document.createElement('button');
      btn.className="familia-btn"+(i===currentFamilia?" active":"");
      btn.dataset.idx=i;
      btn.innerHTML=`<span class="idx">${String(i+1).padStart(2,'0')}</span><span class="name">${f.name}</span><span class="arrow">→</span>`;
      btn.addEventListener('click', ()=>{
        currentFamilia=i;
        renderViewer(); renderIndex();
        const viewer=document.getElementById('familia-viewer');
        if(viewer){ viewer.style.transition='transform 0.35s ease, opacity 0.35s ease'; viewer.style.transform='translateY(4px)'; viewer.style.opacity='0.9'; setTimeout(()=>{ viewer.style.transform=''; viewer.style.opacity=''; }, 260); }
      });
      indexEl.appendChild(btn);
    });
    if(prodCounter) prodCounter.textContent=`${String(currentFamilia+1).padStart(2,'0')} / ${String(familias.length).padStart(2,'0')}`;
  }
  function renderSpecs(f){
    if(!viewerSpecs) return;
    viewerSpecs.innerHTML="";
    f.specs.forEach(s=>{
      const li=document.createElement('li');
      li.textContent=s;
      viewerSpecs.appendChild(li);
    });
  }
  function renderTabs(){
    if(!tabPanel || !amTabsWrap) return;
    const m=modelosAM[currentModel];
    if(!m) return;
    tabPanel.innerHTML=`
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
    amTabsWrap.querySelectorAll('.tab').forEach(btn=>{
      btn.classList.toggle('active', btn.dataset.model===currentModel);
      btn.onclick=()=>{
        currentModel=btn.dataset.model;
        renderTabs();
        tabPanel.style.opacity='0.4'; tabPanel.style.transform='translateY(6px)';
        setTimeout(()=>{ tabPanel.style.opacity='1'; tabPanel.style.transform='none'; tabPanel.style.transition='opacity 0.25s, transform 0.25s'; }, 40);
      };
    });
  }
  function renderViewer(){
    const f=familias[currentFamilia];
    if(!f) return;
    if(viewerImg){ viewerImg.src=f.img; viewerImg.alt=f.title; }
    if(viewerBadge) viewerBadge.textContent=f.badge;
    if(viewerKicker) viewerKicker.textContent=f.kicker;
    if(viewerTitle) viewerTitle.textContent=f.title;
    if(viewerDesc) viewerDesc.textContent=f.desc;
    renderSpecs(f);
    if(viewerCta){ viewerCta.textContent=`Cotizar ${f.name} →`; viewerCta.href="#contacto"; }
    if(amTabsWrap){
      if(f.hasTabs){ amTabsWrap.classList.remove('hidden-tabs'); renderTabs(); }
      else amTabsWrap.classList.add('hidden-tabs');
    }
    const sel=document.getElementById('input-familia');
    if(sel) sel.value=f.name;
    updateWhatsApp();
  }
  const prevBtn=document.getElementById('prod-prev');
  const nextBtn=document.getElementById('prod-next');
  if(prevBtn) prevBtn.addEventListener('click', ()=>{ currentFamilia=(currentFamilia-1+familias.length)%familias.length; renderViewer(); renderIndex(); });
  if(nextBtn) nextBtn.addEventListener('click', ()=>{ currentFamilia=(currentFamilia+1)%familias.length; renderViewer(); renderIndex(); });
  document.addEventListener('keydown', (e)=>{
    const tag=document.activeElement?.tagName;
    if(tag==="INPUT"||tag==="TEXTAREA"||tag==="SELECT") return;
    if(e.key==="ArrowLeft"){ currentFamilia=(currentFamilia-1+familias.length)%familias.length; renderViewer(); renderIndex(); }
    if(e.key==="ArrowRight"){ currentFamilia=(currentFamilia+1)%familias.length; renderViewer(); renderIndex(); }
  });
  const viewerEl=document.getElementById('familia-viewer');
  if(viewerEl){
    let touchX=0;
    viewerEl.addEventListener('touchstart', e=>{ touchX=e.touches[0].clientX; }, {passive:true});
    viewerEl.addEventListener('touchend', e=>{
      const dx=e.changedTouches[0].clientX - touchX;
      if(Math.abs(dx)>50){
        if(dx<0 && nextBtn) nextBtn.click();
        else if(prevBtn) prevBtn.click();
      }
    }, {passive:true});
  }
  renderIndex(); renderViewer();

  // ——— Contacto — WhatsApp live ———
  const inputNombre=document.getElementById('input-nombre');
  const inputCorreo=document.getElementById('input-correo');
  const inputFamilia=document.getElementById('input-familia');
  const inputMensaje=document.getElementById('input-mensaje');
  const waText=document.getElementById('wa-text');
  const waBtn=document.getElementById('whatsapp-btn');
  function escapeWa(s){ return (s||"").trim() || "—"; }
  function updateWhatsApp(){
    if(!waText || !waBtn) return;
    const nombre=escapeWa(inputNombre?.value || "");
    const correo=escapeWa(inputCorreo?.value || "");
    const familia=escapeWa(inputFamilia?.value || (familias[currentFamilia] && familias[currentFamilia].name) || "—");
    const mensaje=inputMensaje && inputMensaje.value.trim() ? ` Mensaje: ${inputMensaje.value.trim()}` : "";
    waText.innerHTML=`Hola equipo OLEA, soy <em>${nombre}</em>. Me interesa cotizar <em>${familia}</em>. Mi correo es <em>${correo}</em>.${mensaje?` <span style="color:var(--text-dim)">${mensaje}</span>`:""}`;
    const plain=`Hola equipo OLEA, soy ${nombre} (${correo}). Me interesa cotizar ${familia}.${mensaje} ¿Me comparten plazo y valor?`;
    waBtn.href=`https://wa.me/56912345678?text=${encodeURIComponent(plain)}`;
    if(inputFamilia && inputFamilia.value){
      const idx=familias.findIndex(f=> f.name===inputFamilia.value);
      if(idx>=0 && idx!==currentFamilia){ currentFamilia=idx; renderViewer(); renderIndex(); }
    }
  }
  [inputNombre, inputCorreo, inputFamilia, inputMensaje].forEach(el=>{
    if(el){ el.addEventListener('input', updateWhatsApp); el.addEventListener('change', updateWhatsApp); }
  });
  updateWhatsApp();
  const form=document.getElementById('contacto-form');
  const feedback=document.getElementById('form-feedback');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const nombre=inputNombre?.value.trim() || "";
      const correo=inputCorreo?.value.trim() || "";
      if(!nombre || !correo || !correo.includes('@')){
        if(feedback){ feedback.textContent="Revisa nombre y correo — necesitamos ambos para responderte."; feedback.className="form-feedback err"; feedback.style.transform='translateX(-4px)'; setTimeout(()=> feedback.style.transform='', 300); }
        return;
      }
      if(feedback){ feedback.textContent="¡Gracias! Te escribimos en menos de 24 hrs. También puedes usar el botón de WhatsApp."; feedback.className="form-feedback ok"; }
      form.reset();
      setTimeout(updateWhatsApp, 50);
      form.style.transform='scale(0.99)'; setTimeout(()=> form.style.transform='', 300);
    });
  }

  // ——— Images fallback ———
  document.querySelectorAll('img').forEach(img=>{
    img.addEventListener('error', ()=>{
      img.style.background="linear-gradient(135deg, #0E131C, #1A2130)";
      img.style.minHeight="200px";
      img.alt="Imagen no disponible — placeholder";
    });
  });

  // ——— Init calls ———
  setTimeout(()=>{ onScrollEng(); onScrollProyectos(); }, 300);
  window.addEventListener('load', ()=>{ onScrollEng(); onScrollProyectos(); setupProyectosHeight(); });
  // also ensure hero visible if preloader already hidden
  setTimeout(finishPreloader, 3500);
})();
