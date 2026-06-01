var RUTA_API_URL = window.RUTA_API_URL
    || localStorage.getItem("RUTA_API_URL")
    || "http://localhost:8080";
var KEY_USUARIO = "usuarioLogueado";
var KEY_TOKEN = "token";

const PLAN_IMAGES = {
    vertigo:       "https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=800&q=85",
    desafio:       "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800&q=85",
    nubes:         "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85",
    secreta:       "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=85",
    selva:         "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=85",
    agua:          "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=85",
    roca:          "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=85",
    horizonte:     "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85",
    colgantes:     "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=85",
    supervivencia: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=85",
    bosque:        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=85",
    salto:         "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=85"
};

function normalizarTexto(valor) {
    return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function getUsuario() {
    try {
        return JSON.parse(localStorage.getItem(KEY_USUARIO));
    } catch (error) {
        localStorage.removeItem(KEY_USUARIO);
        return null;
    }
}

function getToken() {
    return localStorage.getItem(KEY_TOKEN);
}

function getAuthHeaders(extraHeaders = {}) {
    const token = getToken();
    return {
        ...extraHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}

function guardarSesion(data) {
    const usuario = {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: String(data.rol || "").toUpperCase()
    };

    localStorage.setItem(KEY_USUARIO, JSON.stringify(usuario));
    localStorage.setItem(KEY_TOKEN, data.token);
    return usuario;
}

function cerrarSesion() {
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_USUARIO);
    localStorage.removeItem("reservas");
    window.location.href = "index.html";
}

function requireLogin() {
    if (!getUsuario() || !getToken()) {
        cerrarSesion();
        return false;
    }
    return true;
}

function requireAdmin() {
    const usuario = getUsuario();
    if (!usuario || !getToken()) {
        cerrarSesion();
        return false;
    }

    if (usuario.rol !== "ADMIN") {
        window.location.href = "index.html";
        return false;
    }

    return true;
}

function planImagen(plan) {
    if (plan?.imagen) return plan.imagen;

    const nombre = normalizarTexto(plan?.nombre);
    const key = Object.keys(PLAN_IMAGES).find(clave => nombre.includes(clave));
    return key ? PLAN_IMAGES[key] : "./imagenes/planes/Plan-AventuraEnElBosque.png";
}

function planCategoria(plan) {
    return String(plan?.tipoPlan || plan?.categoria || "AVENTURA").toUpperCase();
}

function planDificultad(plan) {
    return String(plan?.dificultad || "MEDIA").toUpperCase();
}

function planEstadoTexto(plan) {
    return plan?.estado === false ? "Inactiva" : "Activa";
}

function planDisponible(plan) {
    return plan?.estado !== false;
}

function precioPlan(plan) {
    const precio = Number(plan?.precio || 0);
    const descuento = Number(plan?.descuentoPorcentaje || 0);
    return Number(plan?.precioFinal || (precio - (precio * descuento / 100)));
}

function formatoPrecio(valor) {
    return Number(valor || 0).toLocaleString("es-CO");
}

function formatoEnum(valor) {
    const texto = String(valor || "").toLowerCase();
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

async function respuestaJson(response) {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return {};
    return response.json();
}

async function apiError(response, fallback) {
    const data = await respuestaJson(response);
    return new Error(data.error || data.message || fallback);
}

function asegurarUiFeedback() {
    if (!document.getElementById("rs-feedback-styles")) {
        const style = document.createElement("style");
        style.id = "rs-feedback-styles";
        style.textContent = `
            .rs-toast-stack {
                position: fixed;
                top: 88px;
                right: 20px;
                z-index: 2000;
                width: min(360px, calc(100vw - 32px));
                display: grid;
                gap: 10px;
            }

            .rs-toast,
            .rs-inline-message,
            .rs-empty-state {
                border: 1px solid rgba(58, 90, 64, .16);
                border-left: 4px solid #3A5A40;
                border-radius: 8px;
                background: #fff;
                color: #243629;
                box-shadow: 0 14px 32px rgba(36, 54, 41, .12);
                padding: 12px 14px;
                font-family: "Montserrat", Arial, sans-serif;
                font-size: .92rem;
                line-height: 1.35;
            }

            .rs-toast.ok,
            .rs-inline-message.ok {
                border-left-color: #3A5A40;
            }

            .rs-toast.error,
            .rs-inline-message.error {
                border-left-color: #B23A2F;
            }

            .rs-toast.info,
            .rs-inline-message.info {
                border-left-color: #E88C2A;
            }

            .rs-empty-state {
                text-align: center;
                background: transparent;
                border: 1px dashed #2a2a2a;
                border-left: 1px dashed #2a2a2a;
                border-radius: 12px;
                box-shadow: none;
                padding: 60px 24px;
                grid-column: 1 / -1;
            }

            .rs-empty-icon {
                display: block;
                font-size: 3rem;
                color: #2e2e2e;
                margin-bottom: 16px;
            }

            .rs-empty-text {
                color: #444;
                font-size: 0.82rem;
                font-weight: 700;
                letter-spacing: 1px;
                text-transform: uppercase;
                margin: 0;
            }

            .rs-confirm-backdrop {
                position: fixed;
                inset: 0;
                z-index: 2100;
                background: rgba(0, 0, 0, 0.75);
                display: grid;
                place-items: center;
                padding: 18px;
            }

            .rs-confirm-card {
                width: min(420px, 100%);
                border-radius: 6px;
                background: #141414;
                border: 1px solid rgba(255, 69, 0, 0.35);
                box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
                padding: 24px;
                font-family: "Montserrat", Arial, sans-serif;
                position: relative;
                overflow: hidden;
            }

            .rs-confirm-card::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0;
                height: 3px;
                background: linear-gradient(to right, #FF4500, #FF8C00);
            }

            .rs-confirm-card h3 {
                margin: 0 0 8px;
                color: #FF8C00;
                font-size: 0.95rem;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 1.5px;
            }

            .rs-confirm-card p {
                margin: 0;
                color: #888888;
                font-size: 0.85rem;
                line-height: 1.5;
            }

            .rs-confirm-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 22px;
                border-top: 1px solid rgba(255, 69, 0, 0.15);
                padding-top: 16px;
            }

            .rs-confirm-actions button {
                border: 0;
                border-radius: 4px;
                padding: 9px 18px;
                font-weight: 700;
                font-family: "Montserrat", Arial, sans-serif;
                font-size: 0.78rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .rs-confirm-cancel {
                background: transparent;
                color: #888888;
                border: 1px solid rgba(255,255,255,0.1) !important;
            }

            .rs-confirm-cancel:hover {
                border-color: rgba(255,69,0,0.3) !important;
                color: #FF4500;
            }

            .rs-confirm-ok {
                background: linear-gradient(135deg, #FF4500, #FF8C00);
                color: #fff;
                box-shadow: 0 4px 14px rgba(255, 69, 0, 0.4);
            }

            .rs-confirm-ok:hover {
                filter: brightness(1.1);
                box-shadow: 0 6px 20px rgba(255, 69, 0, 0.6);
            }
        `;
        document.head.appendChild(style);
    }

    let stack = document.getElementById("rs-toast-stack");
    if (!stack) {
        stack = document.createElement("div");
        stack.id = "rs-toast-stack";
        stack.className = "rs-toast-stack";
        document.body.appendChild(stack);
    }

    return stack;
}

function mostrarToast(mensaje, tipo = "info", duracion = 3600) {
    const stack = asegurarUiFeedback();
    const toast = document.createElement("div");
    toast.className = `rs-toast ${tipo}`;
    toast.textContent = mensaje;
    stack.appendChild(toast);

    window.setTimeout(() => {
        toast.remove();
    }, duracion);
}

function mostrarMensajeInline(destino, mensaje, tipo = "info") {
    const elemento = typeof destino === "string" ? document.querySelector(destino) : destino;
    if (!elemento) {
        mostrarToast(mensaje, tipo);
        return;
    }

    elemento.innerHTML = `<div class="rs-inline-message ${tipo}">${mensaje}</div>`;
}

function estadoVacioHtml(mensaje) {
    return `
        <div class="rs-empty-state">
            <i class="bi bi-inbox rs-empty-icon"></i>
            <p class="rs-empty-text">${mensaje}</p>
        </div>`;
}

function confirmarAccion({
    titulo = "Confirmar acción",
    mensaje = "Esta acción no se puede deshacer.",
    confirmar = "Confirmar",
    cancelar = "Cancelar"
} = {}) {
    asegurarUiFeedback();

    return new Promise(resolve => {
        const backdrop = document.createElement("div");
        backdrop.className = "rs-confirm-backdrop";
        backdrop.innerHTML = `
            <div class="rs-confirm-card" role="dialog" aria-modal="true">
                <h3>${titulo}</h3>
                <p>${mensaje}</p>
                <div class="rs-confirm-actions">
                    <button class="rs-confirm-cancel" type="button">${cancelar}</button>
                    <button class="rs-confirm-ok" type="button">${confirmar}</button>
                </div>
            </div>
        `;

        function cerrar(valor) {
            backdrop.remove();
            resolve(valor);
        }

        backdrop.addEventListener("click", event => {
            if (event.target === backdrop || event.target.closest(".rs-confirm-cancel")) cerrar(false);
            if (event.target.closest(".rs-confirm-ok")) cerrar(true);
        });

        document.body.appendChild(backdrop);
        backdrop.querySelector(".rs-confirm-cancel").focus();
    });
}


function inicializarMenuResponsive() {
    const menu = document.getElementById('menuPrincipal');
    const toggler = document.querySelector('[data-bs-target="#menuPrincipal"]');

    if (!menu || menu.dataset.menuResponsiveListo === "true") return;
    menu.dataset.menuResponsiveListo = "true";

    if (toggler) {
        toggler.addEventListener("click", () => {
            window.setTimeout(() => {
                const estaAbierto = menu.classList.contains("show");
                toggler.setAttribute("aria-expanded", estaAbierto ? "true" : "false");
            }, 0);
        });
    }

    menu.addEventListener("click", event => {
        const link = event.target.closest(".nav-link, .navbar-brand, .btn-login, .btn-logout");
        if (!link) return;

        const bsCollapse = window.bootstrap?.Collapse?.getOrCreateInstance(menu, { toggle: false });
        if (bsCollapse) {
            bsCollapse.hide();
            return;
        }

        menu.classList.remove("show");
        toggler?.setAttribute("aria-expanded", "false");
    });
}

document.addEventListener("DOMContentLoaded", inicializarMenuResponsive);
