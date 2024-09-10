class ReparacionComponent extends HTMLElement {
    // Observar los atributos
    static get observedAttributes() {
        return ['data-id']; // Atributo que contiene la ID
    }

    constructor() {
        super();
        this.apiURL = '/api/reparacion'; // URL base de la API (ajustar según sea necesario)
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
              <div class="me-5 col-md-3">
                <h4 class="card-title d-flex align-items-center mb-2">
                <span id="estado" class="badge bg-secondary me-2" style="font-size: 0.75rem;">Pendiente</span>
                  <span id="fabricante" class="me-2"></span>
                  <span id="modelo" class="fw-normal text-nowrap"></span>
                </h4>
                <h5 class="card-subtitle mb-2 text-body-secondary">
                  <span id="nombre-cliente"></span>
                  <a id="whatsapp" title="Abrir chat de WhatsApp" target="_blank" class="link-underline-opacity-0 link-success">
                    <i class="fa fa-whatsapp ms-2" aria-hidden="true"></i>
                    <span id="telefono-cliente"></span>
                  </a>
                </h5>
              </div>
              
              <div class="mb-4 fs-5 flex-fill px-5">
                <strong>Falla</strong><p class="card-text" id="descripcion-falla"></p> <!-- Descripción de la falla -->
              </div>
              
              <div class="text-muted fs-5 pe-5">
                <strong>Ingreso</strong><br>
                <span id="fecha-recepcion"></span> <!-- Fecha de recepción -->
              </div>
            </div>
        `;

        this.querySelector('#fabricante').textContent = this.getAttribute('fabricante');
        this.querySelector('#modelo').textContent = this.getAttribute('modelo');
        this.querySelector('#estado').textContent = this.getAttribute('estado');
        this.querySelector('#nombre-cliente').textContent = this.getAttribute('nombre-cliente');
        this.querySelector('#telefono-cliente').textContent = this.getAttribute('telefono-cliente')
        this.querySelector('#whatsapp').href = `https://wa.me/54${this.getAttribute('telefono-cliente')}`;
        this.querySelector('#descripcion-falla').textContent = this.getAttribute('desc-falla');
        this.querySelector('#fecha-recepcion').textContent = this.getAttribute('fecha-recepcion');
    }
}

// Registrar el componente
customElements.define('rep-view', ReparacionComponent);
