import { loadAppData } from "./data-loader.js";
import {
  getFavoriteTeamIds,
  toggleFavoriteTeam,
  isFavoriteTeam,
} from "./favorites.js";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const toneClass = {
  orange: "principle-card__icon--orange",
  blue: "principle-card__icon--blue",
  pink: "principle-card__icon--pink",
  purple: "principle-card__icon--purple",
};

function renderPrinciples(list) {
  const root = document.getElementById("principles-root");
  if (!root || !list) return;
  root.innerHTML = list
    .map(
      (p) => `
    <article class="principle-card">
      <div class="principle-card__icon ${toneClass[p.tone] || toneClass.orange}">${escapeHtml(p.title.charAt(0))}</div>
      <h3 class="service-card__title">${escapeHtml(p.title)}</h3>
      <p class="service-card__desc">${escapeHtml(p.description)}</p>
    </article>`
    )
    .join("");
}

const HEART = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

function renderTeam(list) {
  const root = document.getElementById("team-root");
  if (!root || !list) return;
  root.innerHTML = list
    .map((m) => {
      const fav = isFavoriteTeam(m.id);
      return `
    <article class="team-card" data-team-id="${escapeHtml(m.id)}">
      <button type="button" class="fav-toggle ${fav ? "fav-toggle--on" : "fav-toggle--off"}" data-team-fav="${escapeHtml(m.id)}" aria-label="Favorito">${HEART}</button>
      <div class="team-card__avatar">${escapeHtml(m.initials)}</div>
      <h3 class="team-card__name">${escapeHtml(m.name)}</h3>
      <p class="team-card__role">${escapeHtml(m.role)}</p>
    </article>`;
    })
    .join("");

  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-team-fav]");
    if (!btn) return;
    const id = btn.getAttribute("data-team-fav");
    if (!id) return;
    toggleFavoriteTeam(id);
    const on = isFavoriteTeam(id);
    btn.classList.remove("fav-toggle--on", "fav-toggle--off");
    btn.classList.add(on ? "fav-toggle--on" : "fav-toggle--off");
  });
}

async function init() {
  try {
    const data = await loadAppData();
    renderPrinciples(data.principles);
    renderTeam(data.team);
  } catch (e) {
    console.error(e);
  }

  const prev = document.getElementById("team-prev");
  const next = document.getElementById("team-next");
  const track = document.getElementById("team-carousel");
  if (prev && next && track) {
    prev.addEventListener("click", () => {
      track.scrollBy({ left: -320, behavior: "smooth" });
    });
    next.addEventListener("click", () => {
      track.scrollBy({ left: 320, behavior: "smooth" });
    });
  }
}

init();
