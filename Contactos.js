if (!requireAdmin()) {
    throw new Error("Acceso restringido a administradores");
}

const listaContactos = document.getElementById("listaContactos");
const btnActualizarContactos = document.getElementById("btnActualizarContactos");
let mensajesContacto = [];

function escaparHtml(valor) {
    return String(valor || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function cargarContactos() {
    if (!listaContactos) return;
    listaContactos.innerHTML = estadoVacioHtml("Cargando mensajes...");

    try {
        const response = await fetch(`${RUTA_API_URL}/contactos`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw await apiError(response, "No se pudieron cargar los mensajes de contacto");

        mensajesContacto = await response.json();
        mostrarContactos();
    } catch (error) {
        console.error("Error al cargar contactos:", error);
        listaContactos.innerHTML = estadoVacioHtml(error.message);
    }
}

function mostrarContactos() {
    if (!listaContactos) return;

    if (!mensajesContacto || mensajesContacto.length === 0) {
        listaContactos.innerHTML = estadoVacioHtml("Todavía no hay mensajes de contacto.");
        return;
    }

    listaContactos.innerHTML = mensajesContacto.map(mensaje => `
        <article class="contacto-card">
            <div class="contacto-card__header">
                <div>
                    <h6>${escaparHtml(mensaje.nombre)}</h6>
                    <a href="mailto:${escaparHtml(mensaje.email)}">${escaparHtml(mensaje.email)}</a>
                </div>
                <button class="btn btn-sm btn-eliminar-contacto" type="button" data-id="${mensaje.id}">Eliminar</button>
            </div>
            <p class="contacto-card__telefono">${escaparHtml(mensaje.telefono)}</p>
            <p class="contacto-card__mensaje">${escaparHtml(mensaje.mensaje)}</p>
        </article>
    `).join("");
}

async function eliminarContacto(id) {
    const confirmado = await confirmarAccion({
        titulo: "Eliminar mensaje",
        mensaje: "Este mensaje de contacto se eliminará del panel.",
        confirmar: "Eliminar"
    });
    if (!confirmado) return;

    try {
        const response = await fetch(`${RUTA_API_URL}/contactos/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw await apiError(response, "No se pudo eliminar el mensaje");

        mostrarToast("Mensaje eliminado correctamente.", "ok");
        await cargarContactos();
    } catch (error) {
        console.error(error);
        mostrarToast(error.message, "error");
    }
}

listaContactos?.addEventListener("click", (event) => {
    const btnEliminar = event.target.closest(".btn-eliminar-contacto");
    if (btnEliminar) eliminarContacto(btnEliminar.dataset.id);
});

btnActualizarContactos?.addEventListener("click", cargarContactos);
cargarContactos();
