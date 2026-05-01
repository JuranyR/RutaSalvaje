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

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];


registro.addEventListener("submit", function (evento) {

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
        errorNombre.textContent = "El campo Nombre no puede estar vacio";
        sonValidos = false;
    } else if (/\d/.test(inputNombre.value.trim())) {
        errorNombre.textContent = "El nombre solo puede contener letras";
        sonValidos = false;
    }

    if (inputCorreo.value.trim() === "") {
        errorCorreo.textContent = "El campo Correo no puede estar vacio";
        sonValidos = false;
    } else if (!inputCorreo.value.trim().includes("@")) {
        errorCorreo.textContent = "El correo debe incluir un @";
        sonValidos = false;
    }

    if (inputTelefono.value.trim() === "") {
        errorTelefono.textContent = "El campo Telefono no puede estar vacio";
        sonValidos = false;
    } else if (isNaN(inputTelefono.value.trim())) {
        errorTelefono.textContent = "Debe contener solo numeros";
        sonValidos = false;
    } else if (inputTelefono.value.trim().length !== 10) {
        errorTelefono.textContent = "El numero debe tener exactamente 10 digitos";
        sonValidos = false;
    }

    if (inputPassword.value.trim() === "") {
        errorPassword.textContent = "El campo contraseña no puede estar vacio";
        sonValidos = false;
    } else if(inputPassword.value.length<6) {
        errorPassword.textContent = "La contraseña debe tener mínimo 6 caracteres";
        sonValidos = false;

    } else if (inputPassword.value.trim() !== inputPassword2.value.trim()) {
        errorPassword.textContent = "Las contraseñas no son iguales";
        sonValidos = false;
    }

    if (inputContactoEmergencia.value.trim() === "") {
        errorContactoEmergencia.textContent = "El nombre del contacto no puede estar vacio";
        sonValidos = false;
    } else if (/\d/.test(inputContactoEmergencia.value.trim())) {
        errorContactoEmergencia.textContent = "El nombre solo puede contener letras";
        sonValidos = false;
    }

    if (inputParentescoEmergencia.value.trim() === "") {
        errorParentescoEmergencia.textContent = "El parentesco no puede estar vacio";
        sonValidos = false;
    } else if (/\d/.test(inputParentescoEmergencia.value.trim())) {
        errorParentescoEmergencia.textContent = "El parentesco solo puede contener letras";
        sonValidos = false;
    }

    if (inputTelefonoEmergencia.value.trim() === "") {
        errorTelefonoEmergencia.textContent = "El telefono de emergencia no puede estar vacio";
        sonValidos = false;
    } else if (isNaN(inputTelefonoEmergencia.value.trim())) {
        errorTelefonoEmergencia.textContent = "Debe contener solo numeros";
        sonValidos = false;
    } else if (inputTelefonoEmergencia.value.trim().length !== 10) {
        errorTelefonoEmergencia.textContent = "El numero debe tener exactamente 10 digitos";
        sonValidos = false;
    }

    if (sonValidos) {
        usuarios.push({
            nombre: inputNombre.value.trim(),
            correo: inputCorreo.value.trim(),
            telefono: inputTelefono.value.trim(),
            password: inputPassword.value.trim(),
            contactoEmergencia: inputContactoEmergencia.value.trim(),
            parentescoEmergencia: inputParentescoEmergencia.value.trim(),
            telefonoEmergencia: inputTelefonoEmergencia.value.trim()
        });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        alertaExito.classList.remove("d-none");

        setTimeout(function () {
            registro.reset();
            alertaExito.classList.add("d-none");
        }, 1500);
    }
});

const inputContrasena = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");


inputContrasena.addEventListener("input", function() {
    if (inputContrasena.value.length > 0) {
        togglePassword.classList.add("mostrar");
    } else {
        togglePassword.classList.remove("mostrar");
    }
});

inputContrasena2.addEventListener("input", function() {
    if (inputContrasena2.value.length > 0) {
        togglePassword2.classList.add("mostrar"); 
    } else {
        togglePassword2.classList.remove("mostrar");
    }
});


const inputContrasena2 = document.getElementById("password2");
const togglePassword2 = document.getElementById("togglePassword2");

inputContrasena2.addEventListener("input", function() {
    if (inputContrasena2.value.length > 0) {
        togglePassword2.classList.add("mostrar");
    } else {
        togglePassword2.classList.remove("mostrar");
    }
});

togglePassword2.addEventListener("click", function() {
    if(inputContrasena2.type === "password") {
        inputContrasena2.type = "text";
    } else {
        inputContrasena2.type = "password"
    }
});