if (!requireLogin()) {
    throw new Error("Debes iniciar sesi\u00f3n para reservar");
}

const lista = document.getElementById("lista-reservas");
const montoTotalEl = document.getElementById("montoTotal");
const btnConfirmar = document.getElementById("btnConfirmar");
const btnVaciar = document.getElementById("btnVaciar");
const alerta = document.getElementById("alerta");
const listaConfirmadas = document.getElementById("lista-reservas-confirmadas");
const horasDisponibles = ["08:00", "10:00", "12:00", "14:00", "16:00"];

let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

function fechaMinima() {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return manana.toISOString().split("T")[0];
}

function mostrarAlerta(mensaje, tipo = "error") {
    alerta.textContent = mensaje;
    alerta.className = `alerta-inline visible ${tipo}`;
}

function limpiarAlerta() {
    alerta.textContent = "";
    alerta.className = "alerta-inline";
}

function guardarCarrito() {
    localStorage.setItem("reservas", JSON.stringify(reservas));
}

function subtotal(plan) {
    return Number(plan.precio || 0) * Number(plan.personas || 1);
}

function formatoFechaReserva(fecha) {
    if (!fecha) return "Sin fecha";
    return new Date(fecha).toLocaleString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function renderLista() {
    limpiarAlerta();

    if (reservas.length === 0) {
        lista.innerHTML = "<p class='texto-vacio text-center'>No hay planes en el carrito.</p>";
        montoTotalEl.textContent = "0";
        btnConfirmar.disabled = true;
        return;
    }

    btnConfirmar.disabled = false;
    const min = fechaMinima();
    lista.innerHTML = reservas.map((plan, index) => `
        <div class="item" data-index="${index}">
            <div class="plan-info">
                <div class="d-flex align-items-center gap-3">
                    <img src="${plan.imagen}" alt="${plan.nombre}">
                    <div>
                        <p>${plan.nombre}</p>
                        <small>$${formatoPrecio(plan.precio)} por persona</small>
                    </div>
                </div>
            </div>

            <div class="celda reserva-fecha">
                <label class="campo-label fecha-label">Fecha</label>
                <input type="date" class="campo-input input-fecha" min="${min}" value="${plan.fecha || ""}">
                <label class="campo-label hora-label">Hora</label>
                <select class="campo-input input-hora mt-2">
                    ${horasDisponibles.map(hora => `<option value="${hora}" ${hora === (plan.hora || "10:00") ? "selected" : ""}>${hora}</option>`).join("")}
                </select>
            </div>

            <div class="celda">
                <div class="personas-control justify-content-center">
                    <button class="personas-btn btn-menos" type="button">-</button>
                    <input type="number" class="campo-input personas-input input-personas" value="${plan.personas || 1}" min="1">
                    <button class="personas-btn btn-mas" type="button">+</button>
                </div>
            </div>

            <div class="celda">
                <strong>$${formatoPrecio(subtotal(plan))}</strong>
                <br>
                <button class="btn-eliminar mt-2" type="button">Quitar</button>
            </div>
        </div>
    `).join("");

    calcularTotal();
}

function calcularTotal() {
    const total = reservas.reduce((sum, plan) => sum + subtotal(plan), 0);
    montoTotalEl.textContent = formatoPrecio(total);
}

function fechaHoraReserva(plan) {
    return `${plan.fecha}T${plan.hora || "10:00"}:00`;
}

function validarCarrito() {
    if (reservas.length === 0) return "Agrega al menos un plan.";

    const min = fechaMinima();
    for (const plan of reservas) {
        if (!plan.fecha) return `Selecciona una fecha para ${plan.nombre}.`;
        if (plan.fecha < min) return `La fecha de ${plan.nombre} debe ser posterior a hoy.`;
        if (!plan.hora) return `Selecciona una hora para ${plan.nombre}.`;
        if (Number(plan.personas || 0) <= 0) return `La cantidad de personas de ${plan.nombre} debe ser mayor a cero.`;
    }

    return "";
}

async function validarDisponibilidad(plan) {
    const url = new URL(`${RUTA_API_URL}/reservas/disponibilidad`);
    url.searchParams.set("planId", plan.id);
    url.searchParams.set("fecha", fechaHoraReserva(plan));

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) throw await apiError(response, "No se pudo validar disponibilidad");

    const data = await response.json();
    return data.disponible;
}

btnConfirmar.addEventListener("click", async () => {
    limpiarAlerta();
    guardarCarrito();

    const error = validarCarrito();
    if (error) {
        mostrarAlerta(error);
        return;
    }

    const usuario = getUsuario();

    try {
        btnConfirmar.disabled = true;
        btnConfirmar.textContent = "Validando...";

        for (const plan of reservas) {
            const disponible = await validarDisponibilidad(plan);
            if (!disponible) {
                throw new Error(`${plan.nombre} no está disponible para ${plan.fecha} a las ${plan.hora}.`);
            }
        }

        btnConfirmar.textContent = "Guardando...";

        for (const plan of reservas) {
            const response = await fetch(`${RUTA_API_URL}/reservas`, {
                method: "POST",
                headers: getAuthHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({
                    cantidadPersonas: Number(plan.personas),
                    fecha: fechaHoraReserva(plan),
                    usuarioId: usuario.id,
                    planId: plan.id
                })
            });

            if (!response.ok) throw await apiError(response, `Error al guardar ${plan.nombre}`);
        }

        localStorage.removeItem("reservas");
        reservas = [];
        mostrarAlerta("Reserva confirmada con éxito.", "ok");
        btnConfirmar.textContent = "Confirmar reserva";
        renderLista();
        await cargarReservasConfirmadas();
    } catch (error) {
        console.error(error);
        mostrarAlerta(error.message);
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = "Confirmar reserva";
    }
});

btnVaciar.addEventListener("click", () => {
    localStorage.removeItem("reservas");
    reservas = [];
    renderLista();
});

lista.addEventListener("input", (e) => {
    const item = e.target.closest(".item");
    if (!item) return;

    const index = Number(item.dataset.index);
    if (e.target.classList.contains("input-fecha")) reservas[index].fecha = e.target.value;
    if (e.target.classList.contains("input-hora")) reservas[index].hora = e.target.value;
    if (e.target.classList.contains("input-personas")) reservas[index].personas = Math.max(1, Number(e.target.value || 1));

    guardarCarrito();
    calcularTotal();
});

lista.addEventListener("change", (e) => {
    if (e.target.classList.contains("input-fecha") || e.target.classList.contains("input-hora")) {
        const item = e.target.closest(".item");
        const index = Number(item.dataset.index);
        reservas[index].fecha = item.querySelector(".input-fecha").value;
        reservas[index].hora = item.querySelector(".input-hora").value;
        guardarCarrito();
    }
});

lista.addEventListener("click", (e) => {
    const item = e.target.closest(".item");
    if (!item) return;

    const index = Number(item.dataset.index);
    let debeRenderizar = false;

    if (e.target.classList.contains("btn-menos")) {
        reservas[index].personas = Math.max(1, Number(reservas[index].personas || 1) - 1);
        debeRenderizar = true;
    }

    if (e.target.classList.contains("btn-mas")) {
        reservas[index].personas = Number(reservas[index].personas || 1) + 1;
        debeRenderizar = true;
    }

    if (e.target.classList.contains("btn-eliminar")) {
        reservas.splice(index, 1);
        debeRenderizar = true;
    }

    if (!debeRenderizar) return;

    guardarCarrito();
    renderLista();
});

async function cargarReservasConfirmadas() {
    const usuario = getUsuario();
    if (!listaConfirmadas || !usuario?.id) return;

    listaConfirmadas.innerHTML = `<p class="texto-vacio text-center">Cargando reservas...</p>`;

    try {
        const response = await fetch(`${RUTA_API_URL}/reservas/usuario/${usuario.id}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) throw await apiError(response, "No se pudieron cargar tus reservas");

        const confirmadas = await response.json();
        if (confirmadas.length === 0) {
            listaConfirmadas.innerHTML = `<p class="texto-vacio text-center">Aún no tienes reservas confirmadas.</p>`;
            return;
        }

        listaConfirmadas.innerHTML = confirmadas.map(reserva => `
            <article class="reserva-confirmada">
                <div>
                    <h5>${reserva.nombrePlan || "Plan"}</h5>
                    <p><strong>Fecha:</strong> ${formatoFechaReserva(reserva.fecha)}</p>
                    <p><strong>Personas:</strong> ${reserva.cantidadPersonas} | <strong>Total:</strong> $${formatoPrecio(reserva.total || 0)}</p>
                    <span class="estado-reserva ${String(reserva.estado || "").toLowerCase()}">${reserva.estado}</span>
                </div>
                <button class="btn-cancelar-reserva" type="button" data-id="${reserva.id}" ${reserva.estado === "CANCELADA" ? "disabled" : ""}>
                    Cancelar
                </button>
            </article>
        `).join("");
    } catch (error) {
        console.error(error);
        listaConfirmadas.innerHTML = `<div class="alerta-inline visible error">${error.message}</div>`;
    }
}

async function cancelarReservaUsuario(id) {
    const confirmado = await confirmarAccion({
        titulo: "Cancelar reserva",
        mensaje: "Esta reserva quedará marcada como cancelada.",
        confirmar: "Cancelar reserva"
    });
    if (!confirmado) return;

    const usuario = getUsuario();
    try {
        const response = await fetch(`${RUTA_API_URL}/reservas/${id}/cancelar-usuario?usuarioId=${usuario.id}`, {
            method: "PATCH",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw await apiError(response, "No se pudo cancelar la reserva");
        mostrarAlerta("Reserva cancelada correctamente.", "ok");
        await cargarReservasConfirmadas();
    } catch (error) {
        console.error(error);
        mostrarAlerta(error.message);
    }
}

listaConfirmadas?.addEventListener("click", (event) => {
    const btnCancelar = event.target.closest(".btn-cancelar-reserva");
    if (btnCancelar) cancelarReservaUsuario(btnCancelar.dataset.id);
});

renderLista();
cargarReservasConfirmadas();
