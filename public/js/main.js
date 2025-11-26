document.addEventListener('DOMContentLoaded', () => {
    // Función para cargar datos de la API
    async function cargarDatos() {
        try {
            const response = await fetch('/api/public/data'); // Endpoint del backend
            const data = await response.json();

            // Actualizar precios
            document.getElementById('precio-magna').textContent = data.precios.magna;
            document.getElementById('precio-premium').textContent = data.precios.premium;
            document.getElementById('precio-diesel').textContent = data.precios.diesel;

            // Actualizar horarios
            document.getElementById('horario-combustible').textContent = data.horarios.combustible;
            document.getElementById('horario-caja').textContent = data.horarios.caja;

            // Actualizar métodos de pago
            const listaMetodosPago = document.getElementById('lista-metodos-pago');
            listaMetodosPago.innerHTML = ''; // Limpiar antes de insertar
            data.metodosPago.forEach(metodo => {
                const p = document.createElement('p');
                p.textContent = metodo; // Aquí podrías hacer un formato más complejo si tienes iconos, etc.
                listaMetodosPago.appendChild(p);
            });

            // Actualizar contactos en el footer
            document.getElementById('footer-telefono').textContent = data.contacto.telefono;
            document.getElementById('footer-correo').textContent = data.contacto.correo;

            // Aquí puedes actualizar más secciones como calidad y servicios
            // ...
        } catch (error) {
            console.error('Error al cargar los datos públicos:', error);
            // Mostrar un mensaje al usuario si los datos no se cargan
        }
    }

    // Cargar datos al iniciar la página
    cargarDatos();

    // Lógica para enviar el formulario de sugerencias
    const formSugerencias = document.getElementById('form-sugerencias');
    formSugerencias.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evitar el envío tradicional del formulario

        const formData = new FormData(formSugerencias); // Recoge todos los datos del formulario, incluyendo archivos

        try {
            const response = await fetch('/api/public/sugerencia', {
                method: 'POST',
                body: formData // FormData se envía directamente, los navegadores manejan el multipart/form-data
            });

            if (response.ok) {
                alert('¡Tu sugerencia ha sido enviada con éxito!');
                formSugerencias.reset(); // Limpiar el formulario
            } else {
                alert('Hubo un error al enviar tu sugerencia. Por favor, intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Hubo un problema de conexión. Por favor, intenta de nuevo.');
        }
    });
});