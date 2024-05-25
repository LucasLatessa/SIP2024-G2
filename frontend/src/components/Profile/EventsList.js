import React, { useState, useEffect } from "react";
import { getAllEventos, updateState,getEstadoEvento } from "../../services/eventos.service";

export const EventsList = ({ rol }) => {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    if (rol==="ADMINISTRADOR") {
    fetchEvents();}
  }, [rol]);

  const fetchEvents = async () => {
    try {
      const response = await getAllEventos();
      const eventosModificados = await Promise.all(response.data.map(async evento => {
        const estado = await getEstadoEvento(evento.estado);
        return {
          ...evento,
          estado: estado.data.estado
        };
      }));
      setEvents(eventosModificados);
    } catch (error) {
      console.error("Error al obtener la lista de eventos:", error);
    }
  };

  const handleStateChange = async (id_event, newState) => {
    try {
      await updateState(id_event, newState);
      // Actualizar la lista de eventos después de cambiar el estado
      await fetchEvents();
    } catch (error) {
      console.error("Error al cambiar el estado de evento:", error);
    }
  };

  const handleEventStateChange = (id_event, event) => {
    const newState = event.target.value;
    handleStateChange(id_event, newState);
  };
  if (rol==="ADMINISTRADOR") {
    return (
    <div>
      <h2 className="eventsProfile">Lista de Eventos</h2>
      <ul>
        {events.map(event => (
          <li className="eventProfile" key={event.id_Evento}>
            {event.nombre} -  
            <select
              value={event.estado}
              onChange={(e) => handleEventStateChange(event.id_Evento, e)}
            >
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="CANCELADO">CANCELADO</option>
              <option value="APROBADO">APROBADO</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );}else{
    return null;
  }
  
};