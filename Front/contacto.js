
const entradaNombre = document.getElementById("nombre");
const entradaCorreo = document.getElementById("correo");
const entradaTelefono = document.getElementById("telefono");
const entradaMensaje = document.getElementById("mensaje");

const errorNombre = document.getElementById("errorNombre");
const errorCorreo = document.getElementById("errorCorreo");
const errorTelefono = document.getElementById("errorTelefono");
const errorMensaje = document.getElementById("errorMensaje");

const formulario = document.getElementById("contacto");

formulario.addEventListener("submit", function(validacion) {
    validacion.preventDefault();

    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorTelefono.textContent = "";
    errorMensaje.textContent = "";

    let sonValidos = true;

    if (entradaNombre.value.trim() === "") {
        errorNombre.textContent = "El campo Nombre no puede estar vacio";
        sonValidos = false;
    } else if (/\d/.test(entradaNombre.value.trim())) {
        errorNombre.textContent = "El nombre solo puede contener letras";
        sonValidos = false;
    }

    if (entradaCorreo.value.trim() === "") {
        errorCorreo.textContent = "El campo Correo no puede estar vacio";
        sonValidos = false;
    } else if (!entradaCorreo.value.trim().includes("@")) {
        errorCorreo.textContent = "El correo debe incluir un @";
        sonValidos = false;
    }

    if (entradaTelefono.value.trim() === "") {
        errorTelefono.textContent = "El campo Teléfono no puede estar vacio";
        sonValidos = false;
    } else if (isNaN(entradaTelefono.value.trim())) {
        errorTelefono.textContent = "Debe contener solo numeros";
        sonValidos = false;
    } else if (entradaTelefono.value.trim().length !== 10) {
        errorTelefono.textContent = "El número debe tener exactamente 10 dígitos";
        sonValidos = false;
    }

    if (entradaMensaje.value.trim() === "") {
        errorMensaje.textContent = "El campo Mensaje no puede estar vacio";
        sonValidos = false;
    }

    if (sonValidos) {
        const alertaEnvio = document.getElementById("alertaExito");
        alertaEnvio.classList.remove("d-none");

        setTimeout(function() {
            
            formulario.submit();
        }, 1500);
    }
});