document.addEventListener('DOMContentLoaded', function () {
    generarCaptcha(); // Generar el CAPTCHA al cargar la página
});

let captcha; // Variable para almacenar el CAPTCHA generado

// Función para generar un CAPTCHA
function generarCaptcha() {
    captcha = Math.floor(Math.random() * 9000) + 1000; // Número aleatorio de 4 dígitos
    document.getElementById('captchaText').innerText = captcha; // Mostrar el CAPTCHA en el HTML
}

function consultarEstado() {
    const dni = document.getElementById('dni')?.value;
    const captchaInput = document.getElementById('captchaInput')?.value;
    const resultadoDiv = document.getElementById('resultado');

    if (!dni || !captchaInput) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Validar CAPTCHA en el frontend
    if (captchaInput != captcha) {
        alert('CAPTCHA incorrecto. Intenta de nuevo.');
        generarCaptcha(); // Generar un nuevo CAPTCHA
        document.getElementById('captchaInput').value = ''; // Limpiar el campo de entrada
        return;
    }

    // Enviar solicitud al servidor
    fetch('https://docente-cepreuna-production.up.railway.app/api/consultar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dni: dni,
            captchaInput: captchaInput, // Enviar el CAPTCHA ingresado por el usuario
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; }); // Manejar errores del servidor
        }
        return response.json();
    })
    .then(data => {
        // Determinar la clase CSS para el estado (APTO o NO APTO)
        const estadoClass = data.estado === "Apto" ? "estado-apto" : "estado-no-apto";

        // Determinar el mensaje adicional según el estado
        const mensajeAdicional = data.estado === "Apto" ?
            "La asignación de carga horaria será paulatinamente mientras los estudiantes se vayan inscribiendo al nuevo ciclo marzo-julio 2025 del CEPREUNA. No todos los APTOS tendrán carga horaria, pero son elegibles para ello." :
            "Gracias por su participación.";

        // Mostrar los resultados con los estilos aplicados
        resultadoDiv.innerHTML = `
            <div class="resultado">
                <p class="nombre">Nombre: <strong>${data.nombre}</strong></p>
                <p class="${estadoClass}">Estado: ${data.estado}</p>
                <p class="texto-adicional">${mensajeAdicional}</p>
            </div>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
        resultadoDiv.innerHTML = `<p>Error: ${error.error || 'No se pudo cargar la información.'}</p>`;
        generarCaptcha(); // Generar un nuevo CAPTCHA en caso de error
    });
}
