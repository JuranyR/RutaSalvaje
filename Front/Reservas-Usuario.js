const cards = [
    {
        id: 1,
        nombre: "Plan Ruta del vértigo",
        descripción: " Puente tibetano, Bungee Jumping, Canopy",
        precio: 310.000,
        personas: 1,
        img: "./imagenes/planes/Plan-RutaDelVertigo.png/80"

    }
];

const lista = document.getElementById("lista-reservas");

function guardarReserva(){
    let planGuardado = JSON.parse(localStorage.getItem(""))
}



const montoTotal = document.getElementById("montoTotal");

function calcular() {
  const precio = parseInt(selectPlan.value) || 0;
  const cantidad = parseInt(numPersonas.value) || 1;
  const total = precio * cantidad;
  montoTotal.innerText = "$" + total.toLocaleString("es-CO");
}

selectPlan.addEventListener("change", calcular);
numPersonas.addEventListener("input", calcular);

document.getElementById("formFinal").addEventListener("submit", function (e) {
  e.preventDefault();
  alert(
    "¡Reserva recibida! Nos pondremos en contacto contigo pronto para los detalles del pago.",
  );
  window.location.href = "Sobre_:Sobre_Nosotros.html";
});


