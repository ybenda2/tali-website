/* eslint-disable no-use-before-define */
(() => {
  const { hydrateStudio, initMenu, initYear, escapeHtml } = window.TALI_CHROME;

  function init() {
    hydrateStudio();
    initMenu();
    initYear();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const project = window.TALI.projects.find((p) => p.id === id);

    if (!project) {
      window.location.replace("index.html#projects");
      return;
    }

    document.title = `${project.title} | ${window.TALI.studio.name}`;

    const h1 = document.getElementById("projectTitle");
    if (h1) h1.textContent = project.title;

    const bodyEl = document.getElementById("projectBody");
    if (bodyEl) {
      const raw = project.description || "תיאור הפרויקט יתעדכן בקרוב.";
      const paragraphs = raw
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean);
      bodyEl.innerHTML = paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
    }

    const gallery = document.getElementById("projectGallery");
    if (gallery) {
      gallery.innerHTML = "";
      project.images.forEach((src, i) => {
        const fig = document.createElement("figure");
        fig.className = "project-photo";
        const img = document.createElement("img");
        img.src = src;
        img.alt = `${project.title} — תמונה ${i + 1}`;
        img.loading = i < 2 ? "eager" : "lazy";
        fig.appendChild(img);
        gallery.appendChild(fig);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
