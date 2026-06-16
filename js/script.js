document.addEventListener('DOMContentLoaded', () => {
    const enlaces = document.querySelectorAll('.nav-link[data-page]');
    const contenedor = document.getElementById('contenidoPagina');
    const offcanvasEl = document.getElementById('menuLateral');
 
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            const pagina = enlace.getAttribute('data-page');
 
            // Marcar enlace activo
            enlaces.forEach(el => el.classList.remove('active'));
            enlace.classList.add('active');
 
            // Cargar contenido mediante fetch
            fetch(pagina)
                .then(respuesta => {
                    if (!respuesta.ok) {
                        throw new Error('No se encontró la página: ' + pagina);
                    }
                    return respuesta.text();
                })
                .then(html => {
                    contenedor.innerHTML = html;
 
                    // Alerta de SweetAlert al cargar correctamente
                    Swal.fire({
                        icon: 'success',
                        title: 'Contenido cargado',
                        text: enlace.textContent.trim(),
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500
                    });
                })
                .catch(error => {
                    contenedor.innerHTML = `
                        <div class="alert alert-warning" role="alert">
                            <strong>Página en construcción.</strong><br>
                            Crea el archivo: <code>${pagina}</code>
                        </div>`;
 
                    Swal.fire({
                        icon: 'error',
                        title: 'No se pudo cargar',
                        text: 'Verifica que el archivo ' + pagina + ' exista.',
                    });
                });
 
            // Cerrar menú en móviles después de seleccionar
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
            if (bsOffcanvas) {
                bsOffcanvas.hide();
            }
        });
    });
});
// Variable global para almacenar las lecciones completadas (evita duplicados)
const practicasCompletadas = new Set();
const TOTAL_PRACTICAS = 20; // Tu menú tiene exactamente 20 prácticas

/**
 * Función que se ejecuta al presionar el botón dentro de las lecciones
 * @param {string} idPractica - Identificador único (ej: 'practica01')
 */
function marcarPracticaCompletada(idPractica) {
    // 1. Verificar si ya estaba completada
    if (practicasCompletadas.has(idPractica)) {
        Swal.fire({
            icon: 'info',
            title: '¡Ya completada!',
            text: 'Esta práctica ya suma a tu barra de progreso.',
            confirmButtonColor: '#4f46e5'
        });
        return;
    }

    // 2. Agregar al registro de completadas
    practicasCompletadas.add(idPractica);

    // 3. Calcular nuevo progreso
    const porcentaje = Math.round((practicasCompletadas.size / TOTAL_PRACTICAS) * 100);

    // 4. Actualizar elementos visuales en el DOM principal
    const barra = document.getElementById('barraProgreso');
    const texto = document.getElementById('porcentajeTexto');

    if (barra && texto) {
        barra.style.width = `${porcentaje}%`;
        barra.setAttribute('aria-valuenow', porcentaje);
        texto.innerText = `${porcentaje}% completado`;
        
        // Si llega al 100%, cambia a color verde de éxito de forma dinámica
        if(porcentaje === 100) {
            barra.style.backgroundColor = '#10b981'; 
        }
    }

    // 5. Alerta de celebración con SweetAlert2
    Swal.fire({
        icon: 'success',
        title: '¡Práctica Completada!',
        text: `Has avanzado en tu camino SQL. Llevas ${practicasCompletadas.size} de ${TOTAL_PRACTICAS} temas.`,
        confirmButtonColor: '#4f46e5',
        timer: 3000,
        timerProgressBar: true
    });
}