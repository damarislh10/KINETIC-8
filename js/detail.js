import { loadAppData, getServiceById } from "./data-loader.js";
import { mediaClass } from "./render-service-card.js";

function detailVisualClasses(variant) {
  const m = mediaClass(variant);
  const detail = m.replace("service-card__media", "detail-visual");
  return `detail-visual ${detail}`;
}
import {
  toggleFavoriteService,
  isFavoriteService,
} from "./favorites.js";
import {
  isValidEmail,
  setFieldError,
  validateRequired,
} from "./validation.js";

function getQueryId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function render(service) {
  document.title = `${service.title} · KINETIC`;

  const heroBadge = document.getElementById("detail-badge");
  const heroTitle = document.getElementById("detail-hero-title");
  const heroDesc = document.getElementById("detail-hero-desc");
  const visual = document.getElementById("detail-visual");

  if (heroBadge) heroBadge.textContent = service.badge;
  if (heroTitle) {
    const suffix = service.heroTitleSuffix || "";
    heroTitle.innerHTML = `${escapeHtml(service.heroTitlePrefix)} <span class="highlight">${escapeHtml(service.heroTitleHighlight)}</span>${escapeHtml(suffix)}`;
  }
  if (heroDesc) heroDesc.textContent = service.description;
  const bc = document.getElementById("detail-bc-title");
  if (bc) bc.textContent = service.title.toUpperCase();
  if (visual) {
    visual.className = detailVisualClasses(service.imageVariant);
  }

  const overview = document.getElementById("detail-overview");
  if (overview) overview.textContent = service.description;

  const capRoot = document.getElementById("detail-capabilities");
  if (capRoot && service.capabilities) {
    capRoot.innerHTML = service.capabilities
      .map(
        (c) => `
      <div class="cap-item">
        <h3>${escapeHtml(c.title)}</h3>
        <p>${escapeHtml(c.description)}</p>
      </div>`
      )
      .join("");
  }

  const favBtn = document.getElementById("detail-fav-btn");
  if (favBtn) {
    syncFavButton(favBtn, service.id);
    favBtn.addEventListener("click", () => {
      toggleFavoriteService(service.id);
      syncFavButton(favBtn, service.id);
    });
  }

  const consultBtn = document.getElementById("detail-contact-consult");
  consultBtn?.addEventListener("click", () => {
    window.location.href = `index.html#contacto`;
  });
}

function syncFavButton(btn, id) {
  const on = isFavoriteService(id);
  btn.innerHTML = on
    ? '<span aria-hidden="true">♥</span> En favoritos'
    : '<span aria-hidden="true">♡</span> Añadir a Favoritos';
  btn.classList.toggle("btn--outline", !on);
  btn.classList.toggle("btn--primary", on);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function init() {
  const id = getQueryId();
  const main = document.getElementById("detail-main");

  if (!id) {
    if (main) {
      main.innerHTML =
        '<div class="container section"><p class="empty-state">Servicio no especificado. <a href="catalogo.html">Volver al catálogo</a></p></div>';
    }
    return;
  }

  try {
    const data = await loadAppData();
    const service = getServiceById(data, id);
    if (!service) {
      if (main) {
        main.innerHTML =
          '<div class="container section"><p class="empty-state">Servicio no encontrado. <a href="catalogo.html">Catálogo</a></p></div>';
      }
      return;
    }
    render(service);
  } catch (e) {
    console.error(e);
    if (main) {
      main.innerHTML =
        '<div class="container section"><p class="empty-state">Error al cargar el servicio.</p></div>';
    }
  }

  const form = document.getElementById("detail-quick-contact");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.querySelector('[name="email"]');
    const err = form.querySelector('[data-error="email"]');
    if (!validateRequired(email.value) || !isValidEmail(email.value)) {
      setFieldError(email, err, "Correo no válido.");
      return;
    }
    setFieldError(email, err, "");
    alert("Solicitud enviada (demo). Un consultor contactará pronto.");
    form.reset();
  });
}

init();
