const btnMostrarForm = document.getElementById("btnFormAct");
const formContainer = document.getElementById("formContainer");
const form = document.getElementById("formActividad");
const lista = document.getElementById("listaReservas");
const inputFecha = document.getElementById("fecha");

let reservas = JSON.parse(localStorage.getItem("reservasAdmin")) || [];

btnMostrarForm.addEventListener("click", () => {
  if (formContainer.style.display === "none") {
    formContainer.style.display = "block";
  } else {
    formContainer.style.display = "none";
  }
});

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const personas = Number(document.getElementById("personas").value);
  const precio = Number(document.getElementById("precio").value);

  if (personas <= 0) {
    alert("Error: el número de personas debe ser mayor a 0");
    return;
  }

  if (precio <= 0) {
    alert("Error: el precio debe ser mayor a 0");
    return;
  }

  const nuevaReserva = {
  id: Date.now(),
  nombre: document.getElementById("nombre").value, 
  personas: Number(document.getElementById("personas").value),
  dificultad: document.getElementById("dificultad").value,
  precio: Number(document.getElementById("precio").value),
  fecha: document.getElementById("fecha").value,
  estado: "Pendiente"
};

  const reservasAdmin = JSON.parse(localStorage.getItem("reservasAdmin")) || [];
  reservasAdmin.push(nuevaReserva);
  localStorage.setItem("reservasAdmin", JSON.stringify(reservasAdmin));


  console.log(JSON.stringify(reservas));

  form.reset();
  formContainer.style.display = "none";

  mostrarReservas();
});

function mostrarReservas() {
  const reservasAdmin = JSON.parse(localStorage.getItem("reservasAdmin")) || [];
  lista.innerHTML = "";

  reservasAdmin.forEach((reserv) => {
    lista.innerHTML += `
            <div class="col-md-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h5>${reserv.nombre}</h5>


                        <p><strong>Personas:</strong> ${reserv.personas}</p>
                        <p><strong>Dificultad:</strong> ${reserv.dificultad}</p>
                        <p><strong>Precio:</strong> $${reserv.precio}</p>
                        <p><strong>Fecha:</strong> ${reserv.fecha}</p>
                        <p><strong>Estado:</strong> ${reserv.estado}</p>

                         <button class="btn btn-danger btn-sm mt-2"
                            onclick="eliminarReserva(${reserv.id})">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
  });
}

const hoy = new Date().toISOString().split("T")[0];
inputFecha.min = hoy;

function eliminarReserva(id) {
  let reservasAdmin = JSON.parse(localStorage.getItem("reservasAdmin")) || [];

  reservasAdmin = reservasAdmin.filter(r => r.id !== id);

  localStorage.setItem("reservasAdmin", JSON.stringify(reservasAdmin));

  mostrarReservas();
}

mostrarReservas();
