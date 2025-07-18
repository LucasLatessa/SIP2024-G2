import React, { useState, useEffect } from "react";
import { getAllEventos, updateState } from "../../services/eventos.service";
import { useAuth0 } from "@auth0/auth0-react";

export const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { getAccessTokenSilently } = useAuth0();
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3; // Ajusta la cantidad de eventos por página

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });
      const response = await getAllEventos(token);
      setEvents(response.data);
      setCurrentPage(1); // Reiniciar a página 1 al actualizar datos
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

  // Filtrar eventos por término de búsqueda
  const filteredEvents = events.filter((event) =>
    event.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular eventos a mostrar en la página actual
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Funciones para manejar paginación
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="admin-table-container">
      <h2 className="events-title">Gestión de Estados de Eventos</h2>
      <input
        type="text"
        placeholder="Buscar por nombre de evento"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="buscador"
      />
      <table className="tabla-eventos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map((event) => (
            <tr key={event.id_Evento}>
              <td>{event.nombre}</td>
              <td>
                <select
                  value={event.estado || "PENDIENTE"}
                  onChange={(e) => handleEventStateChange(event.id_Evento, e)}
                  className="estado-select"
                >
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="CANCELADO">CANCELADO</option>
                  <option value="APROBADO">APROBADO</option>
                </select>
              </td>
            </tr>
          ))}
          {currentEvents.length === 0 && (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                No se encontraron eventos.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
