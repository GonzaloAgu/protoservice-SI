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

/* PROCESAMIENTO DE DATOS DEL FORMULARIO */
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('survey-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    // Obtiene los valores de los campos del formulario
    let tipo = document.getElementById('tipo-input').value;
    let fabricante = document.getElementById('fabricante-input').value;
    let modelo = document.getElementById('modelo-input').value;
    let falla = document.getElementById('falla-input').value;
    let dni = document.getElementById('dni-input').value;
    let nombre = document.getElementById('nombre-input').value;
    let telefono = document.getElementById('telefono-input').value;

    // Crea un objeto con los datos del formulario
    let formData = {
      tipo,
      fabricante,
      modelo,
      falla,
      dni,
      nombre,
      telefono
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
        // Hacer algo con la respuesta del servidor si es necesario
      })
      .catch(function (error) {
        console.error('Error al enviar la solicitud:', error);
      });
  });
});
