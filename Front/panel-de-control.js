const btnMostrarForm = document.getElementById("btnFormAct");
const formContainer = document.getElementById("formContainer");
const form = document.getElementById("formActividad");
const categoria = document.getElementById("categoria");
const nuevaCategoriaContainer = document.getElementById("nuevaCategoriaContainer");
const lista = document.getElementById("listaActividades");

let planes = JSON.parse(localStorage.getItem("planes")) || [];


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

    planes.push(nuevoPlan);

    localStorage.setItem("planes", JSON.stringify(planes));
    alert("¡Plan agregado!");

    form.reset();
    formContainer.style.display = "none";

    mostrarPlanes();
  };

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
              <strong>Dificultad:</strong> ${plan.dificultad}<br><strong>Precio:</strong> $${plan.precio}
            </div>
          </div>
        </div>`;
    });
}

mostrarPlanes();
console.log(mostrarPlanes())