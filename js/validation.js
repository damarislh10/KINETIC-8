/**
 * Validaciones de formulario — futuro: Validators de Angular + Reactive Forms
 */

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function isValidEmail(value) {
  const v = String(value || "").trim();
  return EMAIL_RE.test(v);
}

export function setFieldError(inputEl, errorEl, message) {
  if (!inputEl || !errorEl) return;
  const has = Boolean(message);
  inputEl.classList.toggle("input--error", has);
  inputEl.setAttribute("aria-invalid", has ? "true" : "false");
  errorEl.textContent = message || "";
}

export function validateRequired(value) {
  return String(value || "").trim().length > 0;
}

export function validateMinLength(value, min) {
  return String(value || "").trim().length >= min;
}
