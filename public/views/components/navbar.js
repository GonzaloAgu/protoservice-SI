class NavBarComponent extends HTMLElement {
    constructor() {
        super();
        // Crear un shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });

        // Contenido HTML de la barra de navegación
        const navTemplate = document.createElement('template');
        navTemplate.innerHTML = `
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
            <nav class="navbar navbar-expand-lg bg-body-tertiary mb-4 rounded col-md-12 mx-auto">
                <div class="container-fluid">
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item mx-2">
                                <a class="nav-link" href="/nuevareparacion">
                                    <i class="fa fa-plus me-2" aria-hidden="true"></i>NUEVA REPARACION
                                </a>
                            </li>
                            <li class="nav-item mx-2">
                                <a class="nav-link" href="/consulta">
                                    <i class="fa fa-search me-2" aria-hidden="true"></i>BUSCAR REPARACIONES
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
        `;

        // Adjuntar estilos y contenido al shadow DOM
        shadow.appendChild(navTemplate.content.cloneNode(true));
    }
}

// Registrar el componente
customElements.define('nav-bar', NavBarComponent);
