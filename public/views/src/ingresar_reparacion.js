async function agregarCliente(cliente) {

  const response = await fetch('/api/cliente', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cliente)
  });

  const data = await response.json();
  return data.id;
}

async function actualizarCliente(cliente) {
  try {
    const response = await fetch('/api/cliente', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cliente)
    });

    const data = await response.json();
    return data; // Devuelve los datos para que estén disponibles en el siguiente 'then'

  } catch (error) {
    console.error(error);
    throw error; // Lanza el error para que pueda ser manejado en el 'catch' del 'then'
  }
}

/* BUSQUEDA DE OPCIONES */

// Tipos de producto
fetch('/api/tipos')
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
fetch('/api/fabricantes')
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

let clientes = [];
let cliente_id = null;
let clienteState = {
  exists: false,
  modified: false
}


function main() {

  $('#nombre-cliente').focus()

  $(() => {
    // Se obtienen los clientes para el autocompletado.
    fetch('api/cliente')
      .then(res => res.json())
      .then(data => {
        clientes = data;
        const nombresClientes = data.map(cliente => cliente.nombre);
        $("#nombre-cliente").autocomplete({
          source: nombresClientes,
          minLength: 2,
          open: function (event, ui) {
            $('.ui-autocomplete').addClass('dropdown-menu bg-dark text-light');
            $('.ui-menu-item').addClass('dropdown-item');
          }
        });
      }
      )
      .catch(error => console.error(error))
  });

  $('#nombre-cliente').on('keydown', (event) => {

    clienteState.exists = clienteState.modified = false;

    if (event.keyCode == 8) { // backspace
      document.getElementById('check-telefono').setAttribute('hidden', '')
    }

    if (event.keyCode == 9 || event.keyCode == 13) { // enter o tab
      event.preventDefault();

      // Busco cliente en mi array con el correspondiente nombre
      const clientExist = clientes.some((cl) => {
        if (cl.nombre === document.getElementById('nombre-cliente').value) {

          // Seteo al cliente como que existe
          clienteState.exists = true;
          clienteState.modified = false;

          // Guardo su ID para posterior uso en formulario
          cliente_id = cl.id;

          // Doy feedback y paso al siguiente campo, skipeo telefono
          document.getElementById('check-telefono').removeAttribute('hidden', '');
          document.getElementById('telefono-cliente').value = cl.telefono;
          document.getElementById('tipo-input').focus();

          return true; // Esto detendrá el bucle `some`
        }
      });

      // Si el cliente no existe, ingresamos su telefono
      if (!clientExist) document.getElementById('telefono-cliente').focus();;
    }
  })

  $('#telefono-cliente').on('keyup', event => {
    event.preventDefault();
    if (clienteState.exists) {
      clienteState.modified = true;
      document.getElementById('check-telefono').setAttribute('hidden', '');
    }
  })

  $('#reparacion-form').on('submit', async (event) => {
    event.preventDefault();
    $('#loading-spinner').css('display', 'block');

    let form = {};

    try {
      if (clienteState.exists && clienteState.modified) {

        actualizarCliente({
          id: cliente_id,
          telefono: $('#telefono-cliente').val()
        });

      }

      if (!clienteState.exists) {
        cliente_id = await agregarCliente({
          nombre: $('#nombre-cliente').val(),
          telefono: $('#telefono-cliente').val()
        })
        form.id_cliente = cliente_id;
      }

      form = {
        id_cliente: cliente_id,
        tipo_electro_id: $('#tipo-input').val(),
        fabricante_id: $('#fabricante-input').val(),
        modelo_electro: $('#modelo-input').val(),
        desc_falla: $('#desc-fallo').val()
      }
      const response = await fetch('/api/reparacion', {
        body: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })

      data = await response.json();

      $('#successPopup')
        .removeClass('alert-danger')
        .addClass('alert-success')
        .addClass('show')
        .text(`La reparación ${data.reparacion_id} ha sido agregada con éxito.`);

      setTimeout(() => {
        window.location.href("/reparacion?id=" + data.reparacion_id);
      }, 1000);
    } catch (error) {
      $('#successPopup')
        .addClass('show')
        .removeClass('alert-success')
        .addClass('alert-danger')
        .html(`<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Se produjo un error al agregar la reparación: ${error.message}`);
      console.log(error)
    } finally {
      $('#loading-spinner').css('display', 'none');
      setTimeout(() => $('#successPopup').removeClass('show'), 5000);
    }

  })
}

document.addEventListener('DOMContentLoaded', main);
