const lista = document.getElementById("lista-reservas");
const montoTotalEl = document.getElementById("montoTotal");
const numPersonasInput = document.getElementById("numPersonas");
const fechaInput = document.getElementById("fechaReserva");
const btnConfirmar = document.getElementById("btnConfirmar");
const btnVaciar = document.getElementById("btnVaciar");
const alertaEl = document.getElementById("alerta");
const btnMenos = document.getElementById('btnMenos');
const btnMas = document.getElementById('btnMas');

let planActual = null;
let alertaTimer = null;

function cargarReserva() {
  const datos = localStorage.getItem("reservaActual");

  if (!datos) {
    lista.innerHTML = "<p style='color:#999;font-size:0.88rem;padding:20px 0;'>No hay planes en el carrito.</p>";
    montoTotalEl.textContent = "0";
    return;
  }

  planActual = JSON.parse(datos);

  lista.innerHTML = `
    <div class="item">
      <img src="${planActual.imagen}" alt="${planActual.nombre}">
      <div class="plan-info">
        <p>${planActual.nombre}</p>
      </div>
      <div class="celda">$${planActual.precio.toLocaleString('es-CO')}</div>
      <div class="celda" id="personasTexto">1</div>
      <div class="celda" id="totalItem">$${planActual.precio.toLocaleString('es-CO')}</div>
    </div>
  `;

  calcularTotal();
}

function calcularTotal() {
  if (!planActual) return;
  const personas = parseInt(numPersonasInput.value) || 1;
  const total = planActual.precio * personas;
  document.getElementById("personasTexto").textContent = personas;
  document.getElementById("totalItem").textContent = "$" + total.toLocaleString('es-CO');
  montoTotalEl.textContent = total.toLocaleString('es-CO');
}

function mostrarMensaje(texto, tipo = "ok") {
  alertaEl.textContent = texto;
  alertaEl.className = "alerta-inline visible " + tipo;

  if (alertaTimer) clearTimeout(alertaTimer);
  alertaTimer = setTimeout(() => {
    alertaEl.className = "alerta-inline";
  }, 3000);
}

btnConfirmar.addEventListener("click", () => {
  if (!planActual) {
    mostrarMensaje("No hay nada en el carrito.", "error");
    return;
  }
  if (!fechaInput.value) {
    mostrarMensaje("Por favor selecciona una fecha.", "error");
    return;
  }

  mostrarMensaje("¡Reserva confirmada exitosamente!", "ok");
  localStorage.removeItem("reservaActual");
  numPersonasInput.value = 1;
  cargarReserva();
});

btnVaciar.addEventListener("click", () => {
  if (!planActual) {
    mostrarMensaje("El carrito ya está vacío.", "error");
    return;
  }
  localStorage.removeItem("reservaActual");
  planActual = null;
  numPersonasInput.value = 1;
  cargarReserva();
  mostrarMensaje("Carrito vaciado.", "ok");
});

btnMenos.addEventListener('click', () => {
  const actual = parseInt(numPersonasInput.value) || 1;
  if (actual > 1) {
    numPersonasInput.value = actual - 1;
    calcularTotal();
  }
});

btnMas.addEventListener('click', () => {
  const actual = parseInt(numPersonasInput.value) || 1;
  numPersonasInput.value = actual + 1;
  calcularTotal();
});

numPersonasInput.addEventListener("input", calcularTotal);

cargarReserva();