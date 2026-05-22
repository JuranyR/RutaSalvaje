const lista = document.getElementById("lista-reservas");
const montoTotalEl = document.getElementById("montoTotal");
const fechaInput = document.getElementById("fechaReserva");
const btnConfirmar = document.getElementById("btnConfirmar");
const btnVaciar = document.getElementById("btnVaciar");
const alertaEl = document.getElementById("alerta");

let reservas     = [];
let alertaTimer  = null;

function cargarReservas() {
  reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  renderLista();
}

function guardarReservas() {
  localStorage.setItem("reservas", JSON.stringify(reservas));
}

function renderLista() {
  if (reservas.length === 0) {
    lista.innerHTML = "<p style='color:#999;font-size:0.88rem;padding:20px 0;'>No hay planes en el carrito.</p>";
    montoTotalEl.textContent = "0";
    return;
  }

  lista.innerHTML = reservas.map((plan, index) => {
    const personas  = plan.personas || 1;
    const totalItem = plan.precio * personas;

    return `
      <div class="item" data-index="${index}">
        <img src="${plan.imagen}" alt="${plan.nombre}">
        <div class="plan-info">
          <p>${plan.nombre}</p>
        </div>
        <div class="celda">$${plan.precio.toLocaleString("es-CO")}</div>
        <div class="celda">${personas}</div>
        <div class="celda total-item">$${totalItem.toLocaleString("es-CO")}</div>
        <button class="btn-eliminar" data-index="${index}">✕</button>
      </div>
    `;
  }).join("");

  lista.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.dataset.index);
      reservas.splice(i, 1);
      guardarReservas();
      renderLista();
      mostrarMensaje("Reserva eliminada correctamente");
    });
  });

  calcularTotal();
}

function calcularTotal() {
  const total = reservas.reduce((sum, plan) => sum + plan.precio * (plan.personas || 1), 0);
  montoTotalEl.textContent = total.toLocaleString("es-CO");
}

function mostrarMensaje(texto, tipo = "ok") {
  alertaEl.textContent = texto;
  alertaEl.className   = "alerta-inline visible " + tipo;
  if (alertaTimer) clearTimeout(alertaTimer);
  alertaTimer = setTimeout(() => { alertaEl.className = "alerta-inline"; }, 3000);
}

btnConfirmar.addEventListener("click", () => {
  if (reservas.length === 0) { 
    mostrarMensaje("No hay nada en el carrito.", "error"); 
    return; 
  }
  if (!fechaInput.value) { 
    mostrarMensaje("Por favor selecciona una fecha.", "error"); 
    return; 
  }

  mostrarMensaje("¡Reserva confirmada exitosamente!", "ok");
  localStorage.removeItem("reservas");
  reservas = [];
  renderLista();
});

btnVaciar.addEventListener("click", () => {
  if (reservas.length === 0) { mostrarMensaje("El carrito ya está vacío.", "error"); return; }
  localStorage.removeItem("reservas");
  reservas = [];
  renderLista();
  mostrarMensaje("Carrito vaciado.", "ok");
});

cargarReservas();