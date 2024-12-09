import { badgeColors } from '../src/utils.js';

class ReparacionComponent extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
            <div class="d-flex justify-content-between align-items-center px-2">
              <div class="me-4 col-md-4" id="main-info">
                <h4 class="card-title d-flex align-items-center mb-2">
                <span id="estado" class="badge bg-secondary me-2" style="font-size: 0.75rem;">Pendiente</span>
                  <span id="tipo" class="me-2"></span>
                  <span id="fabricante" class="me-2"></span>
                  <span id="modelo" class="fw-normal text-nowrap"></span>
                </h4>
                <h5 class="card-subtitle mb-2 text-body-secondary text-nowrap">
                  <span id="nombre-cliente"></span>
                  <a id="whatsapp" onclick="event.stopPropagation()" title="Abrir chat de WhatsApp" target="_blank" class="link-underline-opacity-0 link-success ">
                    <i class="fa fa-whatsapp ms-2" aria-hidden="true"></i>
                    <span id="telefono-cliente"></span>
                  </a>
                </h5>
              </div>
              
              
              <div class="text-muted fs-6 pe-5">
                <strong class="fs-5">Nº <span id="nro-reparacion"></span></strong>
                <br>
                
                <span id="fecha-recepcion" styles="font-size: 0.7rem;"></span>
                <br>
              </div>
              <div class="flex-fill">
                <strong class="fs-6">Falla:</strong><p class="card-text" id="descripcion-falla"></p>
              </div>
            </div>
        `;

    
    this.querySelector('#fabricante').textContent = this.getAttribute('fabricante');
    this.querySelector('#modelo').textContent = this.getAttribute('modelo');

    const element = this.querySelector('#estado');
    element.textContent = this.getAttribute('estado');

    // Eliminar las clases que coinciden con el patrón "bg-"
    element.classList.forEach(className => {
      if (className.match(/\b(bg-\w+)/)) {
        element.classList.remove(className);
      }
    });
    const posicion = badgeColors.findIndex(item => item.estado === element.textContent);
    // Agregar la nueva clase
    element.classList.add(badgeColors[posicion].class);

    this.querySelector('#nombre-cliente').textContent = this.getAttribute('nombre-cliente');
    this.querySelector('#tipo').textContent = this.getAttribute('tipo-electro');
    this.querySelector('#telefono-cliente').textContent = this.getAttribute('telefono-cliente')
    this.querySelector('#whatsapp').href = `https://wa.me/54${this.getAttribute('telefono-cliente')}`;
    this.querySelector('#descripcion-falla').textContent = this.getAttribute('desc-falla');
    this.querySelector('#fecha-recepcion').textContent = this.getAttribute('fecha-recepcion');
    this.querySelector('#nro-reparacion').textContent = this.getAttribute('data-id');
  }

  attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'estado' && oldValue !== newValue) {
            this.render(); // Forzar el re-render cuando cambia el atributo 'estado'
        }
    }
}

// Registrar el componente
customElements.define('rep-view', ReparacionComponent);
