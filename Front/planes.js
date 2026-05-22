const contenedor = document.getElementById("contenedorPlanes");

let planDelModal = null;

function precioNumero(precio) {
  return Number(String(precio).replace(/\D/g, ""));
}

function cargarPlanes() {
  const planes = JSON.parse(localStorage.getItem("planes")) || [];

  planes.forEach(plan => {
    const actividades = plan.actividades ? plan.actividades.join(", ") : "No especificadas";

    contenedor.innerHTML += `
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

cargarPlanes();

document.querySelectorAll(".btn-reservar").forEach(boton => {
  boton.innerHTML = "📅 Reservar";
});

document.querySelectorAll(".btn-ver-mas").forEach(boton => {
  boton.innerHTML = "ℹ️ Ver más";
});

document.addEventListener("click", function(e) {
  const boton = e.target.closest(".btn-ver-mas");

  if (boton) {
    document.getElementById("modalTitulo").textContent = boton.dataset.titulo;
    document.getElementById("modalDescripcion").textContent = boton.dataset.detalle;
    document.getElementById("modalPrecio").textContent = boton.dataset.precio || "";
    document.getElementById("modalImagen").src = boton.dataset.imagen;

    const botonModal = document.querySelector("#modalSalvajeSignature .btn-reservar");
    if (botonModal) {
      botonModal.dataset.id = boton.dataset.id;
      botonModal.innerHTML = "📅 Reservar";
    }

    planDelModal = {
      id: boton.dataset.id,
      nombre: boton.dataset.titulo,
      descripcion: boton.dataset.detalle,
      precio: precioNumero(boton.dataset.precio),
      precioTexto: boton.dataset.precio,
      imagen: boton.dataset.imagen,
      dificultad: "No especificada",
      categoria: "Aventura"
    };
  }
});

document.addEventListener("click", function(e) {
  const boton = e.target.closest(".btn-reservar");

  if (!boton) return;

  if (boton.closest("#modalSalvajeSignature") && planDelModal) {
    localStorage.setItem("reservaActual", JSON.stringify(planDelModal));
    window.location.href = "Reservas-Usuario.html";
    return;
  }

  let plan = buscarPlanGuardado(boton.dataset.id);

  if (!plan) {
    plan = buscarPlanDeLaCard(boton);
  } else {
    plan.precio = precioNumero(plan.precio);
    plan.precioTexto = `$${plan.precio.toLocaleString("es-CO")}`;
  }

  if (!plan) {
    alert("No se pudo cargar el plan seleccionado.");
    return;
  }

  localStorage.setItem("reservaActual", JSON.stringify(plan));
  window.location.href = "Reservas-Usuario.html";
});

