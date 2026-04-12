import { loadAppData } from "./data-loader.js";
import {
  buildServiceCardHtml,
  bindFavoriteButtons,
  updateFavoriteButton,
} from "./render-service-card.js";
import { toggleFavoriteService } from "./favorites.js";
import {
  isValidEmail,
  setFieldError,
  validateMinLength,
  validateRequired,
} from "./validation.js";

async function init() {
  const grid = document.getElementById("services-grid");
  const testimonialRoot = document.getElementById("testimonials-root");

  try {
    const data = await loadAppData();
    if (grid) {
      grid.innerHTML = data.services
        .map((s) => buildServiceCardHtml(s, { catalogMode: true, detailLink: true }))
        .join("");
      bindFavoriteButtons(grid, (id, btn) => {
        const on = toggleFavoriteService(id);
        updateFavoriteButton(btn, on);
      });
    }

    if (testimonialRoot && data.testimonials) {
      testimonialRoot.innerHTML = data.testimonials
        .map(
          (t) => `
        <article class="testimonial-card">
          <div class="testimonial-card__stars" aria-hidden="true">★★★★★</div>
          <p class="testimonial-card__quote">${escapeHtml(t.quote)}</p>
          <div class="testimonial-card__footer">
            <div class="testimonial-card__avatar">${escapeHtml(t.initials)}</div>
            <div>
              <div class="testimonial-card__name">${escapeHtml(t.name)}</div>
              <div class="testimonial-card__role">${escapeHtml(t.role)}</div>
            </div>
          </div>
        </article>`
        )
        .join("");
    }
  } catch (e) {
    console.error(e);
    if (grid) {
      grid.innerHTML =
        '<p class="empty-state">No se pudieron cargar los servicios. Usa un servidor local (por ejemplo <code>npx serve</code>) para abrir el proyecto.</p>';
    }
  }

  setupContactForm();
  setupCtaModal();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const company = form.querySelector('[name="company"]');
    const message = form.querySelector('[name="message"]');
    const errName = form.querySelector('[data-error="name"]');
    const errEmail = form.querySelector('[data-error="email"]');
    const errMsg = form.querySelector('[data-error="message"]');

    let ok = true;
    if (!validateRequired(name.value)) {
      setFieldError(name, errName, "El nombre es obligatorio.");
      ok = false;
    } else setFieldError(name, errName, "");

    if (!isValidEmail(email.value)) {
      setFieldError(email, errEmail, "Introduce un correo electrónico válido.");
      ok = false;
    } else setFieldError(email, errEmail, "");

    if (!validateMinLength(message.value, 10)) {
      setFieldError(
        message,
        errMsg,
        "El mensaje debe tener al menos 10 caracteres."
      );
      ok = false;
    } else setFieldError(message, errMsg, "");

    if (!ok) return;

    const box = document.getElementById("contact-form-status");
    if (box) {
      box.hidden = false;
      box.textContent = `Gracias, ${name.value.trim()}. Hemos recibido tu mensaje${
        company.value.trim() ? ` (${company.value.trim()})` : ""
      }. Te contactaremos pronto.`;
    }
    form.reset();
  });
}

function setupCtaModal() {
  const openBtn = document.getElementById("open-consult-modal");
  const overlay = document.getElementById("modal-consulta");
  const closeBtn = document.getElementById("close-modal-consulta");
  if (!openBtn || !overlay) return;

  openBtn.addEventListener("click", () => {
    overlay.classList.add("modal-overlay--open");
    overlay.querySelector("input,button")?.focus();
  });

  const close = () => overlay.classList.remove("modal-overlay--open");
  closeBtn?.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("modal-overlay--open"))
      close();
  });
}

init();
