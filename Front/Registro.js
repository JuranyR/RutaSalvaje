const errorNombre = document.getElementById("errorNombre");
const errorCorreo = document.getElementById("errorCorreo");
const errorTelefono = document.getElementById("errorTelefono");
const errorPassword = document.getElementById("errorPassword");
const errorContactoEmergencia = document.getElementById("errorContactoEmergencia");
const errorParentescoEmergencia = document.getElementById("errorParentescoEmergencia");
const errorTelefonoEmergencia = document.getElementById("errorTelefonoEmergencia");

const inputNombre = document.getElementById("nombre");
const inputCorreo = document.getElementById("correo");
const inputTelefono = document.getElementById("telefono");
const inputPassword = document.getElementById("password");
const inputPassword2 = document.getElementById("password2");
const inputContactoEmergencia = document.getElementById("contactoEmergencia");
const inputParentescoEmergencia = document.getElementById("parentescoEmergencia");
const inputTelefonoEmergencia = document.getElementById("telefonoEmergencia");

const alertaExito = document.getElementById("alertaExito");

const registro = document.getElementById("registro");

registro.addEventListener("submit", async function (evento) {

    evento.preventDefault();

    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorTelefono.textContent = "";
    errorPassword.textContent = "";
    errorContactoEmergencia.textContent = "";
    errorParentescoEmergencia.textContent = "";
    errorTelefonoEmergencia.textContent = "";

    let sonValidos = true;

    if (inputNombre.value.trim() === "") {
        errorNombre.textContent = "El campo Nombre no puede estar vacío";
        sonValidos = false;
    } else if (/\d/.test(inputNombre.value.trim())) {
        errorNombre.textContent = "El nombre solo puede contener letras";
        sonValidos = false;
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (inputCorreo.value.trim() === "") {
        errorCorreo.textContent = "El campo Correo no puede estar vacío";
        sonValidos = false;
    } else if (!correoRegex.test(inputCorreo.value.trim())) {
        errorCorreo.textContent = "Correo inválido";
        sonValidos = false;
    }

    if (inputTelefono.value.trim() === "") {
        errorTelefono.textContent = "El campo Teléfono no puede estar vacío";
        sonValidos = false;
    } else if (isNaN(inputTelefono.value.trim())) {
        errorTelefono.textContent = "Debe contener solo números";
        sonValidos = false;
    } else if (inputTelefono.value.trim().length !== 10) {
        errorTelefono.textContent = "Debe tener exactamente 10 dígitos";
        sonValidos = false;
    }

    if (inputPassword.value.trim() === "") {
        errorPassword.textContent = "La contraseña es obligatoria";
        sonValidos = false;
    } else if (inputPassword.value.length < 8) {
        errorPassword.textContent = "Debe tener mínimo 8 caracteres";
        sonValidos = false;
    } else if (inputPassword.value.trim() !== inputPassword2.value.trim()) {
        errorPassword.textContent = "Las contraseñas no coinciden";
        sonValidos = false;
    }

    if (inputContactoEmergencia.value.trim() === "") {
        errorContactoEmergencia.textContent = "El contacto de emergencia es obligatorio";
        sonValidos = false;
    } else if (/\d/.test(inputContactoEmergencia.value.trim())) {
        errorContactoEmergencia.textContent = "Solo puede contener letras";
        sonValidos = false;
    }

    if (inputParentescoEmergencia.value.trim() === "") {
        errorParentescoEmergencia.textContent = "El parentesco es obligatorio";
        sonValidos = false;
    }

    if (inputTelefonoEmergencia.value.trim() === "") {
        errorTelefonoEmergencia.textContent = "El teléfono de emergencia es obligatorio";
        sonValidos = false;
    } else if (isNaN(inputTelefonoEmergencia.value.trim())) {
        errorTelefonoEmergencia.textContent = "Debe contener solo números";
        sonValidos = false;
    } else if (inputTelefonoEmergencia.value.trim().length !== 10) {
        errorTelefonoEmergencia.textContent = "Debe tener exactamente 10 dígitos";
        sonValidos = false;
    }

    if (!sonValidos) return;

    const usuario = {
        nombre: inputNombre.value.trim(),
        email: inputCorreo.value.trim().toLowerCase(),
        password: inputPassword.value.trim(),
        telefono: inputTelefono.value.trim(),
        nombreEmergencia: inputContactoEmergencia.value.trim(),
        telefonoEmergencia: inputTelefonoEmergencia.value.trim(),
        parentesco: inputParentescoEmergencia.value.trim()
    };

    try {

        const response = await fetch(`${RUTA_API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.message ||
                "No fue posible registrar el usuario"
            );
        }

        alertaExito.classList.remove("d-none");
        mostrarToast("Registro exitoso. Te llevaremos al inicio de sesión.", "ok");

        setTimeout(() => {
            registro.reset();
            window.location.href = "./login.html";
        }, 1500);

    } catch (error) {

        console.error(error);
        mostrarToast(error.message, "error");

    }

});

const togglePassword1 = document.getElementById("togglePassword1");
const togglePassword2 = document.getElementById("togglePassword2");

const icon1 = document.getElementById("iconPassword1");
const icon2 = document.getElementById("iconPassword2");

togglePassword1.addEventListener("click", () => {

    const oculta = inputPassword.type === "password";
    inputPassword.type = oculta ? "text" : "password";

    icon1.classList.toggle("bi-eye");
    icon1.classList.toggle("bi-eye-slash");

});

togglePassword2.addEventListener("click", () => {

    const oculta = inputPassword2.type === "password";
    inputPassword2.type = oculta ? "text" : "password";

    icon2.classList.toggle("bi-eye");
    icon2.classList.toggle("bi-eye-slash");

});