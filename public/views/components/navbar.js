class NavBarComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
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
        `;
    }
}

// Registrar el componente
customElements.define('nav-bar', NavBarComponent);

