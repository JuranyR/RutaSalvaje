flatpickr("#btn-reservar", {
  enableTime: false,
  dateFormat: "d-m-Y",
  minDate: "today" // Evita que reserven en el pasado
});

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
          <img src="${plan.imagen}">
          <div class="card-body">
            <h5>${plan.nombre}</h5>
            <p>${plan.descripcion}</p>
            <p><strong>Incluye:</strong> ${actividades}</p>
            <span class="badge bg-success">${plan.categoria}</span>
            <br><br>
            <strong>Dificultad:</strong> ${plan.dificultad}<br>
            <strong>Precio:</strong> $${plan.precio}
          </div>
        </div>
      </div>
    `;
  });
}

cargarPlanes();;
