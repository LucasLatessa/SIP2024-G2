import React, { useState, useEffect } from "react";
import {
  getAllEventos,
  updateState
} from "../../services/eventos.service";

//Componente para modificar el estado de los eventos, solamente si es administrador
export const EventsList = () => {
  const [events, setEvents] = useState([]);

  //Solamente si es administrador muestra los eventos
  useEffect(() => {
      fetchEvents();
  }, []);

  //Trae todos los eventos y junto con los estados
  const fetchEvents = async () => {
    try {
      const response = await getAllEventos();
      setEvents(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de eventos:", error);
    }
  };

  //Actualiza los eventos
  const handleStateChange = async (id_event, newState) => {
    try {
      await updateState(id_event, newState);
      // Actualizar la lista de eventos después de cambiar el estado
      await fetchEvents();
    } catch (error) {
      console.error("Error al cambiar el estado de evento:", error);
    }
  };

  //Encargado de obtener el estado cada vez que cambia y enviarle al handleStateChange para que lo actualize
  const handleEventStateChange = (id_event, event) => {
    const newState = event.target.value;
    handleStateChange(id_event, newState);
  };

    return (
      <div>
        <h2 className="eventsProfile">Lista de Eventos</h2>
        <ul>
          {events.map((event) => (
            <li className="eventProfile" key={event.id_Evento}>
              {event.nombre} -
              <select
                value={event.estado}
                onChange={(e) => handleEventStateChange(event.id_Evento, e)} //Siempre que cambia se actualiza
              >
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="CANCELADO">CANCELADO</option>
                <option value="APROBADO">APROBADO</option>
              </select>
            </li>
          ))}
        </ul>
      </div>
    );
};
