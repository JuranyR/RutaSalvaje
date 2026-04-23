flatpickr("#btn-reservar", {
    enableTime: false,
    dateFormat: "d-m-Y",
    minDate: "today" // Evita que reserven en el pasado
});

useEffect(() => {
  const planes = JSON.parse(localStorage.getItem("planes")) || [];
  setPlanes(planes);
}, []);
