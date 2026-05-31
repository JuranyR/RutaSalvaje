function aplicarEstadoSesion() {
    const usuario = typeof getUsuario === "function" ? getUsuario() : null;
    const token = typeof getToken === "function" ? getToken() : null;

    const el = {
        login: document.getElementById("login"),
        logout: document.getElementById("logout"),
        reservas: document.getElementById("reservas"),
        reservasAdmin: document.getElementById("reservas-admin"),
        planes: document.getElementById("planes"),
        contacto: document.getElementById("nav-contacto"),
        avatar: document.getElementById("user-avatar"),
        avatarTexto: document.getElementById("avatarUsuario"),
        avatarMenu: document.getElementById("avatarMenu"),
        navLoggedIn: document.getElementById("nav-logged-in")
    };

    function inicialesUsuario(usuario) {
        const base = String(usuario?.nombre || usuario?.email || "US").trim();
        const partes = base.includes("@")
            ? [base.charAt(0), base.split("@")[0].charAt(1)]
            : base.split(/\s+/).slice(0, 2).map(parte => parte.charAt(0));

        return partes.join("").toUpperCase() || "US";
    }

    function configurarAvatar(usuario) {
        if (el.avatarTexto) {
            el.avatarTexto.textContent = inicialesUsuario(usuario);
        }

        const avatarLink = el.avatar?.querySelector("a");
        if (avatarLink) {
            avatarLink.href = "javascript:void(0)";
        }

        if (!el.avatarMenu) return;

        const links = usuario.rol === "ADMIN"
            ? [
                { href: "panel-de-control.html", icon: "bi-tools", text: "Panel de control" },
                { href: "Reservas.html", icon: "bi-calendar-check-fill", text: "Reservas" },
                { href: "Contactos.html", icon: "bi-envelope-fill", text: "Contactos" }
            ]
            : [
                { href: "Reservas-Usuario.html", icon: "bi-bag-check-fill", text: "Mis reservas" }
            ];

        el.avatarMenu.innerHTML = links.map(item => `
            <li>
                <a class="dropdown-item" href="${item.href}">
                    <i class="bi ${item.icon} me-2"></i>${item.text}
                </a>
            </li>
        `).join("");
    }

    if (usuario && token) {
        el.login?.classList.add("d-none");
        el.logout?.classList.remove("d-none");
        el.planes?.classList.remove("d-none");
        el.avatar?.classList.remove("d-none");
        configurarAvatar(usuario);

        if (usuario.rol === "ADMIN") {
            el.planes?.classList.add("d-none");
            el.reservasAdmin?.classList.remove("d-none");
            el.reservas?.classList.add("d-none");
            el.contacto?.classList.add("d-none");
            el.navLoggedIn?.classList.add("d-none");
        } else {
            el.planes?.classList.remove("d-none");
            el.reservasAdmin?.classList.add("d-none");
            el.reservas?.classList.remove("d-none");
            el.contacto?.classList.remove("d-none");
            el.navLoggedIn?.classList.remove("d-none");
        }
        return;
    }

    el.login?.classList.remove("d-none");
    el.logout?.classList.add("d-none");
    el.reservas?.classList.add("d-none");
    el.reservasAdmin?.classList.add("d-none");
    el.planes?.classList.remove("d-none");
    el.avatar?.classList.add("d-none");
    el.contacto?.classList.remove("d-none");
    el.navLoggedIn?.classList.add("d-none");
}
