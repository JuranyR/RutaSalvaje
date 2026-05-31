const NAV_HTML_FALLBACK = "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <title>Ruta Salvaje |</title>\r\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css\" rel=\"stylesheet\"\r\n        integrity=\"sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB\" crossorigin=\"anonymous\">\r\n    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css\">\r\n    <link rel=\"stylesheet\" href=\"style.css\">\r\n    <link rel=\"stylesheet\" href=\"footer.css\">\r\n    <link rel=\"stylesheet\" href=\"nav.css\">\r\n\r\n    <link href=\"https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700&display=swap\" rel=\"stylesheet\">\r\n</head>\r\n\r\n<body>\r\n\r\n\r\n    <nav class=\"navbar navbar-expand-lg navbar-salvaje fixed-top shadow-sm\">\r\n        <div class=\"container\">\r\n            \r\n            <a class=\"navbar-brand fw-bold\" href=\"index.html\">\r\n                <img class=\"logo\" src=\"./imagenes/Image20260417121620.png\" alt=\"Logo\" width=\"65\" height=\"65\"/>Ruta Salvaje\r\n            </a>\r\n\r\n            \r\n            <button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#menuPrincipal\"\r\n                aria-controls=\"menuPrincipal\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\r\n                <span class=\"navbar-toggler-icon\"></span>\r\n            </button>\r\n\r\n            <div class=\"collapse navbar-collapse\" id=\"menuPrincipal\">\r\n                <ul class=\"navbar-nav ms-auto align-items-center\">\r\n                    <li class=\"nav-item\">\r\n                        <a class=\"nav-link\" href=\"index.html\">Inicio</a>\r\n                    </li>\r\n                    <li class=\"nav-item\">\r\n                        <a class=\"nav-link\" href=\"Sobre_Nosotros.html\">Sobre Nosotros</a>\r\n                    </li>\r\n                    <li class=\"nav-item d-none\" id=\"planes\">\r\n                        <a class=\"nav-link\" href=\"planes.html\">Planes</a>\r\n                    </li>\r\n                    <li class=\"nav-item d-none\" id=\"reservas\">\r\n                        <a class=\"nav-link\" href=\"Reservas-Usuario.html\">Reservas</a>\r\n                    </li>\r\n                    <li class=\"nav-item d-none\" id=\"reservas-admin\">\r\n                        <a class=\"nav-link\" href=\"Reservas.html\">Reservas</a>\r\n                    </li>\r\n                    <li class=\"nav-item\" id=\"nav-contacto\">\n                        <a class=\"nav-link\" href=\"contacto.html\">Contacto</a>\r\n                    </li>\r\n                    \r\n                    \r\n                    <li class=\"nav-item ms-lg-3\" id=\"login\">\r\n                        <a class=\"btn btn-login px-4 py-2\" href=\"login.html\">Iniciar sesión</a>\r\n                    </li>\r\n                    \r\n                    \r\n                    <li class=\"nav-item ms-lg-3 d-none dropdown\" id=\"user-avatar\">\r\n                        <a href=\"javascript:void(0)\" class=\"dropdown-toggle text-decoration-none d-flex align-items-center\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\" style=\"line-height:1;\">\r\n                            <div id=\"avatarUsuario\" class=\"avatar-iniciales\">--</div>\r\n                        </a>\r\n                        <ul class=\"dropdown-menu dropdown-menu-end\" id=\"avatarMenu\"></ul>\r\n                    </li>\r\n\r\n                    \r\n                    <li class=\"nav-item ms-lg-2 d-none\" id=\"logout\">\r\n                        <a class=\"btn btn-logout px-4 py-2 d-none d-lg-inline-block\" href=\"javascript:void(0)\" onclick=\"cerrarSesion()\">Cerrar sesión</a>\r\n                        <a class=\"nav-link d-lg-none logout-mobile\" href=\"javascript:void(0)\" onclick=\"cerrarSesion()\">⏻ Cerrar sesión</a>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n    </nav>\r\n    <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js\"\r\n        integrity=\"sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI\"\r\n        crossorigin=\"anonymous\"></script>\r\n        <script src=\"config.js\"></script>\n        <script src=\"api.js\"></script>\n        <script src=\"estadoSesion.js\"></script>\r\n</body>\r\n\r\n</html>\r\n";
const FOOTER_HTML_FALLBACK = "<footer class=\"site-footer\">\n    <div class=\"container\">\n        <div class=\"row gy-4 align-items-start\">\n            \n            <!-- Columna Marca -->\n            <div class=\"col-md-4 text-center text-md-start\">\n                <h5>Ruta Salvaje</h5>\n                <p>\n                    Plataforma para descubrir <br>\n                    aventuras al aire libre.\n                </p>\n            </div>\n\n            <!-- Columna Navegación -->\n            <div class=\"col-md-4 text-center\">\n                <h5>Navegación</h5>\n                <ul class=\"list-unstyled\">\n                    <li><a href=\"index.html\">Inicio</a></li>\n                    <li><a href=\"Sobre_Nosotros.html\">Sobre Nosotros</a></li>\n                    \n                    <!-- Contenedor dinámico para sesión activa -->\n                    <span id=\"nav-logged-in\" class=\"d-none\">\n                        <li><a href=\"planes.html\">Planes</a></li>\n                        <li><a href=\"Reservas.html\">Reservas</a></li>\n                    </span>\n                    \n                    <li><a href=\"contacto.html\">Contacto</a></li>\n                </ul>\n            </div>\n\n            <!-- Columna Contacto -->\n            <div class=\"col-md-4 text-center text-md-end\">\n                <h5>Contacto</h5>\n                <p>\n                    Bogotá, Colombia<br>\n                    rutasalvaje.admin@gmail.com<br>\n                    +57 315 123 4567\n                </p>\n            </div>\n        </div>\n\n        <hr>\n\n        <!-- Copyright -->\n        <div class=\"text-center\">\n            <small>© 2026 Ruta Salvaje - Todos los derechos reservados</small>\n        </div>\n    </div>\n</footer>";

﻿function cambiarTab(tabId, event) {


  document.querySelectorAll(".tab-content").forEach(el => {
    el.classList.remove("active");
  });

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });


  document.getElementById(tabId).classList.add("active");


  event.target.classList.add("active");
}

function asegurarStylesheet(href) {
    const existe = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .some(link => link.getAttribute("href") === href);

    if (existe) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}

function cargarHtml(url, fallbackHtml) {
    return fetch(url)
        .then(response => response.ok ? response.text() : fallbackHtml)
        .catch(() => fallbackHtml);
}

function insertarFragmento(destinoIds, html, fallback) {
    const fragmento = document.createRange().createContextualFragment(html);
    const destino = destinoIds
        .map(id => document.getElementById(id))
        .find(Boolean);

    if (destino) {
        destino.replaceWith(fragmento);
        return;
    }

    fallback(fragmento);
}

document.addEventListener("DOMContentLoaded", () => {
    asegurarStylesheet("nav.css");
    asegurarStylesheet("footer.css");
    asegurarStylesheet("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");

    if (document.querySelector("nav.navbar")) {
        if (typeof aplicarEstadoSesion === 'function') {
            aplicarEstadoSesion();
        }

        if (typeof inicializarMenuResponsive === 'function') {
            inicializarMenuResponsive();
        }

        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href)) link.classList.add('active');
        });

        return;
    }

    const paginaActual = window.location.pathname.split("/").pop();
    const esPaginaAdmin = ["panel-de-control.html", "Reservas.html", "Resenas.html", "Contactos.html"].includes(paginaActual);

    if (esPaginaAdmin) {
        if (typeof aplicarEstadoSesion === 'function') {
            aplicarEstadoSesion();
        }
        return;
    }

    Promise.all([
        cargarHtml('nav.html', NAV_HTML_FALLBACK),
        cargarHtml('footer.html', FOOTER_HTML_FALLBACK)
    ]).then(([navData, footerData]) => {
        const navDoc = new DOMParser().parseFromString(navData, "text/html");
        const nav = navDoc.querySelector("nav.navbar");
        if (nav) {
            insertarFragmento(["navbar", "navbar-placeholder"], nav.outerHTML, fragmento => document.body.prepend(fragmento));
        }

        const footerDoc = new DOMParser().parseFromString(footerData, "text/html");
        const footer = footerDoc.querySelector("footer.site-footer");
        if (footer) {
            insertarFragmento(["footer", "footer-placeholder"], footer.outerHTML, fragmento => document.body.appendChild(fragmento));
        }
        
        if (typeof aplicarEstadoSesion === 'function') {
            aplicarEstadoSesion();
        }

        if (typeof inicializarMenuResponsive === 'function') {
            inicializarMenuResponsive();
        }
        
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-link').forEach(link => {
            if (currentPath.includes(link.getAttribute('href'))) link.classList.add('active');
        });
    });
});

function agregarColorLink() {
  const currentPath = window.location.pathname;
  const items = document.querySelectorAll('li a')
  items.forEach(item => {
    if (currentPath.includes(item.getAttribute('href'))) {
      item.classList.add('active');
    }
  })
}

function haySesion() {
  return typeof getUsuario === "function" ? getUsuario() : null;
}

function verificarSesion(type) {
  const sesionActiva = haySesion();
  
  // ==========================================
  // SI NO HAY SESIÓN ACTIVA
  // ==========================================
  if (!sesionActiva) {
    if (type === 'nav') {
      document.getElementById("login")?.classList.remove("d-none");
      document.getElementById("logout")?.classList.add("d-none");
      document.getElementById("reservas")?.classList.add("d-none");
      document.getElementById("reservas-admin")?.classList.add("d-none");
      document.getElementById("planes")?.classList.remove("d-none");
    }
    
    // 🌟 NUEVO: Si no hay sesión, nos aseguramos de ocultar los links del footer
    document.getElementById("nav-logged-in")?.classList.add("d-none");
    return;
  }

  // ==========================================
  // SI SÍ HAY SESIÓN ACTIVA
  // ==========================================
  
  // 🌟 NUEVO: Como hay sesión, mostramos los enlaces ocultos del footer siempre
  document.getElementById("nav-logged-in")?.classList.remove("d-none");

  if (type === 'nav') {
    const planes = document.getElementById("planes");
    const reservas = document.getElementById("reservas");
    const login = document.getElementById("login");
    const logout = document.getElementById("logout");
    const contacto = document.getElementById("nav-contacto");
    const reservasAdmin = document.getElementById("reservas-admin");

    login?.classList.add("d-none");
    logout?.classList.remove("d-none");
    planes?.classList.remove("d-none");

    if (sesionActiva.rol === "ADMIN") {
      reservasAdmin?.classList.remove("d-none");
      reservas?.classList.add("d-none");
      contacto?.classList.add("d-none");
    } else {
      reservasAdmin?.classList.add("d-none");
      reservas?.classList.remove("d-none");
    }
  }
}



// Asegúrate de que lo que se llame ejecute la comprobación del footer, por ejemplo:
function aplicarEstadoSesionLegacy() {
    verificarSesion('nav');    // Controla la navbar
    verificarSesion('footer'); // Ejecuta la parte global que acabamos de añadir para el footer
}
