/**
 * Plantilla de tarjeta de servicio — futuro: template Angular + @for
 */
import { isFavoriteService } from "./favorites.js";

const HEART_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

export function mediaClass(variant) {
  const map = {
    cyan: "service-card__media--cyan",
    navy: "service-card__media--navy",
    violet: "service-card__media--violet",
    teal: "service-card__media--teal",
    orange: "service-card__media--orange",
    green: "service-card__media--green",
  };
  return map[variant] || "service-card__media--cyan";
}

export function buildServiceCardHtml(service, options = {}) {
  const { detailLink = true, catalogMode = false } = options;
  const fav = isFavoriteService(service.id);
  const favClass = fav ? "fav-toggle fav-toggle--on" : "fav-toggle fav-toggle--off";
  const detailHref = `servicio.html?id=${encodeURIComponent(service.id)}`;
  const desc = catalogMode ? service.shortDescription : service.shortDescription;

  return `
    <article class="service-card" data-service-id="${service.id}">
      <div class="service-card__media ${mediaClass(service.imageVariant)}">
        ${service.image ? `<img class="service-card__img" src="${service.image}" alt="${escapeHtml(service.title)}" loading="lazy" />` : ""}
        <div class="service-card__pattern" aria-hidden="true"></div>
        <span class="service-card__badge">${escapeHtml(service.category)}</span>
        <button type="button" class="${favClass}" data-fav-toggle="${service.id}" aria-label="${fav ? "Quitar de favoritos" : "Añadir a favoritos"}" aria-pressed="${fav}">${HEART_SVG}</button>
      </div>
      <div class="service-card__body">
        <h3 class="service-card__title">${escapeHtml(service.title)}</h3>
        <p class="service-card__desc">${escapeHtml(desc)}</p>
        ${
          detailLink
            ? `<a class="service-card__link" href="${detailHref}">Ver Detalle →</a>`
            : ""
        }
      </div>
    </article>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function bindFavoriteButtons(container, onToggle) {
  container.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-fav-toggle]");
    if (!btn || !container.contains(btn)) return;
    e.preventDefault();
    const id = btn.getAttribute("data-fav-toggle");
    if (id) onToggle(id, btn);
  });
}

export function updateFavoriteButton(btn, isFav) {
  btn.classList.remove("fav-toggle--on", "fav-toggle--off");
  btn.classList.add(isFav ? "fav-toggle--on" : "fav-toggle--off");
  btn.setAttribute("aria-pressed", String(isFav));
  btn.setAttribute(
    "aria-label",
    isFav ? "Quitar de favoritos" : "Añadir a favoritos"
  );
}
