const btnContacto = document.getElementById("contacto");
const mensajesError = document.getElementById("mensajesError");

btnContacto.addEventListener("submit", function (validacion) {

    validacion.preventDefault();

    mensajesError.textContent = "";

    const entradaNombre = document.getElementById("nombre").value.trim();
    const entradaCorreo = document.getElementById("correo").value.trim();
    const entradaTelefono = document.getElementById("telefono").value.trim();
    const entradaMensaje = document.getElementById("mensaje").value.trim();

    if (entradaNombre === "" || entradaCorreo === "" || entradaTelefono === "") {
        mensajesError.style.color = "red";
        mensajesError.textContent = "Datos obligatorios";
        return;
    }

    if (isNaN(entradaTelefono)) {
        mensajesError.style.color = "red";
        mensajesError.textContent = "El telefono debe ser numerico";
        return;
    }

    if (!entradaCorreo.includes("@")) {
        mensajesError.style.color = "red";
        mensajesError.textContent = "Correo no valido";
        return;
    }

    if (entradaMensaje === "") {
        mensajesError.style.color = "red";
        mensajesError.textContent = "El mensaje es obligatorio";
        return;
    }

    mensajesError.style.color = "green";
    mensajesError.textContent = "Formulario enviado correctamente";

    btnContacto.submit();
});