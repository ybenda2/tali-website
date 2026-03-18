/* eslint-disable no-use-before-define */
(() => {
  const STUDIO = {
    name: "טלי בייקר",
    tagline: "סטודיו בוטיק לעיצוב פנים • תכנון • ליווי • הלבשה",
    instagramUrl: "",
    phone: "",
    email: "",
    addressLines: ["ישראל"],
  };

  // Drop real images into `assets/projects/<slug>/...` and update these paths.
  const PLACEHOLDER = "assets/images/placeholder.svg";

  /** @type {Array<{id:string,title:string,subtitle?:string,tags:string[],cover:string,images:string[]}>} */
  const PROJECTS = [
    {
      id: "farmhouseModern",
      title: "בית חווה מודרני",
      subtitle: "סלון • מטבח • פינת אוכל",
      tags: ["בתים"],
      cover: PLACEHOLDER,
      images: [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER],
    },
    {
      id: "urbanPenthouse",
      title: "פנטהאוז אורבני",
      subtitle: "חומריות טבעית • קווים נקיים",
      tags: ["דירות"],
      cover: PLACEHOLDER,
      images: [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER],
    },
    {
      id: "seaViewApartment",
      title: "דירה מול הים",
      subtitle: "אור • רכות • פרופורציות",
      tags: ["דירות"],
      cover: PLACEHOLDER,
      images: [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER],
    },
    {
      id: "jerusalemCalm",
      title: "שלווה ירושלמית",
      subtitle: "גוונים חמים • נגרות בהתאמה",
      tags: ["בתים"],
      cover: PLACEHOLDER,
      images: [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER],
    },
    {
      id: "industrialChicOffice",
      title: "שיק מתועש (משרדים)",
      subtitle: "חלל עבודה • פרקטיות • אופי",
      tags: ["מסחרי"],
      cover: PLACEHOLDER,
      images: [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER],
    },
    {
      id: "classicContemporary",
      title: "קלאסיקה עכשווית",
      subtitle: "שכבות • טקסטיל • איזון",
      tags: ["בתים"],
      cover: PLACEHOLDER,
      images: [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER],
    },
  ];

  const TAGS = ["הכל", "דירות", "בתים", "מסחרי"];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function init() {
    hydrateStudio();
    initMenu();
    initActiveNav();
    initFilters();
    renderProjects("הכל");
    initLightbox();
    initContactForm();
    initYear();
  }

  function hydrateStudio() {
    $("[data-studio-name]").textContent = STUDIO.name;
    $("[data-studio-tagline]").textContent = STUDIO.tagline;

    const ig = $("[data-instagram]");
    if (STUDIO.instagramUrl) {
      ig.href = STUDIO.instagramUrl;
      ig.style.display = "";
    } else {
      ig.style.display = "none";
    }

    const phone = $("[data-phone]");
    const email = $("[data-email]");
    const addr = $("[data-address]");

    if (STUDIO.phone) {
      phone.textContent = STUDIO.phone;
      phone.href = `tel:${STUDIO.phone.replace(/\s+/g, "")}`;
    } else {
      phone.closest("li").style.display = "none";
    }

    if (STUDIO.email) {
      email.textContent = STUDIO.email;
      email.href = `mailto:${STUDIO.email}`;
    } else {
      email.closest("li").style.display = "none";
    }

    addr.innerHTML = STUDIO.addressLines.map((l) => escapeHtml(l)).join("<br>");
  }

  function initMenu() {
    const btn = $("#menuBtn");
    const drawer = $("#drawer");

    btn.addEventListener("click", () => {
      const open = drawer.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });

    drawer.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      drawer.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("click", (e) => {
      if (!drawer.classList.contains("open")) return;
      if (drawer.contains(e.target) || btn.contains(e.target)) return;
      drawer.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  }

  function initActiveNav() {
    const links = $$('a[href^="#"]').filter((a) => a.getAttribute("href").length > 1);
    const targets = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    for (const link of links) {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    const setCurrent = () => {
      let currentId = "";
      for (const t of targets) {
        const top = t.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY >= top - 120) currentId = t.id;
      }
      for (const a of links) {
        a.setAttribute("aria-current", a.getAttribute("href") === `#${currentId}` ? "true" : "false");
      }
    };

    setCurrent();
    window.addEventListener("scroll", throttle(setCurrent, 120), { passive: true });
  }

  function initFilters() {
    const wrap = $("#filters");
    wrap.innerHTML = "";

    for (const tag of TAGS) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pill";
      btn.textContent = tag;
      btn.setAttribute("aria-pressed", tag === "הכל" ? "true" : "false");
      btn.addEventListener("click", () => {
        $$(".pill", wrap).forEach((p) => p.setAttribute("aria-pressed", p === btn ? "true" : "false"));
        renderProjects(tag);
      });
      wrap.appendChild(btn);
    }
  }

  function renderProjects(tag) {
    const grid = $("#projectsGrid");
    const list = tag === "הכל" ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(tag));
    grid.innerHTML = "";

    for (const p of list) {
      const card = document.createElement("article");
      card.className = "card";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `פתח גלריה: ${p.title}`);
      card.dataset.projectId = p.id;
      card.innerHTML = `
        <img src="${escapeAttr(p.cover)}" alt="${escapeAttr(p.title)}" loading="lazy">
        <div class="card-meta">
          <strong>${escapeHtml(p.title)}</strong>
          <span>${escapeHtml(p.subtitle || "")}</span>
        </div>
      `;

      card.addEventListener("click", () => openLightbox(p.id));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(p.id);
        }
      });

      grid.appendChild(card);
    }

    $("#projectsCount").textContent = `${list.length} פרויקטים`;
  }

  // Lightbox
  let lbState = {
    projectId: "",
    index: 0,
    lastFocus: null,
  };

  function initLightbox() {
    const overlay = $("#lightbox");
    const closeBtn = $("#lbClose");
    const prevBtn = $("#lbPrev");
    const nextBtn = $("#lbNext");

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", () => move(-1));
    nextBtn.addEventListener("click", () => move(1));

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!overlay.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") move(1);
      if (e.key === "ArrowRight") move(-1);
      if (e.key === "Tab") trapFocus(e, overlay);
    });
  }

  function openLightbox(projectId) {
    const project = PROJECTS.find((p) => p.id === projectId);
    if (!project) return;

    lbState.projectId = projectId;
    lbState.index = 0;
    lbState.lastFocus = document.activeElement;

    const overlay = $("#lightbox");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    $("#lbProjectTitle").textContent = project.title;
    $("#lbProjectMeta").textContent = `${project.images.length} תמונות`;

    renderThumbs(project);
    renderStage(project);

    // focus close by default
    $("#lbClose").focus();
  }

  function closeLightbox() {
    const overlay = $("#lightbox");
    if (!overlay.classList.contains("open")) return;

    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    const last = lbState.lastFocus;
    lbState = { projectId: "", index: 0, lastFocus: null };
    if (last && typeof last.focus === "function") last.focus();
  }

  function move(delta) {
    const project = PROJECTS.find((p) => p.id === lbState.projectId);
    if (!project) return;

    const n = project.images.length;
    lbState.index = (lbState.index + delta + n) % n;
    renderStage(project);
    syncThumbs();
  }

  function renderStage(project) {
    const img = $("#lbImage");
    const src = project.images[lbState.index];
    img.src = src;
    img.alt = project.title;
    $("#lbProjectMeta").textContent = `תמונה ${lbState.index + 1} מתוך ${project.images.length}`;
  }

  function renderThumbs(project) {
    const wrap = $("#lbThumbs");
    wrap.innerHTML = "";

    project.images.forEach((src, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `תמונה ${i + 1}`);
      b.setAttribute("aria-current", i === lbState.index ? "true" : "false");
      b.innerHTML = `<img src="${escapeAttr(src)}" alt="" loading="lazy">`;
      b.addEventListener("click", () => {
        lbState.index = i;
        renderStage(project);
        syncThumbs();
      });
      wrap.appendChild(b);
    });
  }

  function syncThumbs() {
    const wrap = $("#lbThumbs");
    const btns = $$("button", wrap);
    btns.forEach((b, i) => b.setAttribute("aria-current", i === lbState.index ? "true" : "false"));
    const active = btns[lbState.index];
    if (active) active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }

  function initContactForm() {
    const form = $("#contactForm");
    const copyBtn = $("#copyBtn");
    const mailBtn = $("#mailBtn");
    const toast = $("#toast");

    const buildMessage = () => {
      const name = $("#fName").value.trim();
      const phone = $("#fPhone").value.trim();
      const email = $("#fEmail").value.trim();
      const msg = $("#fMsg").value.trim();
      return [
        `שם: ${name || "-"}`,
        `טלפון: ${phone || "-"}`,
        `אימייל: ${email || "-"}`,
        "",
        msg || "-",
      ].join("\n");
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      toastMsg("טיפ: באתר סטטי לחלוטין אין שליחה אוטומטית. אפשר להעתיק הודעה או לפתוח מייל.");
    });

    copyBtn.addEventListener("click", async () => {
      const text = buildMessage();
      try {
        await navigator.clipboard.writeText(text);
        toastMsg("ההודעה הועתקה ללוח.");
      } catch {
        toastMsg("לא הצלחתי להעתיק (ייתכן שחוסם דפדפן). אפשר להעתיק ידנית.");
      }
    });

    mailBtn.addEventListener("click", () => {
      const subject = encodeURIComponent(`פנייה מהאתר — ${STUDIO.name}`);
      const body = encodeURIComponent(buildMessage());
      const to = STUDIO.email || "";
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });

    function toastMsg(text) {
      toast.textContent = text;
      toast.hidden = false;
      window.clearTimeout(toast._t);
      toast._t = window.setTimeout(() => (toast.hidden = true), 3600);
    }
  }

  function initYear() {
    const el = $("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  // Helpers
  function throttle(fn, ms) {
    let t = 0;
    return () => {
      const now = Date.now();
      if (now - t < ms) return;
      t = now;
      fn();
    };
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replaceAll("\n", " ");
  }

  function trapFocus(e, root) {
    const focusables = $$(
      'button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])',
      root
    ).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();

