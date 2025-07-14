import React, { useState, useEffect } from "react";
import {
  getAllEventos,
  updateState
} from "../../services/eventos.service";

export const EventsList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getAllEventos();
      setEvents(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de eventos:", error);
    }
  };

  const handleStateChange = async (id_event, newState) => {
    try {
      await updateState(id_event, newState);
      await fetchEvents();
    } catch (error) {
      console.error("Error al cambiar el estado de evento:", error);
    }
  };

  const handleEventStateChange = (id_event, event) => {
    const newState = event.target.value;
    handleStateChange(id_event, newState);
  };

  return (
    <div className="eventos-admin-container">
      <h2 className="events-title">Gestión de Estados de Eventos</h2>
      <div className="event-cards">
        {events.map((event) => (
          <div className={`event-card estado-${event.estado.toLowerCase()}`} key={event.id_Evento}>
            <h3 className="event-nombre">{event.nombre}</h3>
            <label className="estado-label">
              Estado:
              <select
                className="estado-select"
                value={event.estado}
                onChange={(e) => handleEventStateChange(event.id_Evento, e)}
              >
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="CANCELADO">CANCELADO</option>
                <option value="APROBADO">APROBADO</option>
              </select>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
