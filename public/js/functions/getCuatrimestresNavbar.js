"use strict";

// Referencia al elemento select del ciclo
const selectCuatri = document.getElementById("selectciclo");

// Evento para manejar cambios en el selector
selectCuatri.addEventListener("change", async (e) => {
  try {
    // Configuración de la solicitud fetch
    const configFetch = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        periodo: e.target.value, // Valor seleccionado
      }),
    };

    // Solicitud para actualizar el período en el servidor
    const response = await fetch("/api/update/CuatriXGrupos", configFetch);

    if (!response.ok) {
      throw new Error(`Error en la actualización: ${response.status}`);
    }

    const result = await response.json();
    console.log("Resultado de la actualización:", result);

    // Recargar la página para reflejar cambios
    location.reload();
  } catch (error) {
    console.error("Error durante el cambio de período:", error);
    alert("No se pudo actualizar el período. Por favor, intente nuevamente.");
  }
});

// Función para obtener y mostrar los ciclos en el navbar
const getCuatrisNavbar = async () => {
  try {
    // Solicitud para obtener los ciclos y el período seleccionado
    const response = await fetch("/api/cuatris-navbar");

    if (!response.ok) {
      throw new Error(`Error al obtener ciclos: ${response.status}`);
    }

    const { ciclos, periodoSelected, noCiclos } = await response.json();

    // Vaciar el contenido del select
    selectCuatri.innerHTML = "";

    // Si no hay ciclos, ocultar el bloque del select y mostrar un mensaje
    if (noCiclos) {
      document.getElementById("ciclo-block").style.display = "none";  // Ocultar el bloque
      alert("No hay ciclos disponibles en este momento.");
      return;
    }

    // Construir las opciones para el selector
    let content = "";

    // Mostrar el período ya seleccionado
    if (periodoSelected) {
      content += `<option selected value="${periodoSelected}">${periodoSelected}</option>`;
    } else {
      content += `<option value="none">Todos</option>`;
    }

    // Si el usuario selecciona "Todos", mostrar todos los ciclos sin filtración
    content += ciclos
      .filter(
        (item) => item.CODIGO_CORTO && item.DESCRIPCION && item.CODIGO_CORTO.trim() !== ""
      )
      .reverse()
      .map(
        (item) =>
          `<option value="${item.CODIGO_CORTO}">${item.DESCRIPCION}</option>`
      )
      .join("");

    // Insertar las opciones en el elemento select
    selectCuatri.innerHTML = content;

  } catch (error) {
    console.error("Error al cargar los ciclos del navbar:", error);
    alert("No se pudieron cargar los ciclos. Intente nuevamente más tarde.");
  }
};

// Llamar a la función para cargar los ciclos al iniciar la página
getCuatrisNavbar();
