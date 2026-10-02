/* deleFOCO Producción B2C — talento */
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
const savedTheme = store.get("df-theme");
const isLight = savedTheme === "light";
document.body.classList.remove("theme-light", "theme-dark");
document.body.classList.add("mode-b2c", isLight ? "theme-light" : "theme-dark");

const state = { lang: store.get("df-lang") === "en" ? "en" : "es", statusKey: null };

const copy = {
  es: {
    heroTitle: "Tu lugar en el set<br><span>empieza acá.</span>",
    heroText: "Si estás empezando, o ya diste tus primeros pasos, acá podés sumarte a pasantías, crew junior y formación junto a la comunidad audiovisual de deleFOCO.",
    heroPrimary: "Quiero ser parte <span>→</span>",
    heroSecondary: "Conocer oportunidades",
    contactTitle: "Contanos tu rol. Nosotros te decimos el siguiente paso.",
    contactText: "No es una postulación formal ni una vacante abierta. Es un registro simple para pasantías, crew junior o formación. Te escribimos por WhatsApp con lo que sigue: perfil en la comunidad, Escuela o una convocatoria.",
    formButton: "Enviar ficha por WhatsApp <span>→</span>",
    headerCta: "Hablar con un asesor",
    pageTitle: "Producción para Talento | deleFOCO",
    pageDesc: "Producción para talento: pasantías, crew junior, comunidad de profesionales y formación audiovisual con deleFOCO en Costa Rica.",
    toTop: "Volver arriba",
    themeDark: "Oscuro",
    themeLight: "Claro",
    errors: "Completá los campos obligatorios antes de enviar. Revisá nombre, correo, rol, vía de entrada, experiencia y la casilla de confirmación.",
    successOpen: "Listo. Se abrió WhatsApp con tu ficha. Si no ves la ventana, permití las emergentes.",
    successBlocked: "El navegador bloqueó la ventana de WhatsApp. Permití las ventanas emergentes e intentá de nuevo."
  },
  en: {
    heroTitle: "Your place on set<br><span>starts here.</span>",
    heroText: "If you are starting out, or you already took your first steps, you can join internships, junior crew and training with the deleFOCO audiovisual community.",
    heroPrimary: "I want to be part of it <span>→</span>",
    heroSecondary: "See opportunities",
    contactTitle: "Tell us your role. We will tell you the next step.",
    contactText: "This is not a formal application or an open vacancy. It is a simple interest form for internships, junior crew or training. We will write to you on WhatsApp with what follows: a community profile, the School or a crew call.",
    formButton: "Send form via WhatsApp <span>→</span>",
    headerCta: "Talk to an advisor",
    pageTitle: "Production for Talent | deleFOCO",
    pageDesc: "Production for talent: internships, junior crew, a professional community and audiovisual training with deleFOCO in Costa Rica.",
    toTop: "Back to top",
    themeDark: "Dark",
    themeLight: "Light",
    errors: "Please complete the required fields before sending. Check name, email, role, starting path, experience and the confirmation box.",
    successOpen: "Done. WhatsApp opened with your form. If you do not see the window, allow pop-ups.",
    successBlocked: "Your browser blocked the WhatsApp window. Allow pop-ups and try again."
  }
};

function setText(id, value, html = false) {
  const el = document.getElementById(id);
  if (!el) return;
  html ? (el.innerHTML = value) : (el.textContent = value);
}

const colorToggle = document.getElementById("colorToggle");

function updateThemeToggle() {
  if (!colorToggle) return;
  const isDark = document.body.classList.contains("theme-dark");
  const text = colorToggle.querySelector(".color-toggle-text");
  const icon = colorToggle.querySelector(".color-toggle-icon");
  const label = isDark ? copy[state.lang].themeLight : copy[state.lang].themeDark;
  if (text) text.textContent = label;
  if (icon) icon.textContent = isDark ? "☀" : "☾";
  colorToggle.setAttribute("aria-label", label);
  colorToggle.setAttribute("title", label);
  colorToggle.setAttribute("aria-pressed", String(isDark));
}

colorToggle?.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("theme-dark");
  document.body.classList.toggle("theme-light", !isDark);
  store.set("df-theme", isDark ? "dark" : "light");
  updateThemeToggle();
});

function applyLanguage() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll(".lang-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.lang === state.lang)
  );
  const c = copy[state.lang];
  setText("heroTitle", c.heroTitle, true);
  setText("heroText", c.heroText);
  setText("heroPrimary", c.heroPrimary, true);
  setText("heroSecondary", c.heroSecondary);
  setText("contactTitle", c.contactTitle);
  setText("contactText", c.contactText);
  setText("whatsappSubmit", c.formButton, true);
  const headerCta = document.getElementById("headerWhatsApp");
  if (headerCta) headerCta.textContent = c.headerCta;
  document.querySelectorAll("[data-en]").forEach((el) => {
    if (!("es" in el.dataset)) el.dataset.es = el.innerHTML;
    el.innerHTML = state.lang === "en" ? el.dataset.en : el.dataset.es;
  });
  ["placeholder", "aria-label", "aria-roledescription"].forEach((attr) => {
    document.querySelectorAll("[data-en-" + attr + "]").forEach((el) => {
      const esKey = "data-es-" + attr;
      if (!el.hasAttribute(esKey)) el.setAttribute(esKey, el.getAttribute(attr) || "");
      el.setAttribute(attr, state.lang === "en" ? el.getAttribute("data-en-" + attr) : el.getAttribute(esKey));
    });
  });
  document.title = c.pageTitle;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", c.pageDesc);
  const toTopBtn = document.querySelector(".to-top");
  if (toTopBtn) toTopBtn.setAttribute("aria-label", c.toTop);
  const statusEl = document.getElementById("formStatus");
  if (statusEl && state.statusKey) statusEl.textContent = c[state.statusKey];
  updateThemeToggle();
}

document.querySelectorAll(".lang-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    state.lang = btn.dataset.lang;
    store.set("df-lang", state.lang);
    applyLanguage();
  })
);

function enviarWhatsApp() {
  const form = document.getElementById("leadForm");
  const status = document.getElementById("formStatus");
  if (!form.checkValidity()) {
    state.statusKey = "errors";
    status.textContent = copy[state.lang].errors;
    form.reportValidity();
    return;
  }
  const data = new FormData(form);
  const value = (name) => String(data.get(name) || "").trim();
  const lines = state.lang === "es"
    ? [
        "[TALENTO] Hola, quiero enviar mi ficha de interés:",
        `Nombre: ${value("name")}`,
        `Correo: ${value("email")}`,
        `WhatsApp: ${value("phone") || "No indicado"}`,
        `Ciudad o zona: ${value("city") || "No indicada"}`,
        `Rol de interés: ${value("role")}`,
        `Cómo quiero empezar: ${value("path")}`,
        `Experiencia: ${value("experience")}`,
        `Reel o portafolio: ${value("reel") || "Aún no tengo"}`
      ]
    : [
        "[TALENT] Hi, I want to send my interest form:",
        `Name: ${value("name")}`,
        `Email: ${value("email")}`,
        `WhatsApp: ${value("phone") || "Not provided"}`,
        `City or area: ${value("city") || "Not provided"}`,
        `Role of interest: ${value("role")}`,
        `How I want to start: ${value("path")}`,
        `Experience: ${value("experience")}`,
        `Reel or portfolio: ${value("reel") || "I do not have one yet"}`
      ];
  const url = `https://wa.me/50686823430?text=${encodeURIComponent(lines.join("\n"))}`;
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  state.statusKey = opened ? "successOpen" : "successBlocked";
  status.textContent = copy[state.lang][state.statusKey];
}

document.getElementById("whatsappSubmit")?.addEventListener("click", enviarWhatsApp);
document.getElementById("leadForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  enviarWhatsApp();
});

const talentWaText = {
  es: "[TALENTO] Hola, quiero enviar mi ficha de interés:\nNombre:\nCorreo:\nWhatsApp:\nCiudad o zona:\nRol de interés:\nCómo quiero empezar:\nExperiencia:\nReel o portafolio:",
  en: "[TALENT] Hi, I want to send my interest form:\nName:\nEmail:\nWhatsApp:\nCity or area:\nRole of interest:\nHow I want to start:\nExperience:\nReel or portfolio:"
};

function openTalentWhatsApp(event) {
  if (event) event.preventDefault();
  const text = talentWaText[state.lang] || talentWaText.es;
  window.open("https://wa.me/50686823430?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");
}

document.getElementById("headerWhatsApp")?.addEventListener("click", openTalentWhatsApp);
document.querySelectorAll("[data-talent-wa]").forEach((link) => link.addEventListener("click", openTalentWhatsApp));

applyLanguage();

(function () {
  const root = document.getElementById("heroCarousel");
  if (!root) return;
  const slides = Array.from(root.querySelectorAll(".hero-carousel-slide"));
  const dots = Array.from(root.querySelectorAll(".hero-carousel-dots button"));
  const prevBtn = document.getElementById("heroCarouselPrev");
  const nextBtn = document.getElementById("heroCarouselNext");
  let current = 0;
  let timer = null;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
      dot.setAttribute("aria-selected", i === current ? "true" : "false");
    });
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }
  function startAutoplay() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, 5000);
  }
  nextBtn && nextBtn.addEventListener("click", () => { next(); startAutoplay(); });
  prevBtn && prevBtn.addEventListener("click", () => { prev(); startAutoplay(); });
  dots.forEach((dot) => dot.addEventListener("click", () => { goTo(Number(dot.dataset.index)); startAutoplay(); }));
  root.addEventListener("mouseenter", () => timer && clearInterval(timer));
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", () => timer && clearInterval(timer));
  root.addEventListener("focusout", startAutoplay);
  let x0 = null;
  root.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  root.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); startAutoplay(); }
    x0 = null;
  }, { passive: true });
  goTo(0);
  if (!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) startAutoplay();
})();

(function () {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  const toTop = document.createElement("button");
  toTop.type = "button";
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", copy[state.lang].toTop);
  toTop.textContent = "↑";
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  document.body.appendChild(toTop);

  const topbar = document.querySelector(".topbar");
  let ticking = false;
  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    if (topbar) topbar.classList.toggle("is-scrolled", y > 8);
    toTop.classList.toggle("show", y > 600);
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  const carousel = document.getElementById("heroCarousel");
  if (carousel && !reduce) requestAnimationFrame(() => requestAnimationFrame(() => carousel.classList.add("kb-on")));
})();

/* Roles: la descripción aparece dentro del mismo mosaico (sube desde abajo) */
(function () {
  const roles = {
    "Cámara": { en: "Camera",
      es_d: "Captura la imagen del proyecto: opera la cámara, encuadra y trabaja con el director de fotografía para lograr el look de cada escena.",
      en_d: "Captures the project's image: operates the camera, frames shots and works with the cinematographer to achieve the look of each scene." },
    "Sonido": { en: "Sound",
      es_d: "Graba y cuida el audio en set: diálogos, ambientes y ruido de fondo, con micrófonos, boom y mezcla en vivo.",
      en_d: "Records and protects on-set audio: dialogue, ambience and background noise, using microphones, boom and live mixing." },
    "Dirección": { en: "Direction",
      es_d: "Guía la visión creativa: dirige al elenco y al equipo, y toma las decisiones que dan forma a la historia en pantalla. Incluye asistencia de dirección.",
      en_d: "Guides the creative vision: directs cast and crew and makes the decisions that shape the story on screen. Includes assistant directing." },
    "Arte": { en: "Art",
      es_d: "Construye el mundo visual: escenografía, utilería, vestuario y ambientación para que cada espacio cuente la historia.",
      en_d: "Builds the visual world: sets, props, wardrobe and dressing so every space tells the story." },
    "Iluminación": { en: "Lighting",
      es_d: "Diseña y monta la luz de cada plano: crea atmósfera, da forma al sujeto y apoya la mirada del director de fotografía.",
      en_d: "Designs and sets up the light for every shot: creates mood, shapes the subject and supports the cinematographer's vision." },
    "Edición": { en: "Editing",
      es_d: "Da ritmo y sentido al material grabado: ordena planos, corta, agrega sonido y color hasta llegar al producto final.",
      en_d: "Gives rhythm and meaning to the footage: arranges shots, cuts, adds sound and color up to the final product." },
    "Producción": { en: "Production",
      es_d: "Hace que el rodaje suceda: organiza calendario, permisos, locaciones, logística y presupuesto, y mantiene al equipo coordinado.",
      en_d: "Makes the shoot happen: organizes schedule, permits, locations, logistics and budget, and keeps the crew coordinated." },
    "Crew junior": { en: "Junior crew",
      es_d: "Tu primer paso en un rodaje: apoyo en set con llamadas, listas y asistencia a los departamentos, mientras aprendés cómo funciona un día de producción.",
      en_d: "Your first step on a shoot: on-set support with calls, lists and help for the departments, while you learn how a production day works." }
  };
  const ui = {
    es: { select: "Seleccionar este rol →", close: "Cerrar" },
    en: { select: "Select this role →", close: "Close" }
  };
  const tiles = Array.from(document.querySelectorAll(".cat-tile[data-role]"));
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function renderBacks() {
    const l = state.lang;
    tiles.forEach((tile) => {
      const role = tile.dataset.role, r = roles[role];
      if (!r) return;
      const back = tile.querySelector(".cat-back");
      back.innerHTML = "";
      const close = document.createElement("button");
      close.type = "button"; close.className = "cat-back-close"; close.textContent = "×";
      close.setAttribute("aria-label", ui[l].close);
      const h = document.createElement("h4"); h.textContent = l === "en" ? r.en : role;
      const p = document.createElement("p"); p.textContent = l === "en" ? r.en_d : r.es_d;
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "cat-back-btn"; btn.textContent = ui[l].select;
      close.addEventListener("click", (e) => { e.stopPropagation(); setOpen(tile, false); });
      btn.addEventListener("click", (e) => { e.stopPropagation(); selectRole(role); });
      back.append(close, h, p, btn);
      back.inert = !tile.classList.contains("is-open");
    });
  }
  function setOpen(tile, open) {
    if (open) tiles.forEach((t) => t !== tile && setOpen(t, false));
    tile.classList.toggle("is-open", open);
    tile.setAttribute("aria-expanded", String(open));
    const back = tile.querySelector(".cat-back");
    back.setAttribute("aria-hidden", String(!open));
    back.inert = !open;
  }
  function selectRole(role) {
    const select = document.querySelector('#leadForm select[name="role"]');
    tiles.forEach((t) => setOpen(t, false));
    if (!select) return;
    select.value = role;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    const target = document.getElementById("contacto");
    if (target) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    select.classList.add("role-flash");
    setTimeout(() => select.classList.remove("role-flash"), 1800);
    const nameInput = document.querySelector('#leadForm input[name="name"]');
    setTimeout(() => nameInput && nameInput.focus({ preventScroll: true }), reduce ? 0 : 600);
  }

  tiles.forEach((tile) => {
    tile.addEventListener("click", () => setOpen(tile, !tile.classList.contains("is-open")));
    tile.addEventListener("keydown", (e) => {
      if (e.target !== tile) return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(tile, !tile.classList.contains("is-open")); }
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") tiles.forEach((t) => setOpen(t, false));
  });
  // Chips de otras secciones: llevan al mosaico del rol y lo abren
  document.querySelectorAll(".role-chip[data-role]").forEach((chip) =>
    chip.addEventListener("click", () => {
      const tile = tiles.find((t) => t.dataset.role === chip.dataset.role);
      if (!tile) return;
      tile.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      setTimeout(() => { setOpen(tile, true); tile.focus({ preventScroll: true }); }, reduce ? 0 : 450);
    })
  );
  document.querySelectorAll(".lang-btn").forEach((b) => b.addEventListener("click", renderBacks));
  renderBacks();
})();

/* Aviso de privacidad */
(function () {
  const dlg = document.getElementById("privacyDialog");
  if (!dlg) return;
  const close = () => dlg.close();
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-privacy]");
    if (!a) return;
    e.preventDefault();
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  });
  document.getElementById("privacyClose")?.addEventListener("click", close);
  document.getElementById("privacyOk")?.addEventListener("click", close);
  dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
})();