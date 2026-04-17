const btnContacto = document.getElementById("contacto");
const mensajesError = document.getElementById("mensajesError");

btnContacto.addEventListener("submit", function (validacion) {

    validacion.preventDefault();

    mensajesError.textContent = "";

    const entradaNombre = document.getElementById("nombre");
    const entradaCorreo = document.getElementById("correo");
    const entradaTelefono = document.getElementById("telefono");
    const entradaMensaje = document.getElementById("mensaje")

    const LimpiarError = document.querySelector(".error-mensaje");
    if (LimpiarError) {
        LimpiarError.remove();
    }
    if (entradaNombre.value.trim() === "") {
        const htmlError = '<span class="error-mensaje" style="color: red; font-size: 12px;">El nombre es obligatorio</span>';        
        entradaNombre.parentElement.insertAdjacentHTML('afterend', htmlError);
        return;
    }

    if (/\d/.test(entradaNombre.value.trim())) {
        const htmlError = '<span class="error-mensaje" style="color: red; font-size: 12px;">El nombre no debe contener numeros</span>';        
        entradaNombre.parentElement.insertAdjacentHTML('afterend', htmlError);
        return;
    }

    if (entradaCorreo.value.trim() === "") {
        const htmlError = '<span class="error-mensaje" style="color: red; font-size: 12px;">El correo es obligatorio</span>';        
        entradaCorreo.parentElement.insertAdjacentHTML('afterend', htmlError);
        return;
    }

    if (!entradaCorreo.value.trim().includes("@") && entradaCorreo.value.trim() !== "") {
        const htmlError = '<span class="error-mensaje" style="color: red; font-size: 12px;">Correo no valido</span>';        
        entradaCorreo.parentElement.insertAdjacentHTML('afterend', htmlError);
        return;
    }

    if (entradaTelefono.value.trim() === "") {
        const htmlError = '<span class="error-mensaje" style="color: red; font-size: 12px;">El telefono es obligatorio</span>';        
        entradaTelefono.parentElement.insertAdjacentHTML('afterend', htmlError);
        return;
    }

    if (isNaN(entradaTelefono.value.trim()) && entradaTelefono.value.trim() !== "") {
        const htmlError = '<span class="error-mensaje" style="color: red; font-size: 12px;">El telefono debe ser numerico</span>';        
        entradaTelefono.parentElement.insertAdjacentHTML('afterend', htmlError);
        return;
    }

    if (entradaMensaje.value.trim() === "") {
        const htmlError = '<span class="error-mensaje" style="color: red; font-size: 12px;">El mensaje es obligatorio</span>';        
        entradaMensaje.parentElement.insertAdjacentHTML('afterend', htmlError);
        return;
    }

    mensajesError.style.color = "green";
    mensajesError.textContent = "Formulario enviado correctamente";
    
    btnContacto.submit();
    btnContacto.reset();

});

document.querySelectorAll("#contacto input, #contacto textarea")
    .forEach(campo => {
        campo.addEventListener("input", () => {
            mensajesError.textContent = "";
        });
});