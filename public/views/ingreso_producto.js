let dniCliente;

function tildarElemento(id){
  document.getElementById(id).insertAdjacentHTML("afterbegin", ' <i class="fa fa-check-circle" aria-hidden="true"></i> ');
}

function mostrarInfoCliente(nodoPadre, nodoHijo, data) {
  console.log(data)
  nodoHijo.style.display = "flex";
  nodoHijo.style.alignItems = "center";
  nodoHijo.style.padding = '0 30px';
  nodoHijo.innerHTML = `<b>Nombre</b>: ${data.cliente.nombre.slice(0, 25)}`;
  nodoPadre.append(nodoHijo.cloneNode(true));
  nodoHijo.innerHTML = `<b>Tel</b>: ${data.cliente.telefono || 'Sin definir'}`;
  nodoPadre.append(nodoHijo.cloneNode(true));
}

function agregarCampos() {
  const form = document.getElementById('nombre-form');
  const campoNombre = document.createElement('label');
  campoNombre.setAttribute('class', 'third')
  campoNombre.innerHTML = `Nombre y apellido(*)<input id="nombre-input" type="text" maxlength="50" required>`;

  const campoTelefono = document.createElement('label');
  campoTelefono.setAttribute('class', 'third');
  campoTelefono.innerHTML = `Teléfono(*) <input id="telefono-input" type="number" maxlength="12" required>`;

  form.appendChild(campoNombre);
  form.appendChild(campoTelefono);

  campoNombre.focus();
}

async function agregarCliente(cliente) {
  try {
    const response = await fetch('nuevareparacion/agregarcliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cliente })
    });

    const data = await response.json();
    tildarElemento('dni-label');
    return data; // Devuelve los datos para que estén disponibles en el siguiente 'then'

  } catch (error) {
    console.error(error);
    throw error; // Lanza el error para que pueda ser manejado en el 'catch' del 'then'
  }
}

const popupIngresarCliente = () => {
  agregarCampos();
  const formPopup = document.getElementById('cliente-form');
  formPopup.addEventListener('submit', async (event) => {
    event.preventDefault();
    let nuevoCliente = {
      dni: dniCliente,
      nombre: document.getElementById('nombre-input').value,
      telefono: document.getElementById('telefono-input').value
    }
    agregarCliente(nuevoCliente)
      .then(response => {
        if (response.agregado) {
          document.getElementById('cliente-fieldset').setAttribute('disabled', 'true');
          document.getElementById('producto-fieldset').removeAttribute('disabled');
          document.getElementById('tipo-input').focus();
        }
      })
      .catch((error) => {
        alert('Se produjo un error al agregar un cliente. Recargue e intente nuevamente.')
        console.log(error)
      });
  })
}

/* BUSQUEDA DE OPCIONES */

// Tipos de producto
fetch('/tipo-productos')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al obtener las opciones');
    }
    return response.json();
  })
  .then(data => {
    const datalist = document.getElementById('tipo-input');
    data.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.id;
      optionElement.text = option.descripcion;
      datalist.appendChild(optionElement);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });


// Fabricantes
fetch('/tipo-productos/fabricante')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al obtener las opciones');
    }
    return response.json();
  })
  .then(data => {
    const datalist = document.getElementById('fabricante-input');
    data.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.id;
      optionElement.text = option.descripcion;
      datalist.appendChild(optionElement);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });

function main(){
    document.getElementById('cliente-form').addEventListener('submit', event => {
      event.preventDefault();
      let dni = document.getElementById('dni-input');
      if (!dniCliente) {
        dni.setAttribute('disabled', 'true');
        dniCliente = dni.value;
        fetch('/nuevareparacion/obtenercliente', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ dni: dniCliente })
        })
          .then(response => {
            return response.json();
          })
          .then(data => {
            let nodoPadre = document.getElementById('nombre-form');
            let nodoHijo = document.createElement('div');
            if (data.existe) {
              // indicar que se encontro cliente, mostrar nombre y telefono (si existen)
              tildarElemento('dni-label')
              mostrarInfoCliente(nodoPadre, nodoHijo, data);
              const fieldsetProducto = document.getElementById('producto-fieldset');
              fieldsetProducto.removeAttribute('disabled');
            } else {
              // indicar que el cliente no existe y añadir los campos para rellenar con datos de nuevo cliente
              popupIngresarCliente();
            }
          })
          .catch(error => {
            console.error('Error al enviar la solicitud de cliente:', error);
          })
      }
    })
  
    let formData;
  
    document.getElementById('producto-form').addEventListener('submit', function (event) {
      event.preventDefault(); // Evita que el formulario se envíe automáticamente
  
      // Obtiene los valores de los campos del formulario
      let tipo = document.getElementById('tipo-input').value;
      let fabricante = document.getElementById('fabricante-input').value;
      let modelo = document.getElementById('modelo-input').value;
      let falla = document.getElementById('falla-input').value;
  
      // Crea un objeto con los datos del formulario
      formData = {
        dni: dniCliente,
        tipo,
        fabricante,
        modelo,
        falla
      };
  
      // Realiza una solicitud POST al servidor Node.js
      fetch('/nuevareparacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log('Respuesta del servidor:', data);
          document.getElementById('producto-fieldset').setAttribute('disabled', 'true');
          const popup = document.getElementById('successPopup');
          popup.classList.add('show');
          setTimeout(() => {
            window.location.href = '/reparacion?id=' + (data.id);
          }, 1000);
          ;
        })
        .catch(function (error) {
          const popup = document.getElementById('successPopup');
          popup.classList.add('fail');
          console.error('Error al enviar la solicitud:', error);
        });
    });
  }

/* PROCESAMIENTO DE DATOS DEL FORMULARIO */
document.addEventListener('DOMContentLoaded', main);
