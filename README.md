# Ruta Salvaje — Frontend

Plataforma web de reservas de aventuras al aire libre. Permite a los usuarios explorar planes de aventura, hacer reservas, dejar reseñas y contactar a la empresa. Incluye un panel de administración completo.

---

## Tecnologías

- **HTML5 / CSS3 / JavaScript ES6+** — Sin frameworks ni bundlers
- **Bootstrap 5.3** — Diseño responsivo
- **Flatpickr** — Selector de fechas
- **Font Awesome 6.5** — Iconografía
- **Google Fonts** — Tipografía Montserrat
- **JWT** — Autenticación via Bearer token (almacenado en localStorage)

---

## Requisitos previos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Backend corriendo en `https://back-ruta-salvaje-nos6.onrender.com` (ver sección de configuración)
- No se requieren Node.js, npm ni proceso de build

---

## Cómo arrancar el proyecto

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd RutaSalvaje/Front
```

### 2. Configurar la URL del backend

Abre el archivo [`config.js`](config.js) y verifica que la URL apunte al backend correcto:

```js
// Para desarrollo local (por defecto)
const API_BASE_URL = "https://back-ruta-salvaje-nos6.onrender.com";

// Para producción (Render)
const API_BASE_URL = "https://back-ruta-salvaje-nos6.onrender.com";
```

### 3. Levantar el backend

El frontend consume una API REST en Spring Boot. Asegúrate de que el backend esté corriendo en el puerto configurado antes de abrir el frontend.

> Consulta el README del backend en `../Back/` para instrucciones de arranque.

### 4. Abrir el frontend

**Opción A — Extensión Live Server (VS Code, recomendado):**
1. Instala la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Click derecho sobre `index.html` → **Open with Live Server**

**Opción b — Abrir directamente:**
Doble click sobre `index.html` en el explorador de archivos.
> Nota: algunas peticiones fetch pueden bloquearse por CORS al abrir con `file://`. Se recomienda usar Live Server.

---

## Estructura del proyecto

```
Front/
├── index.html               # Página principal / landing
├── login.html               # Inicio de sesión
├── Registro.html            # Registro de usuarios
├── planes.html              # Catálogo de planes de aventura
├── contacto.html            # Formulario de contacto
├── Sobre_Nosotros.html      # Página "Sobre Nosotros"
├── Reservas-Usuario.html    # Carrito de reservas del usuario
├── Resenas.html             # Reseñas del usuario
├── panel-de-control.html    # Dashboard de administración
├── Reservas.html            # Gestión de reservas (admin)
├── Contactos.html           # Gestión de contactos (admin)
├── nav.html                 # Navbar compartida (componente)
├── footer.html              # Footer compartido (componente)
│
├── config.js                # URL base del backend
├── api.js                   # Utilidades de fetch, toasts, helpers
├── estadoSesion.js          # Gestión de sesión y roles
├── app.js                   # Lógica de la página principal
├── login.js                 # Lógica de login
├── Registro.js              # Lógica de registro
├── planes.js                # Lógica del catálogo de planes
├── panel-de-control.js      # Lógica del panel admin
├── Reservas.js              # Lógica de reservas (admin)
├── Reservas-Usuario.js      # Lógica de reservas (usuario)
├── Resenas.js               # Lógica de reseñas
├── contacto.js              # Lógica del formulario de contacto
├── Contactos.js             # Lógica de contactos (admin)
│
├── *.css                    # Estilos por página
└── imagenes/                # Assets e imágenes del sitio
```

---

## Páginas y flujos principales

### Usuarios no registrados
| Página | Ruta | Descripción |
|--------|------|-------------|
| Landing | `index.html` | Presentación de la empresa y planes destacados |
| Planes | `planes.html` | Catálogo de aventuras con filtros y reseñas |
| Sobre Nosotros | `Sobre_Nosotros.html` | Historia y equipo |
| Contacto | `contacto.html` | Formulario de contacto |
| Login | `login.html` | Inicio de sesión |
| Registro | `Registro.html` | Crear cuenta nueva |

### Usuarios autenticados
| Página | Ruta | Descripción |
|--------|------|-------------|
| Reservas | `Reservas-Usuario.html` | Seleccionar planes, fechas, personas y confirmar reserva |
| Reseñas | `Resenas.html` | Ver y dejar reseñas de planes completados |

### Administradores
| Página | Ruta | Descripción |
|--------|------|-------------|
| Panel de control | `panel-de-control.html` | Dashboard central |
| Reservas (admin) | `Reservas.html` | Ver, filtrar y gestionar todas las reservas |
| Contactos (admin) | `Contactos.html` | Ver mensajes de contacto de clientes |

---

## Autenticación y roles

El sistema usa **JWT almacenado en localStorage**. Al iniciar sesión, el token se guarda junto con los datos del usuario.

- **`ROLE_USER`** — Acceso a reservas y reseñas propias
- **`ROLE_ADMIN`** — Acceso completo al panel de administración

Las páginas protegidas usan `requireLogin()` y `requireAdmin()` definidos en [`estadoSesion.js`](estadoSesion.js). Si el usuario no tiene el rol requerido, es redirigido al login automáticamente.

---

## Endpoints del backend esperados

El frontend consume los siguientes endpoints REST:

```
POST   /auth/login
GET    /usuarios
GET    /planes
GET    /reservas
POST   /reservas
PUT    /reservas/:id
DELETE /reservas/:id
GET    /resenas
POST   /resenas
GET    /contactos
POST   /contactos
```

Todas las peticiones autenticadas envían el header:
```
Authorization: Bearer <token>
```

---

## Categorías de planes

Los planes de aventura se clasifican en:

| Categoría | Descripción |
|-----------|-------------|
| **AVENTURA** | Actividades de exploración y naturaleza |
| **ROMANTICO** | Experiencias para parejas |
| **FAMILIAR** | Actividades aptas para toda la familia |
| **EXTREMO** | Actividades de alto riesgo (escalada, parapente, etc.) |

---

## Despliegue en producción

1. Sube los archivos estáticos a cualquier hosting estático (Netlify, Vercel, GitHub Pages, etc.)
2. Edita [`config.js`](config.js) para que `API_BASE_URL` apunte a la URL del backend en producción
3. Asegúrate de que el backend tenga configurado correctamente el CORS para aceptar peticiones desde el dominio del frontend

---

## Capturas de pantalla

> Las imágenes del sitio se encuentran en la carpeta [`imagenes/`](imagenes/).

---

## Créditos

Proyecto desarrollado como parte de un bootcamp de programación Java Full Stack.

- **Frontend:** Vanilla JS + Bootstrap 5
- **Backend:** Spring Boot (ver directorio `../Back/`)
- **Base de datos:** Documentación disponible en `../data-base/`
