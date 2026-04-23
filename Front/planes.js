flatpickr("#btn-reservar", {
    enableTime: false,
    dateFormat: "d-m-Y",
    minDate: "today" // Evita que reserven en el pasado
});

import { mostrarPlanes } from "./panel-de-control";

console.log(mostrarPlanes);
