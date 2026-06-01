if (!requireAdmin()) {
    throw new Error("Acceso restringido a administradores");
}

// Inicialización de elementos del DOM y el Offcanvas de Bootstrap
const offcanvasElement = document.getElementById("offcanvasNuevoPlan");
const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);

offcanvasElement.addEventListener("hidden.bs.offcanvas", () => limpiarFormulario(false));

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
    const file = e.target.files[0];
    const errorImagen = document.getElementById("errorImagen");
    const dropzone = document.getElementById("dropzoneImagen");
    const preview = document.getElementById("previewImagen");
    const icono = document.getElementById("iconoImagen");
    const textoImagen = document.getElementById("textoImagen");

    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
        if (errorImagen) { errorImagen.innerHTML = '<i class="bi bi-exclamation-circle-fill me-1"></i>La imagen no debe superar 1 MB.'; errorImagen.style.display = "block"; }
        if (dropzone) dropzone.style.borderColor = "#ff4d4d";
        if (preview) { preview.src = ""; preview.style.display = "none"; }
        if (icono) icono.style.display = "";
        if (textoImagen) textoImagen.textContent = "Haz clic para seleccionar una imagen";
        return;
    }

    // Archivo válido
    if (errorImagen) errorImagen.style.display = "none";
    if (dropzone) dropzone.style.borderColor = "#443022";
    if (textoImagen) textoImagen.textContent = file.name;

    const reader = new FileReader();
    reader.onload = ev => {
        if (preview) { preview.src = ev.target.result; preview.style.display = "block"; }
        if (icono) icono.style.display = "none";
    };
    reader.readAsDataURL(file);
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
    if (tipo === "AVENTURA") return "AVENTURA";
    if (tipo === "ROMANTICO") return "ROMANTICO";
    if (tipo === "FAMILIAR") return "FAMILIAR";
    if (tipo === "EXTREMO") return "EXTREMO";
    return "AVENTURA";
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
                    <div class="card-body d-flex flex-column">
                        <h5>${plan.nombre}</h5>
                        <p>${plan.descripcion}</p>
                        <p><strong>Incluye:</strong> ${actividadesTexto(plan)}</p>
                        <span class="badge bg-success">${categoriaDesdeTipoPlan(plan.tipoPlan)}</span>
                        <br><br>
                        <div style="display:grid; grid-template-columns: auto 1fr; gap: 2px 10px; font-size:0.85rem;">
                            <strong>Dificultad:</strong><span>${formatoEnum(planDificultad(plan))}</span>
                            <strong>Estado:</strong><span>${planEstadoTexto(plan)}</span>
                            <strong>Precio:</strong><span>$${formatoPrecio(precioPlan(plan))}</span>
                            <strong>Descuento:</strong><span>${Number(plan.descuentoPorcentaje || 0)}%</span>
                        </div>
                        <div class="mt-auto">
                            <hr>
                            <button class="btn btn-sm me-1 btn-editar" type="button" data-id="${plan.id}">Editar</button>
                            <button class="btn btn-sm me-1 btn-toggle-estado" type="button" data-id="${plan.id}">${plan.estado === false ? "Activar" : "Desactivar"}</button>
                            <button class="btn btn-sm btn-eliminar" type="button" data-id="${plan.id}">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>`;
    });
}

function limpiarFormulario(cerrar = true) {
    editarPlan = null;
    form.reset();
    document.getElementById("imagen").required = true;

    const labelText = document.querySelector("#offcanvasNuevoPlan .fw-bold.d-block");
    if (labelText) labelText.textContent = "Haz clic para seleccionar una imagen";

    const preview = document.getElementById("previewImagen");
    if (preview) { preview.src = ""; preview.style.display = "none"; }

    const icono = document.getElementById("iconoImagen");
    if (icono) icono.style.display = "";

    const errorImagen = document.getElementById("errorImagen");
    if (errorImagen) errorImagen.style.display = "none";

    const dropzone = document.getElementById("dropzoneImagen");
    if (dropzone) dropzone.style.borderColor = "#443022";

    if (cerrar) bsOffcanvas.hide();
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
    const errorImagen = document.getElementById("errorImagen");
    const dropzone = document.getElementById("dropzoneImagen");
    if (!file) {
        if (errorImagen) { errorImagen.innerHTML = '<i class="bi bi-exclamation-circle-fill me-1"></i>La imagen del plan es obligatoria.'; errorImagen.style.display = "block"; }
        if (dropzone) dropzone.style.borderColor = "#ff4d4d";
        throw new Error("Debes seleccionar una imagen para el plan.");
    }
    if (file.size > 1 * 1024 * 1024) {
        if (errorImagen) { errorImagen.innerHTML = '<i class="bi bi-exclamation-circle-fill me-1"></i>La imagen no debe superar 1 MB.'; errorImagen.style.display = "block"; }
        if (dropzone) dropzone.style.borderColor = "#ff4d4d";
        throw new Error("La imagen no debe superar 1 MB.");
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
    const planActual = planes.find(plan => String(plan.id) === String(editarPlan));
    const plan = planDesdeFormulario(planActual?.imagen || "");

    const body = {
        nombre: plan.nombre,
        descripcion: plan.descripcion,
        precio: plan.precio,
        descuentoPorcentaje: plan.descuentoPorcentaje,
        tipoPlan: plan.tipoPlan,
        dificultad: plan.dificultad,
        estado: plan.estado,
        actividades: plan.actividades,
        imagen: plan.imagen
    };

    const response = await fetch(`${RUTA_API_URL}/planes/${editarPlan}`, {
        method: "PUT",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(body)
    });

    if (!response.ok) throw await apiError(response, "No se pudo actualizar el plan");
}

async function cambiarEstadoPlan(id) {
    const planActual = planes.find(plan => String(plan.id) === String(id));
    if (!planActual) return;

    const body = {
        nombre: planActual.nombre,
        descripcion: planActual.descripcion,
        precio: planActual.precio,
        descuentoPorcentaje: planActual.descuentoPorcentaje || 0,
        tipoPlan: planActual.tipoPlan,
        dificultad: planActual.dificultad,
        estado: !planActual.estado,
        actividades: actividadesTexto(planActual),
        imagen: planActual.imagen || ""
    };

    const response = await fetch(`${RUTA_API_URL}/planes/${id}`, {
        method: "PUT",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw await apiError(response, "No se pudo cambiar el estado del plan");
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

    const preview = document.getElementById("previewImagen");
    const icono = document.getElementById("iconoImagen");
    const textoImagen = document.getElementById("textoImagen");
    if (plan.imagen) {
        if (preview) { preview.src = plan.imagen; preview.style.display = "block"; }
        if (icono) icono.style.display = "none";
        if (textoImagen) textoImagen.textContent = "Imagen actual del plan";
    }

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
        if (error.message !== "Debes seleccionar una imagen para el plan.") {
            mostrarToast(error.message, "error");
        }
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
    document.getElementById("filtroCategoriaMovil").value = filtroCategoria;
    mostrarPlanes();
});

filtroDificultadSelect?.addEventListener("change", () => {
    filtroDificultad = filtroDificultadSelect.value;
    document.getElementById("filtroDificultadMovil").value = filtroDificultad;
    mostrarPlanes();
});

filtroEstadoSelect?.addEventListener("change", () => {
    filtroEstado = filtroEstadoSelect.value;
    document.getElementById("filtroEstadoMovil").value = filtroEstado;
    mostrarPlanes();
});

// Filtros móvil — se aplican al pulsar el botón
document.getElementById("btnAplicarFiltros")?.addEventListener("click", () => {
    filtroCategoria = document.getElementById("filtroCategoriaMovil").value;
    filtroDificultad = document.getElementById("filtroDificultadMovil").value;
    filtroEstado = document.getElementById("filtroEstadoMovil").value;
    filtroCategoriaSelect.value = filtroCategoria;
    filtroDificultadSelect.value = filtroDificultad;
    filtroEstadoSelect.value = filtroEstado;
    mostrarPlanes();
});

document.getElementById("btnLimpiarFiltros")?.addEventListener("click", () => {
    filtroCategoria = "";
    filtroDificultad = "";
    filtroEstado = "";
    document.getElementById("filtroCategoriaMovil").value = "";
    document.getElementById("filtroDificultadMovil").value = "";
    document.getElementById("filtroEstadoMovil").value = "";
    filtroCategoriaSelect.value = "";
    filtroDificultadSelect.value = "";
    filtroEstadoSelect.value = "";
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
