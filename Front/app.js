const planesBase = [
  {
    "id": 1,
    "nombre": "Plan Ruta del vértigo",
    "descripcion": "Puente tibetano, Bungee Jumping, Canopy.",
    "detalle": "Atrévete a cruzar puentes colgantes sobre cascadas, sentir la adrenalina del bungee y deslizarte entre montañas. Incluye guías expertos y una experiencia segura pero extrema.",
    "precio": 310000,
    "categoria": "Extremo",
    "dificultad": "Alta",
    "estado": "Activa",
    "actividades": [
      "Puente tibetano",
      "Bungee Jumping",
      "Canopy"
    ],
    "imagen": "./imagenes/planes/Plan-RutaDelVertigo.png"
  },
  {
    "id": 2,
    "nombre": "Plan Desafío Total",
    "descripcion": "Canotaje, Bungee Jumping.",
    "detalle": "Sumérgete en una jornada de pura adrenalina enfrentando rápidos en canotaje y el vértigo del bungee jumping.",
    "precio": 380000,
    "categoria": "Adrenalina",
    "dificultad": "Alta",
    "estado": "Activa",
    "actividades": [
      "Canotaje",
      "Bungee Jumping"
    ],
    "imagen": "./imagenes/planes/Plan-DesafioTotal.png"
  },
  {
    "id": 3,
    "nombre": "Plan Explorador de las nubes",
    "descripcion": "Parapente, Canopy.",
    "detalle": "Disfruta de vistas panorámicas volando en parapente y recorriendo circuitos de canopy entre montañas.",
    "precio": 420000,
    "categoria": "Aire",
    "dificultad": "Media",
    "estado": "Activa",
    "actividades": [
      "Parapente",
      "Canopy"
    ],
    "imagen": "./imagenes/planes/Plan-ExploradordelasNubes.png"
  },
  {
    "id": 4,
    "nombre": "Plan Misión secreta: Operación Selva",
    "descripcion": "Búsqueda de pistas, retos físicos y mentales.",
    "detalle": "Participa en una experiencia inmersiva tipo juego donde deberás resolver pistas y superar retos en equipo.",
    "precio": 310000,
    "categoria": "Familiar",
    "dificultad": "Media",
    "estado": "Activa",
    "actividades": [
      "Búsqueda de pistas",
      "Retos en equipo",
      "Pruebas físicas",
      "Pruebas mentales"
    ],
    "imagen": "./imagenes/planes/Plan-MisionSecretaOperacionSelva.png"
  },
  {
    "id": 5,
    "nombre": "Plan Agua y roca",
    "descripcion": "Canotaje, Torrentismo, Nado en río.",
    "detalle": "Explora ríos y cascadas combinando canotaje, torrentismo y nado en aguas naturales.",
    "precio": 290000,
    "categoria": "Agua",
    "dificultad": "Media",
    "estado": "Activa",
    "actividades": [
      "Canotaje",
      "Torrentismo",
      "Nado en río",
      "Exploración de cascadas"
    ],
    "imagen": "./imagenes/planes/Plan-AguayRoca.png"
  },
  {
    "id": 6,
    "nombre": "Plan Travesía del horizonte",
    "descripcion": "Senderismo, Camping, Parapente.",
    "detalle": "Una experiencia completa de aventura y conexión natural con senderismo y vuelo en parapente.",
    "precio": 460000,
    "categoria": "Corporativo",
    "dificultad": "Alta",
    "estado": "Activa",
    "actividades": [
      "Senderismo",
      "Camping",
      "Parapente",
      "Avistamiento de fauna"
    ],
    "imagen": "./imagenes/planes/Plan-TravesiaDelHorizonte.png"
  },
  {
    "id": 7,
    "nombre": "Plan Caminos colgantes",
    "descripcion": "Senderos elevados y puentes colgantes.",
    "detalle": "Recorre senderos elevados y cruza puentes colgantes en una experiencia segura para familias.",
    "precio": 160000,
    "categoria": "Familiar",
    "dificultad": "Baja",
    "estado": "Activa",
    "actividades": [
      "Senderos en altura",
      "Puentes colgantes",
      "Circuito de equilibrio"
    ],
    "imagen": "./imagenes/planes/Plan-CaminosColgantes.png"
  },
  {
    "id": 8,
    "nombre": "Plan Supervivencia extrema",
    "descripcion": "Supervivencia básica y orientación.",
    "detalle": "Aprende técnicas básicas de supervivencia y construcción de refugios en un entorno natural.",
    "precio": 340000,
    "categoria": "Extremo",
    "dificultad": "Alta",
    "estado": "Activa",
    "actividades": [
      "Supervivencia",
      "Construcción de refugios",
      "Senderismo",
      "Orientación"
    ],
    "imagen": "./imagenes/planes/Plan-Desafios.png"
  },
  {
    "id": 9,
    "nombre": "Plan Aventura en el bosque",
    "descripcion": "Caminatas ecológicas y juegos de aventura.",
    "detalle": "Disfruta de caminatas ecológicas y exploración de flora en medio del bosque.",
    "precio": 195000,
    "categoria": "Familiar",
    "dificultad": "Baja",
    "estado": "Activa",
    "actividades": [
      "Caminatas ecológicas",
      "Exploración de flora",
      "Juegos de aventura"
    ],
    "imagen": "./imagenes/planes/Plan-AventuraEnElBosque.png"
  },
  {
    "id": 10,
    "nombre": "Plan El salto del caminante",
    "descripcion": "Trekking, rappel y bungee jumping.",
    "detalle": "Camina por la montaña y culmina con un salto extremo lleno de adrenalina.",
    "precio": 245000,
    "categoria": "Adrenalina",
    "dificultad": "Media",
    "estado": "Activa",
    "actividades": [
      "Trekking",
      "Ascenso a miradores",
      "Bungee Jumping",
      "Rappel"
    ],
    "imagen": "./imagenes/planes/Plan-SaltoDelCaminante.png"
  }
]

function inicializarPlanes() {
  try {
    const planesLocales = JSON.parse(localStorage.getItem("planes"));
    if (!planesLocales || planesLocales.length === 0) {
      localStorage.setItem("planes", JSON.stringify(planesBase));
    }
  } catch (error) {
    console.error("Error leyendo el localStorage. Reiniciando datos base.");
    localStorage.setItem("planes", JSON.stringify(planesBase));
  }
}

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
  inicializarPlanes();
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
    window.location.href = "index.html";
}