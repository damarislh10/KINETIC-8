import { isValidEmail, setFieldError, validateRequired } from "./validation.js";

const form = document.getElementById("admin-login-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.querySelector('[name="email"]');
    const password = form.querySelector('[name="password"]');
    const errEmail = form.querySelector('[data-error="email"]');
    const errPass = form.querySelector('[data-error="password"]');
    const status = document.getElementById("admin-login-status");

    let ok = true;
    if (!validateRequired(email.value) || !isValidEmail(email.value)) {
      setFieldError(
        email,
        errEmail,
        "Introduce un correo corporativo válido (ej. nombre@kinetic.com)."
      );
      ok = false;
    } else setFieldError(email, errEmail, "");

    const pass = String(password.value || "");
    if (pass.length < 8) {
      setFieldError(
        password,
        errPass,
        "La contraseña debe tener al menos 8 caracteres."
      );
      ok = false;
    } else setFieldError(password, errPass, "");

    if (!ok) return;

    if (status) {
      status.hidden = false;
      status.textContent =
        "Validación correcta (prototipo). En producción aquí iría la autenticación real.";
    }
  });
}
