

const btnContacto = document.getElementById("contacto");
const mensajesError = document.getElementById("mesnajesError");

btnContacto.addEventListener("submit", function (validacion) {

    validacion.preventDefault();

    const entradaNombre = document.getElementById("nombre").value.trim();
    const entradaCorreo = document.getElementById("correo").value.trim();
    const entradaTelefono = document.getElementById("telefono").value.trim();
    const entradaMensaje = document.getElementById("mensaje").value.trim();

    if (entradaNombre === "" || entradaCorreo === "" || entradaTelefono === "") {
        mensajesError.textContent = "Datos obligatorios";
        return;
    }
    
    if (/\d/.test(entradaNombre)) {
        mensajesError.textContent = "El nombre no puede ser numerico";
        return;
    }

    if (isNaN(entradaTelefono)) {
        mensajesError.textContent = "El telefono debe ser numerico";
        return;
    }

    if (!entradaCorreo.includes("@")) {
        mensajesError.textContent = "Correo no valido";
        return;
    }

    if (entradaMensaje === "") {
        mensajesError.textContent = "El mensaje es obligatorio";
        return;
    }

    mensajesError.textContent = "Formulario enviado correctamente";

    btnContacto.submit();
    btnContacto.reset();   
    
});