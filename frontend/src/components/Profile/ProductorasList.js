import React, { useState, useEffect } from "react";
import { getAllProdu } from "../../services/usuarios.service";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export const ProductorasList  = () => {
  const [productoras, setProductoras] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { getAccessTokenSilently } = useAuth0()

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
    } catch (error) {
      console.error("Error al obtener la lista de productoras:", error);
    }
  };

  const filteredProductoras = productoras.filter((prod) =>
    prod.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {filteredProductoras.map((productora) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};
