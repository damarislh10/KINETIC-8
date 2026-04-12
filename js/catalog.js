import { loadAppData } from "./data-loader.js";
import {
  buildServiceCardHtml,
  bindFavoriteButtons,
  updateFavoriteButton,
} from "./render-service-card.js";
import { toggleFavoriteService, getFavoriteServiceIds } from "./favorites.js";

const CATEGORY_MAP = {
  todos: () => true,
  consultoria: (s) => s.categoryKey === "consultoria",
  tecnologia: (s) => s.categoryKey === "tecnologia",
  logistica: (s) => s.categoryKey === "logistica",
  energia: (s) => s.categoryKey === "energia",
};

let allServices = [];
let activeCategory = "todos";
let favoritesOnly = false;

function getUrlState() {
  const params = new URLSearchParams(window.location.search);
  favoritesOnly = params.get("filter") === "favorites";
  const cat = params.get("category");
  if (cat && CATEGORY_MAP[cat]) activeCategory = cat;
}

function setActivePills() {
  document.querySelectorAll("[data-filter-cat]").forEach((btn) => {
    const v = btn.getAttribute("data-filter-cat");
    const active = !favoritesOnly && activeCategory === v;
    btn.classList.toggle("filter-pill--active", active);
  });
  document
    .querySelector("[data-filter-favorites]")
    ?.classList.toggle("filter-pill--active", favoritesOnly);
}

function applyFilters() {
  const favIds = new Set(getFavoriteServiceIds());
  const pred = CATEGORY_MAP[activeCategory] || CATEGORY_MAP.todos;
  const list = allServices.filter((s) => {
    if (favoritesOnly && !favIds.has(s.id)) return false;
    return pred(s);
  });

  const grid = document.getElementById("catalog-grid");
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML =
      '<p class="empty-state">No hay servicios en esta vista. Marca favoritos en las tarjetas o cambia el filtro.</p>';
    return;
  }

  grid.innerHTML = list
    .map((s) => buildServiceCardHtml(s, { catalogMode: true, detailLink: true }))
    .join("");

  bindFavoriteButtons(grid, (id, btn) => {
    const on = toggleFavoriteService(id);
    updateFavoriteButton(btn, on);
    if (favoritesOnly) applyFilters();
  });
}

function navigateState() {
  const params = new URLSearchParams();
  if (favoritesOnly) params.set("filter", "favorites");
  else if (activeCategory !== "todos") params.set("category", activeCategory);
  const q = params.toString();
  const url = q ? `${window.location.pathname}?${q}` : window.location.pathname;
  window.history.replaceState({}, "", url);
  setActivePills();
  applyFilters();
}

async function init() {
  getUrlState();
  try {
    const data = await loadAppData();
    allServices = data.services;
  } catch (e) {
    console.error(e);
    const grid = document.getElementById("catalog-grid");
    if (grid) {
      grid.innerHTML =
        '<p class="empty-state">Error al cargar datos. Abre el sitio con un servidor HTTP local.</p>';
    }
    return;
  }

  document.querySelectorAll("[data-filter-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      favoritesOnly = false;
      activeCategory = btn.getAttribute("data-filter-cat") || "todos";
      navigateState();
    });
  });

  const favBtn = document.querySelector("[data-filter-favorites]");
  favBtn?.addEventListener("click", () => {
    favoritesOnly = true;
    navigateState();
  });

  setActivePills();
  applyFilters();
}

init();
