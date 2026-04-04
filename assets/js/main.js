/* eslint-disable no-use-before-define */
(() => {
  const STUDIO = window.TALI.studio;
  const PLACEHOLDER = window.TALI.placeholder;
  const PROJECTS = window.TALI.projects;
  const { hydrateStudio, initMenu, initYear, escapeHtml } = window.TALI_CHROME;

  const TAGS = ["הכל", "דירות", "בתים"];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function init() {
    hydrateStudio();
    initMenu();
    initActiveNav();
    initFilters();
    renderProjects("הכל");
    initContactForm();
    initYear();
    initHeroSlideshow();
  }

  const HERO_DEFAULT_ALT = "חלל מגורים ומטבח בעיצוב בוטיק מודרני";
  const HERO_DEFAULT_URL = "assets/images/hero-interior.png";

  function buildHeroSlides() {
    const list = [];
    const seen = new Set();
    for (const p of PROJECTS) {
      if (!p.cover || p.cover === PLACEHOLDER) continue;
      if (seen.has(p.cover)) continue;
      seen.add(p.cover);
      list.push({ url: p.cover, alt: `צילום מהפרויקט: ${p.title}` });
    }
    const heroEntry = { url: HERO_DEFAULT_URL, alt: HERO_DEFAULT_ALT };
    const sequence = list.length ? [heroEntry, ...list] : [heroEntry];
    if (sequence.length < 2 && list.length === 1) sequence.push(list[0]);
    return sequence;
  }

  function heroWhenDecoded(img, fn) {
    if (img.decode) {
      img
        .decode()
        .then(fn)
        .catch(fn);
    } else if (img.complete && img.naturalWidth) fn();
    else img.addEventListener("load", fn, { once: true });
  }

  function initHeroSlideshow() {
    const root = document.querySelector(".hero-slides");
    if (!root) return;
    const imgs = Array.from(root.querySelectorAll(".hero-slide"));
    if (imgs.length < 2) return;

    const sequence = buildHeroSlides();
    if (sequence.length < 2) {
      imgs[0].src = sequence[0].url;
      imgs[0].alt = sequence[0].alt;
      imgs[0].classList.add("is-active");
      imgs[1].remove();
      return;
    }

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    for (const s of sequence) {
      const pre = new Image();
      pre.src = s.url;
    }

    let visible = 0;
    const activeAlt = () => sequence[visible].alt;

    function applyAlts() {
      imgs.forEach((im, i) => {
        const on = im.classList.contains("is-active");
        im.alt = on ? activeAlt() : "";
      });
    }

    imgs[0].src = sequence[0].url;
    imgs[1].src = sequence[1 % sequence.length].url;
    imgs[0].classList.add("is-active");
    imgs[1].classList.remove("is-active");
    applyAlts();

    if (prefersReduced) return;

    let timer = 0;
    let locked = false;
    /* זמן תצוגה בין מעברים — ארוך מהדהייה כדי שהקרוסלה תרגיש רגועה ולא בולטת */
    const intervalMs = 4800;

    function clearTimer() {
      if (timer) window.clearInterval(timer);
      timer = 0;
    }

    function step() {
      if (locked) return;
      const nextIdx = (visible + 1) % sequence.length;
      const inactive = imgs.find((im) => !im.classList.contains("is-active"));
      if (!inactive) return;

      const show = () => {
        imgs.forEach((im) => im.classList.toggle("is-active", im === inactive));
        visible = nextIdx;
        applyAlts();
        locked = false;
      };

      locked = true;
      inactive.src = sequence[nextIdx].url;
      heroWhenDecoded(inactive, show);
    }

    function start() {
      clearTimer();
      timer = window.setInterval(step, intervalMs);
    }

    function onVisibility() {
      if (document.hidden) clearTimer();
      else start();
    }

    start();
    document.addEventListener("visibilitychange", onVisibility, { passive: true });
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

    if (list.length === 0) {
      $("#projectsCount").textContent = "0 פרויקטים";
      return;
    }

    function makeCard(p) {
      const card = document.createElement("a");
      card.className = "card";
      card.href = `project.html?id=${encodeURIComponent(p.id)}`;
      card.setAttribute("aria-label", `צפייה בפרויקט: ${p.title}`);
      const subtitleLine = p.subtitle ? `<span>${escapeHtml(p.subtitle)}</span>` : "";
      card.innerHTML = `
        <img src="${escapeAttr(p.cover)}" alt="${escapeAttr(p.title)}" loading="lazy">
        <div class="card-meta">
          <strong>${escapeHtml(p.title)}</strong>
          ${subtitleLine}
        </div>
      `;
      return card;
    }

    for (const p of list) grid.appendChild(makeCard(p));

    $("#projectsCount").textContent = `${list.length} פרויקטים`;
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
      const subject = $("#fSubject").value.trim();
      const loc = $("#fLocation").value.trim();
      const msg = $("#fMsg").value.trim();
      return [
        `שם: ${name || "-"}`,
        `טלפון: ${phone || "-"}`,
        `אימייל: ${email || "-"}`,
        `נושא: ${subject || "-"}`,
        `מיקום / פרויקט: ${loc || "-"}`,
        "",
        msg || "-",
      ].join("\n");
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      toastMsg(
        "האתר סטטי — אין שליחה אוטומטית. השתמשו ב״העתקה ללוח״ או ב״פתיחת מייל״ כדי לשלוח את הטופס."
      );
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
      const sub =
        $("#fSubject").value.trim() || `פנייה מהאתר — ${STUDIO.name}`;
      const subject = encodeURIComponent(sub);
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

  function throttle(fn, ms) {
    let t = 0;
    return () => {
      const now = Date.now();
      if (now - t < ms) return;
      t = now;
      fn();
    };
  }

  function escapeAttr(s) {
    return escapeHtml(s).replaceAll("\n", " ");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
