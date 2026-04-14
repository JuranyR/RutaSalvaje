function cambiarTab(tabId, event) {

  // ocultar todo
  document.querySelectorAll(".tab-content").forEach(el => {
    el.classList.remove("active");
  });

  // quitar activo a tabs
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  // mostrar seleccionado
  document.getElementById(tabId).classList.add("active");

  // activar tab
  event.target.classList.add("active");
}