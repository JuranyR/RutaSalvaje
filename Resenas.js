if (!requireAdmin()) {
    throw new Error("Acceso restringido a administradores");
}

const listaResenas = document.getElementById("listaResenas");
const inputBuscarResena = document.querySelector("input[type='search']");
const btnBuscarResena = document.querySelector(".btn-outline-success");

let resenas = [];
let filtroResena = "";

function estrellasResena(calificacion = 0) {
    const valor = Math.max(0, Math.min(5, Math.round(Number(calificacion || 0))));
    return "\u2605".repeat(valor) + "\u2606".repeat(5 - valor);
}

function fechaResena(fecha) {
    if (!fecha) return "Sin fecha";
    return new Date(fecha).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

async function cargarResenasAdmin() {
    listaResenas.innerHTML = `<div class="col-12"><p class="text-muted">Cargando reseñas...</p></div>`;

    try {
        const response = await fetch(`${RUTA_API_URL}/resenas`, { headers: getAuthHeaders() });
        if (!response.ok) throw await apiError(response, "No se pudieron cargar las reseñas");

        resenas = await response.json();
        mostrarResenasAdmin();
    } catch (error) {
        console.error(error);
        listaResenas.innerHTML = `<div class="col-12">${estadoVacioHtml(error.message)}</div>`;
    }
}

function mostrarResenasAdmin() {
    const busqueda = normalizarTexto(filtroResena);
    const resultado = resenas.filter(resena => {
        const texto = normalizarTexto(`${resena.nombreUsuario} ${resena.nombrePlan} ${resena.comentario}`);
        return texto.includes(busqueda);
    });

    if (resultado.length === 0) {
        listaResenas.innerHTML = `<div class="col-12">${estadoVacioHtml("No se encontraron reseñas.")}</div>`;
        return;
    }

    listaResenas.innerHTML = resultado.map(resena => `
        <div class="col-md-4">
            <div class="card shadow-sm h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between gap-2 mb-2">
                        <h5 class="mb-0">${resena.nombrePlan || "Plan"}</h5>
                        <span class="review-stars">${estrellasResena(resena.calificacion)}</span>
                    </div>
                    <p class="mb-1"><strong>Usuario:</strong> ${resena.nombreUsuario || "Sin usuario"}</p>
                    <p class="mb-1"><strong>Fecha:</strong> ${fechaResena(resena.fechaCreacion)}</p>
                    <p class="text-muted">${resena.comentario || ""}</p>
                    <button class="btn btn-sm btn-eliminar" type="button" data-id="${resena.id}">Eliminar</button>
                </div>
            </div>
        </div>
    `).join("");
}

async function eliminarResena(id) {
    const confirmado = await confirmarAccion({
        titulo: "Eliminar reseña",
        mensaje: "La reseña se quitará del panel y de la vista pública.",
        confirmar: "Eliminar"
    });
    if (!confirmado) return;

    try {
        const response = await fetch(`${RUTA_API_URL}/resenas/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw await apiError(response, "No se pudo eliminar la reseña");
        await cargarResenasAdmin();
        mostrarToast("Reseña eliminada correctamente.", "ok");
    } catch (error) {
        console.error(error);
        mostrarToast(error.message, "error");
    }
}

inputBuscarResena?.addEventListener("input", () => {
    filtroResena = inputBuscarResena.value;
    mostrarResenasAdmin();
});

btnBuscarResena?.addEventListener("click", (event) => {
    event.preventDefault();
    filtroResena = inputBuscarResena.value;
    mostrarResenasAdmin();
});

listaResenas?.addEventListener("click", (event) => {
    const btnEliminar = event.target.closest(".btn-eliminar");
    if (btnEliminar) eliminarResena(btnEliminar.dataset.id);
});

cargarResenasAdmin();