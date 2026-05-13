const errorCorreo = document.getElementById("errorLoginCorreo");
const errorPassword = document.getElementById("errorLoginPassword");
const inputCorreo = document.getElementById("loginCorreo");
const inputPassword = document.getElementById("loginPassword");
const alertaError = document.getElementById("alertaError");
const alertaExito = document.getElementById("alertaExito");
const loginForm = document.getElementById("loginForm");

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

loginForm.addEventListener("submit", function (evento) {

    evento.preventDefault();

    errorCorreo.textContent = "";
    errorPassword.textContent = "";
    alertaError.classList.add("d-none");
    alertaExito.classList.add("d-none");

    let esValido = true;

    if (inputCorreo.value.trim() === "") {
        errorCorreo.textContent = "El campo correo no puede estar vacío";
        esValido = false;
    }

    if (inputPassword.value.trim() === "") {
        errorPassword.textContent = "El campo contraseña no puede estar vacío";
        esValido = false;
    }

    if (esValido) {
        const usuarioEncontrado = usuarios.find(user => user.correo === inputCorreo.value.trim() && user.password === inputPassword.value.trim());

        if (usuarioEncontrado) {
            localStorage.setItem("sesionActiva", JSON.stringify(usuarioEncontrado));
            
            alertaExito.classList.remove("d-none");

            setTimeout(function () {
                window.location.href = "index.html"; 
            }, 1500);

        } else {
            alertaError.classList.remove("d-none");
            alertaError.textContent = "Correo o contraseña incorrectos";
        }
    }
});