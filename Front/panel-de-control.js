const btnMostrarForm = document.getElementById("btnFormAct");
const formContainer = document.getElementById("formContainer");
const form = document.getElementById("formActividad");
const categoria = document.getElementById("categoria");
const nuevaCategoriaContainer = document.getElementById("nuevaCategoriaContainer");
const lista = document.getElementById("listaActividades");

const planes = JSON.parse(localStorage.getItem("planes")) || [];
let editarPlan = null;

btnMostrarForm.addEventListener("click", () => {
  if (formContainer.style.display === "none") {
    formContainer.style.display = "block";
  } else {
    formContainer.style.display = "none";
  }
});


categoria.addEventListener("change", () => {

  if (categoria.value === "nueva") {
    nuevaCategoriaContainer.style.display = "block";
  } else {
    nuevaCategoriaContainer.style.display = "none";
  }
});


form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const fileInput = document.getElementById("imagen");
  const file = fileInput.files[0];

  let categoriaFinal = categoria.value;

  if (categoria.value === "nueva") {
    categoriaFinal = document.getElementById("nuevaCategoria").value;
  }

  const reader = new FileReader();

  reader.onload = function () {

    const nuevoPlan = {
      id: Date.now(),
      nombre: document.getElementById("nombre").value,
      descripcion: document.getElementById("descripcion").value,
      imagen: reader.result,
      categoria: categoriaFinal,
      dificultad: document.getElementById("dificultad").value,
      precio: document.getElementById("precio").value,
      estado: document.getElementById("estado").value,
      actividades: document.getElementById("actividades").value.split(",")
    };

    if (editarPlan) {

      const index = planes.findIndex(p => p.id === editarPlan);
      planes[index] = nuevoPlan;
      editarPlan = null;

      alert("Plan actualizado");

    } else {

      planes.push(nuevoPlan);
      alert("Plan agregado");

    }

    localStorage.setItem("planes", JSON.stringify(planes));

    form.reset();
    formContainer.style.display = "none";

    mostrarPlanes();
  }

  reader.readAsDataURL(file);
});


function mostrarPlanes() {

  lista.innerHTML = "";

  planes.forEach(plan => {
    
    let actividades;

    if (plan.actividades) {
      actividades = plan.actividades.join(", ");
    } else {
      actividades = "No especificadas";
    }


      lista.innerHTML += `
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
              <hr>
              <button class="btn btn-warning btn-sm"onclick="editandoPlan(${plan.id})">Editar</button>
              <button class="btn btn-danger btn-sm"onclick="eliminarPlan(${plan.id})">Eliminar</button>
            </div>
          </div>
        </div>`;
    });
}


function eliminarPlan(id) {

  const confirmar = confirm("¿Eliminar este plan?");
  if (!confirmar) return;

  const index = planes.findIndex(p => p.id === id);

  planes.splice(index, 1);

  localStorage.setItem("planes", JSON.stringify(planes));

  mostrarPlanes();
}


function editandoPlan(id) {

  const plan = planes.find(p => p.id === id);

  document.getElementById("nombre").value = plan.nombre;
  document.getElementById("descripcion").value = plan.descripcion;
  document.getElementById("precio").value = plan.precio;
  document.getElementById("categoria").value = plan.categoria;
  document.getElementById("dificultad").value = plan.dificultad;
  document.getElementById("estado").value = plan.estado;
  document.getElementById("actividades").value = plan.actividades.join(",");

  formContainer.style.display = "block";

  editarPlan = id;
}

mostrarPlanes();
