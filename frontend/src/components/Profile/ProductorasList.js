import React, { useState, useEffect } from "react";
import { getAllProdu } from "../../services/usuarios.service";
import { Link } from "react-router-dom";

// Componente para modificar el estado de las productoras, solo si es administrador
export const ProductorasList = () => {
  const [productoras, setProductoras] = useState([]);

  // Solamente si es administrador muestra las productoras
  useEffect(() => {
    fetchProdu();
  }, []);

  // Trae todas las productoras junto con los estados
  const fetchProdu = async () => {
    try {
      const response = await getAllProdu();
      setProductoras(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de productoras:", error);
    }
  };
  return (
    <>
      <h2 className="produsProfile">Lista de Productoras</h2>
      {productoras.length === 0 ? (
        <p>No hay productoras disponibles.</p>
      ) : (
        <ul className="productoras-list">
          {productoras.map((productora) => (
            <li key={productora.user_id} className="productora-item">
              {productora.nickname} - 
              <Link className="verReporteAdmin" to={`/reporteProdu/${productora.user_id}`}>Ver Reporte</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
