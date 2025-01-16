let downloadInProgress = false; // Variable que indica si hay una descarga en progreso
let successAlertTimeout; // Referencia al temporizador para el mensaje de éxito

function print_canvas() {
    const cuatrimestre = document.getElementById('cuatrimestre').value; // Obtiene el valor seleccionado del cuatrimestre
    const numeroCuatrimestre = cuatrimestre.slice(-1); // Obtiene el último carácter del cuatrimestre seleccionado

    if (!cuatrimestre || isNaN(numeroCuatrimestre)) { // Verifica si el cuatrimestre es válido
        showAlert('Selecciona un cuatrimestre válido', true); // Muestra una alerta con el mensaje de error
        return;
    }

    const gradoElement = document.getElementById('grado');
    gradoElement.textContent = cuatrimestre; // Actualiza el contenido del elemento 'grado' con el valor del cuatrimestre

    const style = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        padding: 20px;
        background-color: #f8f8f8;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        font-family: Arial, sans-serif;
        color: #333;
    `;
    const buttonStyle = `
        margin-right: 10px;
        padding: 8px 20px;
        background-color: #4CAF50;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
    `;
    const buttonStyle2 = `
        margin-right: 10px;
        padding: 8px 20px;
        background-color: red;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
    `;
    const message = `
        <div style="${style}">
            <h3>Descargar Calificación</h3>
            <p>Estás a punto de descargar la calificación como un PDF. ¿Deseas continuar?</p>
            <div id="downloadButtonContainer" style="display: flex; flex-direction: row; justify-content: space-between; width: 100%;">
                <button style="${buttonStyle}" onclick="downloadPDF()">Descargar</button>
                <button style="${buttonStyle2}" onclick="cancelDownload()">Cancelar</button>
            </div>
        </div>
    `;
    showAlert(message); // Muestra la alerta con el mensaje de confirmación
}

function downloadPDF() {
    if (downloadInProgress) { // Verifica si hay una descarga en progreso
        showAlert('La descarga ya está en progreso. Por favor, espera.', false); // Muestra una alerta indicando que ya hay una descarga en progreso
        return;
    }

    const cuatrimestre = document.getElementById('cuatrimestre').value; // Obtiene el valor seleccionado del cuatrimestre
    const numeroCuatrimestre = cuatrimestre.slice(-1); // Obtiene el último carácter del cuatrimestre seleccionado

    if (!cuatrimestre || isNaN(numeroCuatrimestre)) { // Verifica si el cuatrimestre es válido
        showAlert('Selecciona un cuatrimestre válido', false); // Muestra una alerta con el mensaje de error
        removeAlert(); // Elimina la alerta actual
        return;
    }

    downloadInProgress = true; // Marca la descarga como en progreso

    const element = document.getElementById('contenido'); // Obtiene el elemento con el ID 'contenido'

    const img1 = document.createElement('img'); // Crea un elemento de imagen
    img1.src = '../../../imgs/logoUTP.png'; // Establece la ruta de la imagen
    img1.style.width = '179px'; // Establece el ancho de la imagen
    img1.style.position = 'absolute'; // Establece la posición de la imagen
    img1.style.top = '20px';
    img1.style.left = '20px';
    element.appendChild(img1); // Agrega la imagen al elemento 'contenido'

    const downloadButtonContainer = document.getElementById('downloadButtonContainer'); // Obtiene el contenedor de botones de descarga
    if (downloadButtonContainer) {
        downloadButtonContainer.style.display = 'none'; // Oculta el contenedor de botones durante la descarga
    }

    html2pdf()
        .set({
            margin: 0,
            filename: 'Calificacion_Cuatrimestre_' + numeroCuatrimestre + '.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 10 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        })
        .from(element)
        .save()
        .then(() => {
            setTimeout(() => {
                element.removeChild(img1); // Elimina la imagen del elemento 'contenido'
                downloadInProgress = false; // Marca la descarga como completada
                if (downloadButtonContainer) {
                    downloadButtonContainer.style.display = 'flex'; // Muestra nuevamente el contenedor de botones después de la descarga
                }
            }, 0.001);
            showAlert('Descarga completada con éxito', false); // Muestra una alerta indicando que la descarga se completó con éxito
            successAlertTimeout = setTimeout(removeAlert, 3000); // Elimina la alerta de éxito después de 3 segundos
        })
        .catch(error => {
            //console.log(error);
            downloadInProgress = false; // Marca la descarga como fallida
            showAlert('Ha ocurrido un error al generar el PDF. Por favor, inténtalo de nuevo.', false); // Muestra una alerta indicando que ocurrió un error durante la generación del PDF
        });

    removeAlert(); // Elimina la alerta actual
}

function cancelDownload() {
    removeAlert(); // Elimina la alerta actual
}

function showAlert(message, closeButton) {
    const style = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        padding: 20px;
        background-color: #f8f8f8;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        font-family: Arial, sans-serif;
        color: #333;
        display: flex;
        flex-direction: column;
        align-items: center;
    `;

    const container = document.createElement('div'); // Crea un elemento de contenedor
    container.classList.add('alert-container'); // Agrega una clase al contenedor
    container.style.cssText = style; // Aplica estilos al contenedor
    container.innerHTML = message; // Agrega el mensaje al contenedor

    if (closeButton) {
        const buttonStyle = `
            margin-top: 10px;
            padding: 8px 20px;
            background-color: #4CAF50;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
        `;

        const closeButtonText = 'Cerrar';
        const closeButton = document.createElement('button'); // Crea un elemento de botón
        closeButton.style.cssText = buttonStyle; // Aplica estilos al botón
        closeButton.textContent = closeButtonText; // Agrega el texto al botón

        closeButton.addEventListener('click', removeAlert); // Agrega un evento de clic al botón para eliminar la alerta

        container.appendChild(closeButton); // Agrega el botón al contenedor
    }

    document.body.appendChild(container); // Agrega el contenedor al cuerpo del documento
}

function removeAlert() {
    const alert = document.querySelector('.alert-container'); // Busca el elemento de la alerta
    if (alert) {
        alert.remove(); // Elimina la alerta del documento
    }

    if (successAlertTimeout) {
        clearTimeout(successAlertTimeout); // Cancela el temporizador para el mensaje de éxito
        successAlertTimeout = null; // Restablece la referencia del temporizador
    }
}
