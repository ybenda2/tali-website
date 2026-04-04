/* eslint-disable no-use-before-define */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function hydrateStudio() {
    const STUDIO = window.TALI.studio;
    $$("[data-studio-name]").forEach((el) => {
      el.textContent = STUDIO.name;
    });
    const tag = $("[data-studio-tagline]");
    if (tag) tag.textContent = STUDIO.tagline;

    $$("[data-instagram]").forEach((ig) => {
      if (STUDIO.instagramUrl) {
        ig.href = STUDIO.instagramUrl;
        ig.style.display = "";
      } else {
        const wrap = ig.closest("li") || ig;
        if (wrap.tagName === "LI") wrap.style.display = "none";
        else ig.style.display = "none";
      }
    });

    $$("[data-facebook]").forEach((fb) => {
      if (STUDIO.facebookUrl) {
        fb.href = STUDIO.facebookUrl;
        fb.style.display = "";
      } else {
        const wrap = fb.closest("li") || fb;
        if (wrap.tagName === "LI") wrap.style.display = "none";
        else fb.style.display = "none";
      }
    });

    $$("[data-phone]").forEach((phone) => {
      if (STUDIO.phone) {
        phone.textContent = STUDIO.phone;
        phone.href = `tel:${STUDIO.phone.replace(/[\s-]+/g, "")}`;
      } else {
        const lip = phone.closest("[data-contact-line]") || phone.closest("li");
        if (lip) lip.style.display = "none";
        else phone.style.display = "none";
      }
    });

    $$("[data-email]").forEach((email) => {
      if (STUDIO.email) {
        email.textContent = STUDIO.email;
        email.href = `mailto:${STUDIO.email}`;
      } else {
        const lie = email.closest("[data-contact-line]") || email.closest("li");
        if (lie) lie.style.display = "none";
        else email.style.display = "none";
      }
    });

    const addr = $("[data-address]");
    if (addr) {
      addr.innerHTML = STUDIO.addressLines.map((l) => escapeHtml(l)).join("<br>");
    }

    const inlineRow = $("[data-contact-inline]");
    if (inlineRow) {
      const emailLine = inlineRow.querySelector("[data-email-line]");
      const phoneLine = inlineRow.querySelector("[data-phone-line]");
      const sep = inlineRow.querySelector("[data-contact-sep]");
      if (emailLine) emailLine.hidden = !STUDIO.email;
      if (phoneLine) phoneLine.hidden = !STUDIO.phone;
      if (sep) sep.hidden = !(STUDIO.email && STUDIO.phone);
      inlineRow.hidden = !(STUDIO.email || STUDIO.phone);
    }
  }

  function initMenu() {
    const btn = $("#menuBtn");
    const drawer = $("#drawer");
    if (!btn || !drawer) return;

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

  function initYear() {
    const el = $("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  window.TALI_CHROME = {
    hydrateStudio,
    initMenu,
    initYear,
    escapeHtml,
    $,
    $$,
  };
})();
