const btnMostrarForm = document.getElementById("btnFormAct")
const formContainer = document.getElementById("formContainer")
const form = document.getElementById("formActividad")

const actividades = [];

// Mostrar / ocultar formulario
btnMostrarForm.addEventListener("click", () => {
  formContainer.style.display =
    formContainer.style.display === "none" ? "block" : "none";
});

//Agregar actividad
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nuevaActividad = {
    id: Date.now(),
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    categoria: document.getElementById("categoria").value,
    dificultad: document.getElementById("dificultad").value,
    precio: document.getElementById("precio").value,
    estado: document.getElementById("estado").value
  };

  actividades.push(nuevaActividad);

  console.log(JSON.stringify(actividades, null, 2));

  form.reset();
  formContainer.style.display = "none";

  mostrarActividad()

});

function mostrarActividad() {

    
}



