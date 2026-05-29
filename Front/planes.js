
function activarCalendarios() {
  flatpickr(".btn-reservar", {
    enableTime: false,
    dateFormat: "d-m-Y",
    minDate: "today",
     onChange: function(selectedDates, dateStr) {
      window.location.href = `Reservas-Usuario.html?fecha=${dateStr}`;

    }

  });
}

const contenedor = document.getElementById("contenedorPlanes");

let planDelModal = null;

function precioNumero(precio) {
  return Number(String(precio).replace(/\D/g, ""));
}

function cargarPlanes() {
  const planes = JSON.parse(localStorage.getItem("planes")) || [];
  let contenidoHTML = "";
  
  planes.forEach(plan => {
    const actividades = plan.actividades ? plan.actividades.join(", ") : "No especificadas";
    contenidoHTML += `
      <div class="col">
        <div class="card h-100">
          <img src="${plan.imagen}" class="card-img-top" alt="${plan.nombre}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${plan.nombre}</h5>
            <p class="card-text descripcion"><b>Actividades:</b> ${actividades} <br>
              <b>Ideal para:</b> ${plan.descripcion}
            </p>
            <p class="card-text"><b>Dificultad:</b> ${plan.dificultad}</p>
            <p class="card-text"><b>Precio:</b> $${Number(plan.precio).toLocaleString("es-CO")}</p>
            <div class="mt-auto">
              <button class="btn btn-agregar btn-reservar" data-id="${plan.id}">
                📅 Reservar
              </button>
              <button
                class="btn btn-info btn-ver-mas"
                data-bs-toggle="modal"
                data-bs-target="#modalSalvajeSignature"
                data-id="${plan.id}"
                data-titulo="${plan.nombre}"
                data-detalle="${plan.descripcion}"
                data-precio="$${Number(plan.precio).toLocaleString("es-CO")}"
                data-imagen="${plan.imagen}"
              >
                ℹ️ Ver más
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  contenedor.innerHTML = contenidoHTML;
}

function buscarPlanGuardado(id) {
  const planes = JSON.parse(localStorage.getItem("planes")) || [];
  return planes.find(plan => String(plan.id) === String(id));
}

function buscarPlanDeLaCard(boton) {
  let card = boton.closest(".card");

  if (!card) {
    const botonOriginal = document.querySelector(`.card .btn-reservar[data-id="${boton.dataset.id}"]`);
    card = botonOriginal ? botonOriginal.closest(".card") : null;
  }

  if (!card) return null;

  const botonDetalles = card.querySelector(".btn-ver-mas");
  const titulo = card.querySelector(".card-title")?.textContent.trim();
  const descripcion = card.querySelector(".descripcion")?.textContent.trim();

  const precioParagrafo = [...card.querySelectorAll(".card-text")].find(p => p.textContent.includes("Precio:"));
  const precioTexto = botonDetalles?.dataset.precio || precioParagrafo?.textContent.replace("Precio:", "").trim() || "$0";

  const imagen = botonDetalles?.dataset.imagen || card.querySelector("img")?.getAttribute("src");

  return {
    id: boton.dataset.id,
    nombre: titulo,
    descripcion,
    precio: precioNumero(precioTexto),
    precioTexto,
    imagen,
    dificultad: "No especificada",
    categoria: "Aventura"
  };
}

// ─── Helper: agrega un plan al array de reservas ───────────────────────────
function agregarAlCarrito(plan) {
  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  reservas.push({ ...plan, personas: 1 }); // cada reserva arranca con 1 persona
  localStorage.setItem("reservas", JSON.stringify(reservas));
}

cargarPlanes();

// Manejador de eventos único para todos los clics (Delegación de eventos)
document.addEventListener("click", function (e) {
  const botonVerMas = e.target.closest(".btn-ver-mas");
  const botonReservar = e.target.closest(".btn-reservar");

  // Lógica para el botón "Ver más" (Modal)
  if (botonVerMas) {
    document.getElementById("modalTitulo").textContent = botonVerMas.dataset.titulo;
    document.getElementById("modalDescripcion").textContent = botonVerMas.dataset.detalle;
    document.getElementById("modalPrecio").textContent = botonVerMas.dataset.precio || "";
    document.getElementById("modalImagen").src = botonVerMas.dataset.imagen;

    const botonModal = document.querySelector("#modalSalvajeSignature .btn-reservar");
    if (botonModal) {
      botonModal.dataset.id = botonVerMas.dataset.id;
      botonModal.innerHTML = "📅 Reservar";
    }

    planDelModal = {
      id: botonVerMas.dataset.id,
      nombre: botonVerMas.dataset.titulo,
      descripcion: botonVerMas.dataset.detalle,
      precio: precioNumero(botonVerMas.dataset.precio),
      precioTexto: botonVerMas.dataset.precio,
      imagen: botonVerMas.dataset.imagen,
      dificultad: "No especificada",
      categoria: "Aventura"
    };
    return;
  }

  // Lógica para el botón "Reservar"
  if (botonReservar) {
    // Caso A: Reserva desde el modal
    if (botonReservar.closest("#modalSalvajeSignature") && planDelModal) {
      agregarAlCarrito(planDelModal);
      window.location.href = "Reservas-Usuario.html";
      return;
    }

    // Caso B: Reserva desde la card directamente
    let plan = buscarPlanGuardado(botonReservar.dataset.id);

    if (!plan) {
      plan = buscarPlanDeLaCard(botonReservar);
    } else {
      plan.precio = precioNumero(plan.precio);
      plan.precioTexto = `$${plan.precio.toLocaleString("es-CO")}`;
    }

    if (plan) {
      agregarAlCarrito(plan);
      window.location.href = "Reservas-Usuario.html";
    } else {
      alert("No se pudo cargar el plan seleccionado.");
    }
  }
});