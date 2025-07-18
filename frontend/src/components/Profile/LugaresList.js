import React, { useState, useEffect } from "react";
import { getAllLugares, crearLugar } from "../../services/lugar.service";
import { useAuth0 } from "@auth0/auth0-react";

export const LugaresList = () => {
  const [lugares, setLugares] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nuevoLugar, setNuevoLugar] = useState({ nombre: "", direccion: "" }); 
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
      const response = await getAllLugares(token);
      setLugares(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error al obtener la lista de lugares:", error);
    }
  };

  const handleCrearLugar = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });
      await crearLugar(nuevoLugar, token);
      await fetchLugares();
      setShowModal(false);
      setNuevoLugar({ nombre: "", direccion: "" }); 
    } catch (error) {
      console.error("Error al crear el lugar:", error);
    }
  };

  const filteredLugares = lugares.filter((lugar) =>
    lugar.nombre.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

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

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
  };

  const inputStyle = {
    width: "100%",
    marginBottom: "10px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  return (
    <div className="admin-table-container">
      <h2 className="produs-title">Lista de Lugares</h2>

      <div style={{ marginBottom: "15px" }}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Agregar Nuevo Lugar
        </button>
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
            <th>Direccion</th>
          </tr>
        </thead>
        <tbody>
          {currentLugares.length > 0 ? (
            currentLugares.map((lugar) => (
              <tr key={lugar.id_Lugar}>
                <td>{lugar.nombre}</td>
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

      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3>Nuevo Lugar</h3>
            <input
              type="text"
              placeholder="Nombre del lugar"
              value={nuevoLugar.nombre}
              onChange={(e) =>
                setNuevoLugar({ ...nuevoLugar, nombre: e.target.value })
              }
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Direccion"
              value={nuevoLugar.direccion}
              onChange={(e) =>
                setNuevoLugar({ ...nuevoLugar, direccion: e.target.value })
              }
              style={inputStyle}
            />
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button className="btn btn-success" onClick={handleCrearLugar}>
                Guardar
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
