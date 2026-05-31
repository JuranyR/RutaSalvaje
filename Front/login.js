const loginForm = document.getElementById("loginForm");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("loginPassword");
const iconPassword = document.getElementById("iconPassword");

const errorCorreo = document.getElementById("errorLoginCorreo");
const errorPassword = document.getElementById("errorLoginPassword");
const alertaGeneral = document.getElementById("alertaError");
const alertaExito = document.getElementById("alertaExito");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

togglePassword.addEventListener("click", function () {

    const type =
        passwordInput.getAttribute("type") === "password"
            ? "text"
            : "password";

    passwordInput.setAttribute("type", type);

    iconPassword.classList.toggle("bi-eye");
    iconPassword.classList.toggle("bi-eye-slash");
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorCorreo.textContent = "";
    errorPassword.textContent = "";
    alertaGeneral.classList.add("d-none");
    alertaGeneral.textContent = "";

    const email = document.getElementById("loginCorreo").value.trim();
    const password = passwordInput.value.trim();

    let esValido = true;

    if (!email) {
        errorCorreo.textContent = "El correo electrónico es obligatorio.";
        esValido = false;
    } else if (!emailRegex.test(email)) {
        errorCorreo.textContent = "Por favor, ingresa un correo electrónico válido.";
        esValido = false;
    }

    if (!password) {
        errorPassword.textContent = "La contraseña es obligatoria.";
        esValido = false;
    } else if (password.length < 4) { // Puedes ajustar el mínimo según tus requerimientos
        errorPassword.textContent = "La contraseña debe tener al menos 4 caracteres.";
        esValido = false;
    }

    if (!esValido) return;

    try {
        const response = await fetch(`${RUTA_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.toLowerCase(), password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || data.error || "Usuario o contraseña incorrectos");
        }

        alertaExito.classList.remove("d-none");
        alertaExito.className = "rs-inline-message ok";
        
        const usuario = guardarSesion(data);
        
        setTimeout(() => {
            window.location.href = usuario.rol === "ADMIN" ? "panel-de-control.html" : "index.html";
        }, 1000); 

    } catch (err) {
        alertaGeneral.textContent = err.message;
        alertaGeneral.classList.remove("d-none");
        alertaGeneral.className = "rs-inline-message error";
    }
});