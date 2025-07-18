import React, { useState, useEffect } from "react";
import { getAllProdu } from "../../services/usuarios.service";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export const ProductorasList = () => {
  const [productoras, setProductoras] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { getAccessTokenSilently } = useAuth0();
  const [currentPage, setCurrentPage] = useState(1);
  const productorasPerPage = 10; // Ajusta aquí el tamaño de página

  useEffect(() => {
    fetchProdu();
  }, []);

  const fetchProdu = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });
      const response = await getAllProdu(token);
      setProductoras(response.data);
      setCurrentPage(1); // Reiniciar a página 1 al actualizar datos o búsqueda
    } catch (error) {
      console.error("Error al obtener la lista de productoras:", error);
    }
  };

  // Filtrar productoras por búsqueda
  const filteredProductoras = productoras.filter((prod) =>
    prod.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cálculo paginación
  const indexOfLast = currentPage * productorasPerPage;
  const indexOfFirst = indexOfLast - productorasPerPage;
  const currentProductoras = filteredProductoras.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProductoras.length / productorasPerPage);

  // Funciones para cambiar página
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
      <h2 className="produs-title">Lista de Productoras</h2>
      <input
        type="text"
        placeholder="Buscar por nickname"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="buscador"
      />

      <table className="tabla-eventos">
        <thead>
          <tr>
            <th>Nickname</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {currentProductoras.length > 0 ? (
            currentProductoras.map((productora) => (
              <tr key={productora.user_id}>
                <td>{productora.nickname}</td>
                <td>
                  <Link
                    to={`/reporteProdu/${productora.user_id}`}
                    className="ver-reporte-btn"
                  >
                    Ver Reporte
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                No se encontraron productoras.
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
