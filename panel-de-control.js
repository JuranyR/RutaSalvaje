if (!requireAdmin()) {
    throw new Error("Acceso restringido a administradores");
}

// Inicialización de elementos del DOM y el Offcanvas de Bootstrap
const offcanvasElement = document.getElementById("offcanvasNuevoPlan");
const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);

const form = document.getElementById("formActividad");
const categoria = document.getElementById("categoria");
const nuevaCategoriaContainer = document.getElementById("nuevaCategoriaContainer");
const lista = document.getElementById("listaActividades");
const inputBuscar = document.querySelector("input[type='search']");
const btnBuscar = document.querySelector(".btn-outline-success");
const filtroCategoriaSelect = document.getElementById("filtroCategoria");
const filtroDificultadSelect = document.getElementById("filtroDificultad");
const filtroEstadoSelect = document.getElementById("filtroEstado");
const listaContactos = document.getElementById("listaContactos");
const btnActualizarContactos = document.getElementById("btnActualizarContactos");

let planes = [];
let mensajesContacto = [];
let editarPlan = null;
let filtroBuscar = "";
let filtroCategoria = "";
let filtroDificultad = "";
let filtroEstado = "";

document.getElementById("imagen")?.addEventListener("change", (e) => {
    const labelText = e.target.nextElementSibling?.nextElementSibling;
    if (labelText && e.target.files[0]) {
        labelText.textContent = e.target.files[0].name;
    }
});

function tipoPlanDesdeCategoria(valor) {
    const categoriaNormalizada = normalizarTexto(valor);
    if (categoriaNormalizada.includes("aventura")) return "AVENTURA";
    if (categoriaNormalizada.includes("romant")) return "ROMANTICO";
    if (categoriaNormalizada.includes("familiar")) return "FAMILIAR";
    if (categoriaNormalizada.includes("extremo")) return "EXTREMO";
    return "EXTREMO";
}

function categoriaDesdeTipoPlan(valor) {
    const tipo = String(valor || "AVENTURA").toUpperCase();
    if (tipo === "AVENTURA") return "Aventura";
    if (tipo === "ROMANTICO") return "Romántico";
    if (tipo === "FAMILIAR") return "Familiar";
    if (tipo === "EXTREMO") return "Extremo";
    return "Aventura";
}

function actividadesTexto(plan) {
    if (Array.isArray(plan.actividades)) return plan.actividades.join(", ");
    return plan.actividades || "No especificadas";
}

function escaparHtml(valor) {
    return String(valor || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function cargarPlanes() {
    try {
        const response = await fetch(`${RUTA_API_URL}/planes`);
        if (!response.ok) throw await apiError(response, "Error al obtener planes");

        planes = await response.json(); 

        if (!planes || planes.length === 0) {
            lista.innerHTML = `<div class="col-12">${estadoVacioHtml("Aún no tienes planes creados.")}</div>`;
            return;
        }

        mostrarPlanes();
    } catch (error) {
        console.error("Error al cargar planes:", error);
        if (lista) {
            lista.innerHTML = `<div class="col-12">${estadoVacioHtml(error.message)}</div>`;
        }
    }
}

async function cargarContactos() {
    if (!listaContactos) return;

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

function mostrarPlanes() {
    lista.innerHTML = "";

    const resultado = planes.filter(plan => {
        const nombre = normalizarTexto(plan.nombre);
        const categoriaPlan = planCategoria(plan);
        const dificultadPlan = planDificultad(plan);
        const estadoPlan = planEstadoTexto(plan);

        const pasaBuscar = nombre.includes(normalizarTexto(filtroBuscar));
        const pasaCategoria = !filtroCategoria || categoriaPlan === filtroCategoria;
        const pasaDificultad = !filtroDificultad || dificultadPlan === filtroDificultad;
        const pasaEstado = !filtroEstado || normalizarTexto(estadoPlan).toUpperCase() === filtroEstado;

        return pasaBuscar && pasaCategoria && pasaDificultad && pasaEstado;
    });

    if (resultado.length === 0) {
        lista.innerHTML = `<div class="col-12">${estadoVacioHtml("No se encontraron planes con esos filtros.")}</div>`;
        return;
    }

    resultado.forEach(plan => {
        lista.innerHTML += `
            <div class="col-md-4">
                <div class="card shadow-sm h-100">
                    <img src="${planImagen(plan)}" alt="${plan.nombre}">
                    <div class="card-body">
                        <h5>${plan.nombre}</h5>
                        <p>${plan.descripcion}</p>
                        <p><strong>Incluye:</strong> ${actividadesTexto(plan)}</p>
                        <span class="badge bg-success">${categoriaDesdeTipoPlan(plan.tipoPlan)}</span>
                        <br><br>
                        <strong>Dificultad:</strong> ${formatoEnum(planDificultad(plan))}<br>
                        <strong>Estado:</strong> ${planEstadoTexto(plan)}<br>
                        <strong>Precio:</strong> $${formatoPrecio(precioPlan(plan))}<br>
                        <strong>Descuento:</strong> ${Number(plan.descuentoPorcentaje || 0)}%
                        <hr>
                        <button class="btn btn-sm me-1 btn-editar" type="button" data-id="${plan.id}">Editar</button>
                        <button class="btn btn-sm me-1 btn-toggle-estado" type="button" data-id="${plan.id}">
                            ${plan.estado === false ? "Activar" : "Inactivar"}
                        </button>
                        <button class="btn btn-sm btn-eliminar" type="button" data-id="${plan.id}">Eliminar</button>
                    </div>
                </div>
            </div>`;
    });
}

function limpiarFormulario() {
    editarPlan = null;
    form.reset();
    document.getElementById("imagen").required = true;
    
    const labelText = document.querySelector("#offcanvasNuevoPlan .fw-bold.d-block");
    if (labelText) labelText.textContent = "Haz clic para seleccionar una imagen";

    bsOffcanvas.hide();
}

function planDesdeFormulario(imagenActual = "") {
    const categoriaFinal = categoria.value === "nueva"
        ? document.getElementById("nuevaCategoria").value
        : categoria.value;

    return {
        nombre: document.getElementById("nombre").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        precio: Number(document.getElementById("precio").value),
        descuentoPorcentaje: Number(document.getElementById("descuento").value || 0),
        tipoPlan: tipoPlanDesdeCategoria(categoriaFinal),
        dificultad: document.getElementById("dificultad").value.toUpperCase(),
        estado: document.getElementById("estado").value === "Activa",
        actividades: document.getElementById("actividades").value.trim(),
        imagen: imagenActual
    };
}

async function crearPlan() {
    const file = document.getElementById("imagen").files[0];
    if (!file) {
        mostrarToast("Selecciona una imagen para crear el plan.", "info");
        return;
    }

    const plan = planDesdeFormulario();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("nombre", plan.nombre);
    formData.append("descripcion", plan.descripcion);
    formData.append("precio", plan.precio);
    formData.append("descuentoPorcentaje", plan.descuentoPorcentaje);
    formData.append("tipoPlan", plan.tipoPlan);
    formData.append("dificultad", plan.dificultad);
    formData.append("estado", plan.estado);
    formData.append("actividades", plan.actividades);

    const response = await fetch(`${RUTA_API_URL}/planes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData
    });

    if (!response.ok) throw await apiError(response, "No se pudo crear el plan");
}

async function actualizarPlan() {

    const file = document.getElementById("imagen").files[0];

    const planActual = planes.find(
        plan => String(plan.id) === String(editarPlan)
    );

    const plan = planDesdeFormulario(planActual?.imagen || "");

    const formData = new FormData();

    if (file) {
        formData.append("file", file);
    }

    formData.append("nombre", plan.nombre);
    formData.append("descripcion", plan.descripcion);
    formData.append("precio", plan.precio);
    formData.append("descuentoPorcentaje", plan.descuentoPorcentaje);
    formData.append("tipoPlan", plan.tipoPlan);
    formData.append("dificultad", plan.dificultad);
    formData.append("estado", plan.estado);
    formData.append("actividades", plan.actividades);

    const response = await fetch(`${RUTA_API_URL}/planes/${editarPlan}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: formData
    });

    if (!response.ok) {
        throw await apiError(response, "No se pudo actualizar el plan");
    }
}

async function cambiarEstadoPlan(id) {

    const planActual = planes.find(
        plan => String(plan.id) === String(id)
    );

    if (!planActual) return;

    const formData = new FormData();

    formData.append("nombre", planActual.nombre);
    formData.append("descripcion", planActual.descripcion);
    formData.append("precio", planActual.precio);

    formData.append(
        "descuentoPorcentaje",
        planActual.descuentoPorcentaje || 0
    );

    formData.append("tipoPlan", planActual.tipoPlan);

    formData.append(
        "dificultad",
        planActual.dificultad
    );

    formData.append(
        "estado",
        !planActual.estado
    );

    formData.append(
        "actividades",
        planActual.actividades
    );

    const response = await fetch(`${RUTA_API_URL}/planes/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: formData
    });

    if (!response.ok) {
        throw await apiError(
            response,
            "No se pudo cambiar el estado del plan"
        );
    }

    await cargarPlanes();
}

async function eliminarPlan(id) {
    const confirmado = await confirmarAccion({
        titulo: "Eliminar plan",
        mensaje: "El plan dejará de aparecer y no se podrá recuperar desde esta vista.",
        confirmar: "Eliminar"
    });
    if (!confirmado) return;

    try {
        const response = await fetch(`${RUTA_API_URL}/planes/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw await apiError(response, "No se pudo eliminar el plan");
        await cargarPlanes();
    } catch (error) {
        console.error(error);
        mostrarToast(error.message, "error");
    }
}

function editandoPlan(id) {
    const plan = planes.find(item => String(item.id) === String(id));
    if (!plan) return;

    document.getElementById("nombre").value = plan.nombre;
    document.getElementById("descripcion").value = plan.descripcion;
    document.getElementById("precio").value = plan.precio;
    document.getElementById("descuento").value = plan.descuentoPorcentaje || 0;
    document.getElementById("categoria").value = categoriaDesdeTipoPlan(plan.tipoPlan);
    document.getElementById("dificultad").value = formatoEnum(planDificultad(plan));
    document.getElementById("estado").value = planEstadoTexto(plan);
    document.getElementById("actividades").value = actividadesTexto(plan);
    document.getElementById("imagen").required = false;

    editarPlan = id;
    
    // Muestra el Offcanvas con los datos mapeados
    bsOffcanvas.show();
}

categoria?.addEventListener("change", () => {
    nuevaCategoriaContainer.style.display = categoria.value === "nueva" ? "block" : "none";
});

form?.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    try {
        if (editarPlan) {
            await actualizarPlan();
            mostrarToast("Plan actualizado correctamente.", "ok");
        } else {
            await crearPlan();
            mostrarToast("Plan agregado correctamente.", "ok");
        }

        limpiarFormulario();
        await cargarPlanes();
    } catch (error) {
        console.error(error);
        mostrarToast(error.message, "error");
    }
});

inputBuscar?.addEventListener("input", () => {
    filtroBuscar = inputBuscar.value;
    mostrarPlanes();
});

btnBuscar?.addEventListener("click", (e) => {
    e.preventDefault();
    filtroBuscar = inputBuscar.value;
    mostrarPlanes();
});

filtroCategoriaSelect?.addEventListener("change", () => {
    filtroCategoria = filtroCategoriaSelect.value;
    mostrarPlanes();
});

filtroDificultadSelect?.addEventListener("change", () => {
    filtroDificultad = filtroDificultadSelect.value;
    mostrarPlanes();
});

filtroEstadoSelect?.addEventListener("change", () => {
    filtroEstado = filtroEstadoSelect.value;
    mostrarPlanes();
});

lista?.addEventListener("click", (e) => {
    const btnEditar = e.target.closest(".btn-editar");
    const btnToggleEstado = e.target.closest(".btn-toggle-estado");
    const btnEliminar = e.target.closest(".btn-eliminar");

    if (btnEditar) editandoPlan(btnEditar.dataset.id);
    if (btnToggleEstado) {
        cambiarEstadoPlan(btnToggleEstado.dataset.id).catch(error => {
            console.error(error);
            mostrarToast(error.message, "error");
        });
    }
    if (btnEliminar) eliminarPlan(btnEliminar.dataset.id);
});

listaContactos?.addEventListener("click", (e) => {
    const btnEliminar = e.target.closest(".btn-eliminar-contacto");
    if (btnEliminar) eliminarContacto(btnEliminar.dataset.id);
});

btnActualizarContactos?.addEventListener("click", cargarContactos);

cargarPlanes();
cargarContactos();
