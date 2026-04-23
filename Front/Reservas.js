const btnMostrarForm = document.getElementById("btnFormAct");
const formContainer = document.getElementById("formContainer");
const form = document.getElementById("formActividad");
const lista = document.getElementById("listaReservas");
const inputFecha = document.getElementById("fecha");

let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

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
    plan: document.getElementById("categoria").value,
    personas: personas,
    dificultad: document.getElementById("dificultad").value,
    precio: precio,
    dia: document.getElementById("fecha").value,
  };

  reservas.push(nuevaReserva);

  localStorage.setItem("reservas", JSON.stringify(reservas));

  console.log(JSON.stringify(reservas));

  form.reset();
  formContainer.style.display = "none";

  mostrarReservas();
});

function mostrarReservas() {
  lista.innerHTML = "";

  reservas.forEach((reserv) => {
    lista.innerHTML += `
            <div class="col-md-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h5>${reserv.nombre}</h5>

                        <p>
                            <strong>Plan:</strong> ${reserv.plan}
                        </p>
                        <p>
                            <strong>Personas:</strong> ${reserv.personas}
                        </p>
                        <p>
                            <strong>Dificultad:</strong> ${reserv.dificultad}
                        </p>
                        <p>
                            <strong>Precio:</strong> $${reserv.precio}
                        </p>
                        <p>
                            <strong>Fecha:</strong> $${reserv.dia}
                        </p>

                        <button
                            class="btn btn-danger btn-sm mt-2"
                            onclick="eliminarReserva(${reserv.id})"
                        >
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
  reservas = reservas.filter((reserva) => reserva.id !== id);

  localStorage.setItem("reservas", JSON.stringify(reservas));

  mostrarReservas();
}

mostrarReservas();
