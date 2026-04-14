const form = document.getElementById("admin-login-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = document.getElementById("admin-login-status");
    const btn = form.querySelector('[type="submit"]');

    if (btn) btn.textContent = "Accediendo…";

    if (status) {
      status.hidden = false;
      status.textContent = "Acceso concedido. Redirigiendo al panel…";
    }

    setTimeout(() => {
      window.location.href = "panel.html";
    }, 600);
  });
}

