import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import "./AdmEventos.css";
import {
  getAllEventos,
  getEstadoEvento,
  updateState,
} from "../../../../services/eventos.service";
import toast from "react-hot-toast";

function AdmEventos() {
  const [events, setEvents] = useState([]);
  const { usuario, role, photo } = useOutletContext();

  //Solamente si es administrador muestra los eventos
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getAllEventos();
      const eventosModificados = await Promise.all(
        response.data.map(async (evento) => {
          const estado = await getEstadoEvento(evento.estado);
          return {
            ...evento,
            estado: estado.data.estado,
          };
        })
      );
      setEvents(eventosModificados);
    } catch (error) {
      console.error("Error al obtener la lista de eventos:", error);
    }
  };

  // //Actualiza los eventos
  // const handleStateChange = async (id_event, newState) => {
  //   try {
  //     await updateState(id_event, newState);
  //     // Actualizar la lista de eventos después de cambiar el estado
  //     await fetchEvents();
  //     toast.success("Evento actualizado correctamente!")
  //   } catch (error) {
  //     console.error("Error al cambiar el estado de evento:", error);
  //   }
  // };

  const handleStateChange = async (id_event, newState) => {

    const procesoDeActualizacion = async () => {
      await updateState(id_event, newState);
      await fetchEvents(); // Esperamos a que recargue la lista
    };

    // Notificacion
    toast.promise(procesoDeActualizacion(), {
      loading: "Actualizando evento...",
      success: "¡Evento actualizado correctamente!",
      error: "No se pudo actualizar el evento.",
    });
  };

  //Encargado de obtener el estado cada vez que cambia y enviarle al handleStateChange para que lo actualize
  const handleEventStateChange = (id_event, event) => {
    const newState = event.target.value;
    handleStateChange(id_event, newState);
  };

  return (
    <>
      <article className="admEventos">
        <h1>Administracion de Eventos</h1>
        <hr />
        <ul className="allListaEventosAdm">
          {events.map((event) => (
            <li className="eventoAdm" key={event.id_Evento}>
              <h3>{event.nombre}</h3>

              <img
                src={event.imagen}
                alt={`Imagen del evento ${event.nombre}`}
                className="imgEventoAdm"
              />

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
      </article>
    </>
  );
}

export default AdmEventos;
