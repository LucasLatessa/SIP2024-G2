import React, { useState, useEffect } from "react";
import { getAllProdu } from "../../services/usuarios.service";
import { Link } from "react-router-dom";

export const ProductorasList = () => {
  const [productoras, setProductoras] = useState([]);

  useEffect(() => {
    fetchProdu();
  }, []);

  const fetchProdu = async () => {
    try {
      const response = await getAllProdu();
      setProductoras(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de productoras:", error);
    }
  };

  return (
    <div className="productoras-container">
      <h2 className="produs-title">Lista de Productoras</h2>
      {productoras.length === 0 ? (
        <p className="no-productoras">No hay productoras disponibles.</p>
      ) : (
        <div className="productora-cards">
          {productoras.map((productora) => (
            <div key={productora.user_id} className="productora-card">
              <h3 className="productora-nickname">{productora.nickname}</h3>
              <Link
                to={`/reporteProdu/${productora.user_id}`}
                className="ver-reporte-btn"
              >
                Ver Reporte
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
