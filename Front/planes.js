
function activarCalendarios() {
  flatpickr(".btn-reservar", {
    enableTime: false,
    dateFormat: "d-m-Y",
    minDate: "today"
  });
}

const contenedor = document.getElementById("contenedorPlanes");

function cargarPlanes() {
  const planes = JSON.parse(localStorage.getItem("planes")) || [];

  planes.forEach(plan => {

    let actividades = plan.actividades 
      ? plan.actividades.join(", ") 
      : "No especificadas";

    contenedor.innerHTML += `
      <div class="col-md-4">
        <div class="card shadow-sm h-100">
          <img src="${plan.imagen}" class="card-img-top">
          
          <div class="card-body">
            <h5>${plan.nombre}</h5>
            <p>${plan.descripcion}</p>

            <p><strong>Incluye:</strong> ${actividades}</p>
            <span class="badge bg-success">${plan.categoria}</span>
            
            <br><br>

            <strong>Dificultad:</strong> ${plan.dificultad}<br>
            <strong>Precio:</strong> $${plan.precio}

            <div class="mt-3">
              <button class="btn btn-agregar btn-reservar">
                📅 Reservar
              </button>

              <button 
                class="btn btn-info btn-ver-mas"
                data-bs-toggle="modal" 
                data-bs-target="#modalSalvajeSignature"
                data-titulo="${plan.nombre}"
                data-descripcion="${plan.descripcion}"
                data-precio="$${plan.precio}"
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

cargarPlanes();

activarCalendarios();

document.addEventListener("click", function(e) {

  const boton = e.target.closest(".btn-ver-mas");

  if (boton) {
    document.getElementById("modalTitulo").textContent = boton.dataset.titulo;
    document.getElementById("modalDescripcion").textContent = boton.dataset.detalle;
    document.getElementById("modalPrecio").textContent = boton.dataset.precio;
    document.getElementById("modalImagen").src = boton.dataset.imagen;
  }

});

document.addEventListener("click", function(e) {
    const btnReservas = e.target.closest(".btn-reservar");
    
    if (btnReservas) {
        const idSeleccionado = btnReservas.dataset.id;

        const planes = JSON.parse(localStorage.getItem("planes")) || [];
        const planParaElCarrito = planes.find(p => p.id == idSeleccionado);

        if (planParaElCarrito) {
            localStorage.setItem("reservaActual", JSON.stringify(planParaElCarrito));
            window.location.href = "Reservas-Usuario.html";
        }
    }
});