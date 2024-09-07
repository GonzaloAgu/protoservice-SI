async function agregarCliente(cliente) {
  try {
    const response = await fetch('/api/cliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cliente)
    });

    const data = await response.json();
    return data.id;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function actualizarCliente(cliente){
  try {
    const response = await fetch('/api/cliente', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( cliente )
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

  $('#nombre-cliente').on('keyup', (event) => {
    event.preventDefault();
    clienteState.exists = clienteState.modified = false;

    if (event.keyCode == 8) { // backspace
      document.getElementById('check-telefono').setAttribute('hidden', '')
    } 

    if (event.keyCode == 9 || event.keyCode == 13) { // enter o tab
      const nombreIngresado = document.getElementById('nombre-cliente').value;
      clientes.forEach((cl) => {
        if (cl.nombre === nombreIngresado) {
          clienteState.exists = true;
          clienteState.modified = false;
          cliente_id = cl.id;
          
          document.getElementById('check-telefono').removeAttribute('hidden', '')

          document.getElementById('telefono-cliente').value = cl.telefono;
          document.getElementById('tipo-input').focus();
          return;
        }
      })
    }
  })

  $('#telefono-cliente').on('keyup', event => {
    event.preventDefault();
    if(clienteState.exists) {
      clienteState.modified = true;
      document.getElementById('check-telefono').setAttribute('hidden', '');
    }
  })

  $('#reparacion-form').on('submit', async(event) => {
    event.preventDefault();
    let form = {};
    if (clienteState.exists && clienteState.modified) {
      
      actualizarCliente({
        id: cliente_id,
        telefono: $('#telefono-cliente').val()
      });
      
    }

    if(!clienteState.exists){
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

    try {
      await fetch('/api/reparacion', {
        body: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
    } catch(error) {
      console.log(error)
    }

  })
}

/* PROCESAMIENTO DE DATOS DEL FORMULARIO */
document.addEventListener('DOMContentLoaded', main);
