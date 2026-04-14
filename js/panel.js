/**
 * Panel de gestión de servicios — futuro: componente Angular con CRUD real
 */
import { loadAppData } from "./data-loader.js";
import { validateRequired, setFieldError } from "./validation.js";

const CATEGORY_BADGES = {
  consultoria: "Consultoría",
  tecnologia: "Tecnología",
  logistica: "Logística",
  energia: "Energía",
};

const CATEGORY_KEYS = ["consultoria", "tecnologia", "logistica", "energia"];

let services = [];
let nextKntId = 1000;

function generateId() {
  nextKntId++;
  return `KNT-${nextKntId}`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function guessCategoryKey(title) {
  const t = title.toLowerCase();
  if (t.includes("logíst") || t.includes("cadena") || t.includes("suminist")) return "logistica";
  if (t.includes("energía") || t.includes("energi") || t.includes("sostenib")) return "energia";
  if (t.includes("consultor") || t.includes("liderazgo") || t.includes("strateg")) return "consultoria";
  return "tecnologia";
}

function renderTable() {
  const tbody = document.getElementById("panel-table-body");
  const totalBadge = document.getElementById("panel-total");
  if (!tbody) return;

  if (totalBadge) totalBadge.textContent = `${services.length} Total`;

  tbody.innerHTML = services
    .map(
      (s, i) => `
    <tr data-index="${i}">
      <td>
        <div class="panel-thumb ${s.image ? "" : "panel-thumb--gradient"}" ${s.image ? "" : `style="background: linear-gradient(135deg, #0a2540, #1565c0)"`}>
          ${s.image ? `<img src="${escapeHtml(s.image)}" alt="${escapeHtml(s.title)}" />` : ""}
        </div>
      </td>
      <td>
        <div class="panel-service-name">${escapeHtml(s.title)}</div>
        <div class="panel-service-id">ID: #${escapeHtml(s._panelId || s.id)}</div>
      </td>
      <td>
        <span class="panel-category-badge panel-category-badge--${s.categoryKey || "tecnologia"}">
          ${escapeHtml(CATEGORY_BADGES[s.categoryKey] || s.category || "Tecnología")}
        </span>
      </td>
      <td>
        <div class="panel-actions">
          <button type="button" class="panel-action-btn panel-action-btn--edit" data-edit="${i}" title="Editar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button type="button" class="panel-action-btn panel-action-btn--delete" data-delete="${i}" title="Eliminar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>`
    )
    .join("");
}

function setupForm() {
  const form = document.getElementById("panel-add-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const titleInput = form.querySelector('[name="title"]');
    const descInput = form.querySelector('[name="description"]');
    const imgInput = form.querySelector('[name="image"]');
    const errTitle = form.querySelector('[data-error="title"]');
    const errDesc = form.querySelector('[data-error="description"]');

    let ok = true;

    if (!validateRequired(titleInput.value)) {
      setFieldError(titleInput, errTitle, "El título es obligatorio.");
      ok = false;
    } else {
      setFieldError(titleInput, errTitle, "");
    }

    if (!validateRequired(descInput.value) || descInput.value.trim().length < 10) {
      setFieldError(descInput, errDesc, "La descripción debe tener al menos 10 caracteres.");
      ok = false;
    } else {
      setFieldError(descInput, errDesc, "");
    }

    if (!ok) return;

    const catKey = guessCategoryKey(titleInput.value);
    const newService = {
      id: `custom-${Date.now()}`,
      _panelId: generateId(),
      title: titleInput.value.trim(),
      shortDescription: descInput.value.trim(),
      description: descInput.value.trim(),
      category: CATEGORY_BADGES[catKey],
      categoryKey: catKey,
      image: imgInput.value.trim() || "",
      badge: "NUEVO SERVICIO",
      heroTitlePrefix: "",
      heroTitleHighlight: titleInput.value.trim(),
      heroTitleSuffix: "",
      imageVariant: "cyan",
      capabilities: [],
    };

    services.unshift(newService);
    renderTable();
    form.reset();
  });
}

function setupTableActions() {
  const tbody = document.getElementById("panel-table-body");
  if (!tbody) return;

  tbody.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest("[data-delete]");
    if (deleteBtn) {
      const idx = parseInt(deleteBtn.getAttribute("data-delete"), 10);
      if (!isNaN(idx) && services[idx]) {
        const name = services[idx].title;
        if (confirm(`¿Eliminar servicio "${name}"?`)) {
          services.splice(idx, 1);
          renderTable();
        }
      }
      return;
    }

    const editBtn = e.target.closest("[data-edit]");
    if (editBtn) {
      const idx = parseInt(editBtn.getAttribute("data-edit"), 10);
      if (!isNaN(idx) && services[idx]) {
        const s = services[idx];
        const newTitle = prompt("Nuevo título:", s.title);
        if (newTitle && newTitle.trim()) {
          s.title = newTitle.trim();
          renderTable();
        }
      }
    }
  });
}

async function init() {
  try {
    const data = await loadAppData();
    services = data.services.map((s, i) => ({
      ...s,
      _panelId: `KNT-${9000 + i * 100 + Math.floor(Math.random() * 99)}`,
    }));
    renderTable();
  } catch (e) {
    console.error(e);
    const tbody = document.getElementById("panel-table-body");
    if (tbody) {
      tbody.innerHTML =
        '<tr><td colspan="4" style="text-align:center;padding:2rem;color:var(--color-muted)">Error al cargar servicios.</td></tr>';
    }
  }

  setupForm();
  setupTableActions();
}

init();
