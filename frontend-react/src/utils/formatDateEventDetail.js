export function formatDateEventDetail(fecha, hora) {
  if (!fecha || !hora) return { fecha: "", hora: "" };

  const fechaCompleta = new Date(`${fecha}T${hora}`);

  const opcionesFecha = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  };

  const opcionesHora = {
    hour: "2-digit",
    minute: "2-digit",
  };

  let fechaFormateada = fechaCompleta.toLocaleDateString("es-ES", opcionesFecha);
  let horaFormateada = fechaCompleta.toLocaleTimeString("es-ES", opcionesHora);

  // Capitalizar primera letra (Miércoles → Miércoles)
  fechaFormateada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

  return {
    fecha: fechaFormateada,
    hora: horaFormateada,
  };
}