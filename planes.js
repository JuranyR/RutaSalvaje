let planesCache = [];
let resenasPorPlan = {};
const contenedor = document.getElementById("contenedorPlanes");

function escaparHtml(valor) {
    return String(valor || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function estrellasHtml(calificacion = 0) {
    const valor = Math.max(0, Math.min(5, Math.round(Number(calificacion || 0))));
    return "\u2605".repeat(valor) + "\u2606".repeat(5 - valor);
}

function resumenResenas(planId) {
    const resenas = resenasPorPlan[String(planId)] || [];
    if (resenas.length === 0) {
        return `<p class="resena-resumen mb-2">Sin rese\u00f1as todav\u00eda</p>`;
    }

    const promedio = resenas.reduce((sum, item) => sum + Number(item.calificacion || 0), 0) / resenas.length;
    return `
        <p class="resena-resumen mb-2">
            <span class="resena-estrellas">${estrellasHtml(promedio)}</span>
            <span>${promedio.toFixed(1)} (${resenas.length})</span>
        </p>
    `;
}

function resenasHtml(planId) {
    const resenas = resenasPorPlan[String(planId)] || [];
    if (resenas.length === 0) {
        return estadoVacioHtml("Este plan a\u00fan no tiene rese\u00f1as. S\u00e9 el primero en contar tu experiencia.");
    }

    return resenas.map(resena => `
        <article class="resena-item">
            <div class="d-flex justify-content-between gap-2">
                <strong>${escaparHtml(resena.nombreUsuario || "Usuario")}</strong>
                <span class="resena-estrellas">${estrellasHtml(resena.calificacion)}</span>
            </div>
            <p class="mb-0">${escaparHtml(resena.comentario)}</p>
        </article>
    `).join("");
}

async function cargarResenas() {
    try {
        const response = await fetch(`${RUTA_API_URL}/resenas`);
        if (!response.ok) throw await apiError(response, "No se pudieron cargar las rese\u00f1as");

        const resenas = await response.json();
        resenasPorPlan = resenas.reduce((acc, resena) => {
            const key = String(resena.planId);
            if (!acc[key]) acc[key] = [];
            acc[key].push(resena);
            return acc;
        }, {});
    } catch (error) {
        console.warn("Rese\u00f1as no disponibles:", error);
        resenasPorPlan = {};
    }
}

function precioHtml(plan) {
    const descuento = Number(plan.descuentoPorcentaje || 0);
    if (descuento <= 0) {
        return `<p class="card-text"><b>Precio:</b> $${formatoPrecio(precioPlan(plan))}</p>`;
    }

    return `
        <p class="card-text mb-1"><b>Precio:</b> $${formatoPrecio(precioPlan(plan))}</p>
        <p class="text-muted small mb-2"><span class="text-decoration-line-through">$${formatoPrecio(plan.precio)}</span> ${descuento}% off</p>
    `;
}

async function cargarPlanes() {
    try {
        const response = await fetch(`${RUTA_API_URL}/planes`);
        if (!response.ok) throw await apiError(response, "Error al obtener planes");

        const [planes] = await Promise.all([response.json(), cargarResenas()]);
        planesCache = planes.filter(planDisponible);

        if (planesCache.length === 0) {
            contenedor.innerHTML = estadoVacioHtml("A\u00fan no tenemos planes publicados.");
            return;
        }

        contenedor.innerHTML = planesCache.map(plan => `
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <img src="${planImagen(plan)}" class="card-img-top" alt="${plan.nombre}" style="height:200px; object-fit:cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${plan.nombre}</h5>
                        <p class="card-text descripcion">${plan.descripcion}</p>
                        <p class="card-text small text-muted mb-1">${formatoEnum(planCategoria(plan))} | ${formatoEnum(planDificultad(plan))}</p>
                        ${precioHtml(plan)}
                        ${resumenResenas(plan.id)}
                        <div class="mt-auto d-flex gap-2 flex-wrap">
                            <button class="btn btn-rs-primary btn-reservar" data-id="${plan.id}">Reservar</button>
                            <button class="btn btn-rs-outline btn-ver-mas"
                                    data-bs-toggle="modal" data-bs-target="#modalSalvajeSignature"
                                    data-id="${plan.id}">Ver m&aacute;s</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error("Error al cargar planes:", error);
        contenedor.innerHTML = estadoVacioHtml(error.message);
    }
}

function agregarAlCarrito(plan) {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

    if (reservas.find(item => String(item.id) === String(plan.id))) {
        mostrarToast("Este plan ya est\u00e1 en tu carrito.", "info");
        return;
    }

    reservas.push({
        id: plan.id,
        nombre: plan.nombre,
        descripcion: plan.descripcion,
        precio: precioPlan(plan),
        precioBase: plan.precio,
        descuentoPorcentaje: plan.descuentoPorcentaje || 0,
        imagen: planImagen(plan),
        personas: 1,
        fecha: "",
        hora: "10:00"
    });

    localStorage.setItem("reservas", JSON.stringify(reservas));
    window.location.href = "Reservas-Usuario.html";
}

document.addEventListener("click", function (e) {
    const btnVerMas = e.target.closest(".btn-ver-mas");
    const btnReservar = e.target.closest(".btn-reservar");

    if (btnVerMas) {
        const plan = planesCache.find(p => String(p.id) === String(btnVerMas.dataset.id));
        if (!plan) return;

        document.getElementById("modalTitulo").textContent = plan.nombre;
        document.getElementById("modalDescripcion").textContent = plan.descripcion;
        document.getElementById("modalPrecio").textContent = `$${formatoPrecio(precioPlan(plan))}`;
        document.getElementById("modalImagen").src = planImagen(plan);
        document.getElementById("modalResenas").innerHTML = resenasHtml(plan.id);
        document.getElementById("resenaPlanId").value = plan.id;
        document.getElementById("resenaComentario").value = "";
        document.getElementById("resenaCalificacion").value = "5";
        document.getElementById("resenaMensaje").textContent = "";
        window.planTemporalModal = plan;
    }

    if (btnReservar) {
        if (!getUsuario() || !getToken()) {
            mostrarToast("Para reservar una aventura, primero debes iniciar sesi\u00f3n.", "info");
            window.setTimeout(() => {
                window.location.href = "login.html";
            }, 900);
            return;
        }

        const plan = btnReservar.closest("#modalSalvajeSignature")
            ? window.planTemporalModal
            : planesCache.find(p => String(p.id) === String(btnReservar.dataset.id));

        if (plan) agregarAlCarrito(plan);
    }
});

document.getElementById("formResena")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usuario = getUsuario();
    const token = getToken();
    const mensaje = document.getElementById("resenaMensaje");

    if (!usuario || !token) {
        mensaje.textContent = "Inicia sesi\u00f3n para publicar tu rese\u00f1a.";
        mensaje.className = "resena-mensaje error";
        return;
    }

    try {
        const planId = Number(document.getElementById("resenaPlanId").value);
        const response = await fetch(`${RUTA_API_URL}/resenas`, {
            method: "POST",
            headers: getAuthHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({
                comentario: document.getElementById("resenaComentario").value.trim(),
                calificacion: Number(document.getElementById("resenaCalificacion").value),
                usuarioId: usuario.id,
                planId
            })
        });

        if (!response.ok) throw await apiError(response, "No se pudo guardar la rese\u00f1a");

        await cargarResenas();
        document.getElementById("modalResenas").innerHTML = resenasHtml(planId);
        document.getElementById("resenaComentario").value = "";
        mensaje.textContent = "Rese\u00f1a publicada correctamente.";
        mensaje.className = "resena-mensaje ok";
        cargarPlanes();
    } catch (error) {
        console.error(error);
        mensaje.textContent = error.message;
        mensaje.className = "resena-mensaje error";
    }
});

document.addEventListener("DOMContentLoaded", cargarPlanes);