"use strict";

const selectCuatri = document.getElementById("selectciclo");

// Función para cambiar el periodo
const cambiarPeriodo = (periodo) => {
  let configFetch = {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      periodo: periodo
    })
  };

  return fetch("/api/update/CuatriXGrupos", configFetch)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error en la actualización: ${res.status}`);
      }
      return res.json();
    });
};

// Evento para cuando el usuario cambia manualmente el periodo
selectCuatri.addEventListener("change", (e) => {
  cambiarPeriodo(e.target.value)
    .then(res => {
      console.log("Periodo actualizado:", res);
      location.reload();
    })
    .catch(err => {
      console.warn("Error al cambiar periodo:", err);
      alert("No se pudo actualizar el período. Por favor, intente nuevamente.");
    });
});

const getCuatrisNavbar = async () => {
  try {
    const res = await fetch("/api/cuatris-navbar");
    
    if (!res.ok) {
      throw new Error(`Error al obtener ciclos: ${res.status}`);
    }
    
    const { ciclos, periodoSelected } = await res.json();

    // Vacía el contenido del select
    selectCuatri.innerHTML = "";

    // Variable para crear las opciones y mandar al Select
    let content = "";

    // Muestra el que ya está seleccionado o el mensaje predeterminado
    if (periodoSelected) {
      content += `<option value="${periodoSelected}">${periodoSelected}</option>`;
    } else {
      content += "<option value='none'>Seleccionar Ciclo</option>";
    }

    // Genera las opciones para todos los ciclos
    ciclos.reverse().forEach(item => {
      // Si el item tiene el código del periodo 2 que queremos, lo marcamos como selected
      const isPeriodo2 = item.CODIGO_CORTO === "2"; // Ajusta este valor según el formato real
      content += `<option value="${item.CODIGO_CORTO}" ${isPeriodo2 ? 'selected' : ''}>${item.DESCRIPCION}</option>`;
    });

    selectCuatri.innerHTML = content;

    // Busca si existe el periodo 2 entre los ciclos disponibles
    const periodo2 = ciclos.find(item => item.CODIGO_CORTO === "2"); // Ajusta según el formato real

    // Si existe el periodo 2 y no es el periodo ya seleccionado, lo seleccionamos automáticamente
    if (periodo2 && periodo2.CODIGO_CORTO !== periodoSelected) {
      selectCuatri.value = periodo2.CODIGO_CORTO;
      
      // Simula un cambio en el select para cargar los datos del periodo 2
      console.log("Cargando automáticamente el periodo 2...");
      cambiarPeriodo(periodo2.CODIGO_CORTO)
        .then(res => {
          console.log("Periodo 2 cargado exitosamente:", res);
          location.reload();
        })
        .catch(err => {
          console.warn("Error al cargar el periodo 2:", err);
        });
    }
  } catch (error) {
    console.error("Error al cargar los ciclos del navbar:", error);
    alert("No se pudieron cargar los ciclos. Intente nuevamente más tarde.");
  }
};

// Iniciar la carga de ciclos
getCuatrisNavbar();