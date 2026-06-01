if (!requireAdmin()) {
    throw new Error("Acceso restringido a administradores");
}

const btnMostrarForm = document.getElementById("btnFormAct");
const formContainer = document.getElementById("offcanvasReserva");
const form = document.getElementById("formReserva");
const lista = document.getElementById("listaReservas");
const inputBuscar = document.getElementById("buscarReserva");
const clienteNombreInput = document.getElementById("clienteNombre");
const clienteEmailInput = document.getElementById("clienteEmail");
const planSelect = document.getElementById("planId");
const fechaInput = document.getElementById("fecha");
const filtroCategoriaSelect = document.getElementById("filtroCategoria");
const filtroDificultadSelect = document.getElementById("filtroDificultad");
const filtroEstadoSelect = document.getElementById("filtroEstado");

let reservas = [];
let usuarios = [];
let planes = [];
let filtroBuscar = "";
let filtroCategoria = "";
let filtroDificultad = "";
let filtroEstado = "";

function fechaMinima() {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return manana.toISOString().split("T")[0];
}

const fpFecha = flatpickr("#fecha", {
    locale: "es",
    minDate: fechaMinima(),
    dateFormat: "Y-m-d",
    disableMobile: true,
    theme: "dark"
});

function formatoFecha(fecha) {
    if (!fecha) return "Sin fecha";
    return new Date(fecha).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function fechaHoraReserva() {
    return `${fechaInput.value}T${document.getElementById("hora").value}:00`;
}

function planDeReserva(reserva) {
    const reservaPlanId = reserva.planId || reserva.idPlan;
    return planes.find(plan => String(plan.id) === String(reservaPlanId))
        || planes.find(plan => normalizarTexto(plan.nombre) === normalizarTexto(reserva.nombrePlan));
}

async function cargarDatosIniciales() {
    fpFecha?.set("minDate", fechaMinima());
    lista.innerHTML = `<div class="col-12"><p class="text-muted">Cargando reservas...</p></div>`;

    try {
        const [usuariosResponse, planesResponse, reservasResponse] = await Promise.all([
            fetch(`${RUTA_API_URL}/usuarios`, { headers: getAuthHeaders() }),
            fetch(`${RUTA_API_URL}/planes`, { headers: getAuthHeaders() }),
            fetch(`${RUTA_API_URL}/reservas`, { headers: getAuthHeaders() })
        ]);

        if (!usuariosResponse.ok) throw await apiError(usuariosResponse, "No se pudieron cargar los usuarios");
        if (!planesResponse.ok) throw await apiError(planesResponse, "No se pudieron cargar los planes");
        if (!reservasResponse.ok) throw await apiError(reservasResponse, "No se pudieron cargar las reservas");

        usuarios = await usuariosResponse.json();
        planes = (await planesResponse.json()).filter(planDisponible);
        reservas = await reservasResponse.json();

        planSelect.innerHTML = `<option value="">Seleccionar plan</option>` + planes
            .map(plan => `<option value="${plan.id}">${plan.nombre} - $${formatoPrecio(precioPlan(plan))}</option>`)
            .join("");

        actualizarValoresCalculados();

        mostrarReservas();
    } catch (error) {
        console.error(error);
        lista.innerHTML = `<div class="col-12">${estadoVacioHtml(error.message)}</div>`;
    }
}

function mostrarReservas() {
    const busqueda = normalizarTexto(filtroBuscar);
    const resultado = reservas.filter(reserva => {
        const plan = planDeReserva(reserva);
        const categoria = planCategoria(plan);
        const dificultad = planDificultad(plan);
        const estado = String(reserva.estado || "PENDIENTE").toUpperCase();
        const texto = normalizarTexto(`${reserva.nombreUsuario} ${reserva.nombrePlan} ${estado} ${categoria} ${dificultad}`);

        return texto.includes(busqueda)
            && (!filtroCategoria || categoria === filtroCategoria)
            && (!filtroDificultad || dificultad === filtroDificultad)
            && (!filtroEstado || estado === filtroEstado);
    });

    lista.innerHTML = "";

    if (resultado.length === 0) {
        lista.innerHTML = `<div class="col-12">${estadoVacioHtml("No se encontraron reservas.")}</div>`;
        return;
    }

  
    resultado.forEach(reserva => {

    const plan = planDeReserva(reserva);
    const estado = String(reserva.estado || "PENDIENTE").toUpperCase();

    let claseEstado = "estado-pendiente";

    if (estado === "AGENDADA") {
        claseEstado = "estado-agendada";
    }

    if (estado === "CANCELADA") {
        claseEstado = "estado-cancelada";
    }

    lista.innerHTML += `

        <div class="reserva-card">

            <!-- BADGE -->
            <div class="d-flex justify-content-end p-3 pb-0">

                <span class="estado-badge ${claseEstado}">
                    ${formatoEnum(estado)}
                </span>

            </div>

            <!-- CONTENIDO -->
            <div class="reserva-content pt-2">

                <h3 class="reserva-titulo">
                    ${reserva.nombrePlan || "Plan sin nombre"}
                </h3>

                <div class="reserva-info">
                    <i class="bi bi-tags-fill"></i>

                    <span>
                        <strong>Categoría:</strong>
                        ${formatoEnum(planCategoria(plan))}
                    </span>
                </div>

                <div class="reserva-info">
                    <i class="bi bi-bar-chart-fill"></i>

                    <span>
                        <strong>Dificultad:</strong>
                        ${formatoEnum(planDificultad(plan))}
                    </span>
                </div>

                <div class="reserva-info">
                    <i class="bi bi-person-fill"></i>

                    <span>
                        <strong>Cliente:</strong>
                        ${reserva.nombreUsuario || "Sin usuario"}
                    </span>
                </div>

                <div class="reserva-info">
                    <i class="bi bi-people-fill"></i>

                    <span>
                        <strong>Personas:</strong>
                        ${reserva.cantidadPersonas || 0}
                    </span>
                </div>

                <div class="reserva-info">
                    <i class="bi bi-calendar-event-fill"></i>

                    <span>
                        <strong>Fecha:</strong>
                        ${formatoFecha(reserva.fecha)}
                    </span>
                </div>

                <!-- TOTAL -->
                <div class="reserva-total">

                    <div class="total-precio">
                        $${formatoPrecio(reserva.total || 0)}
                    </div>

                    <button
                        class="btn-cancelar-reserva"
                        data-id="${reserva.id}"
                        ${estado === "CANCELADA" ? "disabled" : ""}>
                        Cancelar
                    </button>

                </div>

            </div>

        </div>
    `;
});
}

async function cancelarReserva(id) {
    const confirmado = await confirmarAccion({
        titulo: "¿Cancelar esta reserva?",
        mensaje: "La reserva quedará marcada como cancelada. Esta acción no se puede deshacer.",
        confirmar: "Cancelar",
        cancelar: "Volver"
    });
    if (!confirmado) return;

    try {
        const response = await fetch(`${RUTA_API_URL}/reservas/${id}/cancelar`, {
            method: "PATCH",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw await apiError(response, "No se pudo cancelar la reserva");
        await cargarDatosIniciales();
        mostrarToast("Reserva cancelada correctamente.", "ok");
    } catch (error) {
        console.error(error);
        mostrarToast(error.message, "error");
    }
}

async function validarDisponibilidadManual() {
    const url = new URL(`${RUTA_API_URL}/reservas/disponibilidad`);
    url.searchParams.set("planId", planSelect.value);
    url.searchParams.set("fecha", fechaHoraReserva());

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) throw await apiError(response, "No se pudo validar disponibilidad");
    const data = await response.json();
    return data.disponible;
}

async function crearUsuarioManual(nombre, email) {
    const response = await fetch(`${RUTA_API_URL}/usuarios`, {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
            nombre,
            email,
            password: "Reserva123!",
            confirmarPassword: "Reserva123!",
            telefono: "3000000000",
            nombreEmergencia: "Contacto por confirmar",
            telefonoEmergencia: "3000000000",
            parentesco: "Por confirmar"
        })
    });

    if (!response.ok) throw await apiError(response, "No se pudo crear el cliente");
    return response.json();
}

async function obtenerOCrearUsuarioManual() {
    const nombre = clienteNombreInput.value.trim();
    const email = clienteEmailInput.value.trim().toLowerCase();

    if (!nombre) throw new Error("Escribe el nombre del cliente.");
    if (!email) throw new Error("Escribe el correo del cliente.");

    const existente = usuarios.find(usuario => String(usuario.email || "").toLowerCase() === email);
    if (existente) return existente;

    const creado = await crearUsuarioManual(nombre, email);
    usuarios.push(creado);
    return creado;
}

function actualizarValoresCalculados() {
    const planId = planSelect.value;
    const personasVal = Number(document.getElementById("personas").value) || 1;
    
    const dificultadInput = document.getElementById("dificultadAuto");
    const precioInput = document.getElementById("precioUnitarioAuto");
    const totalInput = document.getElementById("totalAuto");
    
    if (!planId) {
        if (dificultadInput) dificultadInput.value = "—";
        if (precioInput) precioInput.value = "0";
        if (totalInput) totalInput.value = "0";
        return;
    }
    
    const planSelected = planes.find(p => String(p.id) === String(planId));
    if (planSelected) {
        const precioUnit = precioPlan(planSelected);
        const total = precioUnit * personasVal;
        
        if (dificultadInput) dificultadInput.value = formatoEnum(planDificultad(planSelected));
        if (precioInput) precioInput.value = formatoPrecio(precioUnit);
        if (totalInput) totalInput.value = formatoPrecio(total);
    }
}

planSelect?.addEventListener("change", actualizarValoresCalculados);
document.getElementById("personas")?.addEventListener("input", actualizarValoresCalculados);

btnMostrarForm?.addEventListener("click", () => {
    const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(formContainer);
    offcanvas.toggle();
});

formContainer?.addEventListener("hidden.bs.offcanvas", () => {
    form.reset();
    fpFecha?.clear();
    fpFecha?.set("minDate", fechaMinima());
    actualizarValoresCalculados();
});

form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (fechaInput.value < fechaMinima()) {
        mostrarToast("La fecha debe ser posterior a hoy.", "info");
        return;
    }

    try {
        const usuarioManual = await obtenerOCrearUsuarioManual();
        const disponible = await validarDisponibilidadManual();
        if (!disponible) throw new Error("Ese plan ya está reservado para esa fecha y hora.");

        const response = await fetch(`${RUTA_API_URL}/reservas`, {
            method: "POST",
            headers: getAuthHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({
                usuarioId: Number(usuarioManual.id),
                planId: Number(planSelect.value),
                cantidadPersonas: Number(document.getElementById("personas").value),
                fecha: fechaHoraReserva()
            })
        });

        if (!response.ok) throw await apiError(response, "No se pudo crear la reserva");

        form.reset();
        fpFecha?.clear();
        fpFecha?.set("minDate", fechaMinima());
        actualizarValoresCalculados();
        const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(formContainer);
        offcanvas.hide();
        await cargarDatosIniciales();
        mostrarToast("Reserva creada correctamente.", "ok");
    } catch (error) {
        console.error(error);
        mostrarToast(error.message, "error");
    }
});

filtroCategoriaSelect?.addEventListener("change", () => {
    filtroCategoria = filtroCategoriaSelect.value;
    document.getElementById("filtroCategoriaMovil").value = filtroCategoria;
    mostrarReservas();
});

filtroDificultadSelect?.addEventListener("change", () => {
    filtroDificultad = filtroDificultadSelect.value;
    document.getElementById("filtroDificultadMovil").value = filtroDificultad;
    mostrarReservas();
});

filtroEstadoSelect?.addEventListener("change", () => {
    filtroEstado = filtroEstadoSelect.value;
    document.getElementById("filtroEstadoMovil").value = filtroEstado;
    mostrarReservas();
});

document.getElementById("btnAplicarFiltros")?.addEventListener("click", () => {
    filtroCategoria = document.getElementById("filtroCategoriaMovil").value;
    filtroDificultad = document.getElementById("filtroDificultadMovil").value;
    filtroEstado = document.getElementById("filtroEstadoMovil").value;
    filtroCategoriaSelect.value = filtroCategoria;
    filtroDificultadSelect.value = filtroDificultad;
    filtroEstadoSelect.value = filtroEstado;
    mostrarReservas();
});

document.getElementById("btnLimpiarFiltros")?.addEventListener("click", () => {
    filtroCategoria = "";
    filtroDificultad = "";
    filtroEstado = "";
    ["filtroCategoriaMovil", "filtroDificultadMovil", "filtroEstadoMovil"].forEach(id => {
        document.getElementById(id).value = "";
    });
    filtroCategoriaSelect.value = "";
    filtroDificultadSelect.value = "";
    filtroEstadoSelect.value = "";
    mostrarReservas();
});

inputBuscar?.addEventListener("input", () => {
    filtroBuscar = inputBuscar.value;
    mostrarReservas();
});

lista?.addEventListener("click", (e) => {
    const btnCancelar = e.target.closest(".btn-cancelar-reserva");
    if (btnCancelar) cancelarReserva(btnCancelar.dataset.id);
});



cargarDatosIniciales();
