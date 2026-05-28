function cambiarTab(tabId, event) {

 
  document.querySelectorAll(".tab-content").forEach(el => {
    el.classList.remove("active");
  });

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  
  document.getElementById(tabId).classList.add("active");

 
  event.target.classList.add("active");
}

document.addEventListener("DOMContentLoaded", function() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
            verificarSesion('footer');

        });
});

document.addEventListener("DOMContentLoaded", function() {
    fetch('nav.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
            verificarSesion('nav');
            agregarColorLink()
        });
});

function agregarColorLink() {
  const currentPath = window.location.pathname;
  const items = document.querySelectorAll('li a')
  items.forEach(item=> {
    if(currentPath.includes(item.getAttribute('href'))) {
      item.classList.add('active');
    }
  })
}

function haySesion() {
  return JSON.parse(localStorage.getItem("sesionActiva"));
}

function verificarSesion(type) {
  const sesionActiva = haySesion();

  if(type === 'nav') {
    const planes = document.getElementById("planes");
    const reservas = document.getElementById("reservas");
    const login = document.getElementById("login");
    const logout = document.getElementById("logout");

    if (sesionActiva) {
        planes.classList.remove("d-none");
        reservas.classList.remove("d-none");
        login.classList.add("d-none");
        logout.classList.remove("d-none");
    }
  } else if(type === 'footer') {
    const isLogin = document.getElementById("nav-logged-in");
    if (sesionActiva) {
        isLogin.classList.remove("d-none");
    }
  }
}

function cerrarSesion() {
    const isLogin = document.getElementById("nav-logged-in");
    const login = document.getElementById("login");
    const logout = document.getElementById("logout");

    localStorage.removeItem("sesionActiva");
    logout.classList.add("d-none");
    login.classList.remove("d-none");
    isLogin.classList.add("d-none");
    window.location.href = "inicio.html";
}