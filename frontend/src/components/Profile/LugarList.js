import React, { useState, useEffect } from "react";
import { getAllLugares } from "../../lugar.service"; // Asegúrate que esta función existe y trae lugares
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export const LugaresList = () => {
  const [lugares, setLugares] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { getAccessTokenSilently } = useAuth0();
  const [currentPage, setCurrentPage] = useState(1);
  const lugaresPerPage = 3;

  useEffect(() => {
    fetchLugares();
  }, []);

  const fetchLugares = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });
      const response = await getAllLugar(token);
      setLugares(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error al obtener la lista de lugares:", error);
    }
  };

  // Filtrar lugares por nombre de lugar
  const filteredLugares = lugares.filter((lugar) =>
    lugar.lugar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLast = currentPage * lugaresPerPage;
  const indexOfFirst = indexOfLast - lugaresPerPage;
  const currentLugares = filteredLugares.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredLugares.length / lugaresPerPage);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="admin-table-container">
      <h2 className="produs-title">Lista de Lugares</h2>

      {/* Botón para dar de alta un nuevo lugar */}
      <div style={{ marginBottom: "15px" }}>
        <Link className="btn btn-primary">
          Agregar Nuevo Lugar
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por lugar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="buscador"
      />

      <table className="tabla-eventos">
        <thead>
          <tr>
            <th>Lugar</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {currentLugares.length > 0 ? (
            currentLugares.map((lugar) => (
              <tr key={lugar.id}> {/* Asumo que el id se llama id */}
                <td>{lugar.lugar}</td>
                <td>{lugar.direccion}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                No se encontraron lugares.
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
