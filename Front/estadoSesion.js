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

        const avatarToggle = el.avatar?.querySelector("a");

        if (usuario.rol === "ADMIN") {
            // Avatar solo decorativo — sin dropdown
            if (avatarToggle) {
                avatarToggle.removeAttribute("data-bs-toggle");
                avatarToggle.classList.remove("dropdown-toggle");
                avatarToggle.style.pointerEvents = "none";
                avatarToggle.href = "javascript:void(0)";
            }
        } else {
            // Usuario normal — avatar sin dropdown tampoco
            if (avatarToggle) {
                avatarToggle.removeAttribute("data-bs-toggle");
                avatarToggle.classList.remove("dropdown-toggle");
                avatarToggle.style.pointerEvents = "none";
            }
        }
    }

    if (usuario && token) {
        el.login?.classList.add("d-none");
        el.logout?.classList.remove("d-none");
        el.avatar?.classList.remove("d-none");
        configurarAvatar(usuario);

        if (usuario.rol === "ADMIN") {
            // Ocultar links de usuario y navegación pública
            el.planes?.classList.add("d-none");
            el.reservas?.classList.add("d-none");
            el.contacto?.classList.add("d-none");
            el.navLoggedIn?.classList.add("d-none");
            document.querySelector('.navbar-nav a[href="index.html"]')?.closest(".nav-item")?.classList.add("d-none");
            document.querySelector('.navbar-nav a[href="Sobre_Nosotros.html"]')?.closest(".nav-item")?.classList.add("d-none");
            // Mostrar "Panel de control" en el navbar
            if (el.reservasAdmin) {
                el.reservasAdmin.classList.remove("d-none");
                const link = el.reservasAdmin.querySelector("a");
                if (link) {
                    link.href = "panel-de-control.html";
                    link.innerHTML = '<i class="bi bi-tools me-1"></i> Panel de control';
                }
            }
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
