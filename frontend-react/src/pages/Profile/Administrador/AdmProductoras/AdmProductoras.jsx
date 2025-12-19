import React, { useEffect, useState } from "react";
import "./AdmProductoras.css";
import { getAllProdu } from "../../../../services/usuarios.service";
import { Link } from "react-router-dom";
import DataGuard from "../../../../components/DataGuards.jsx";

function AdmProductoras() {
  const [productoras, setProductoras] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Solamente si es administrador muestra las productoras
  useEffect(() => {
    fetchProdu();
  }, []);

  // Trae todas las productoras junto con los estados
  const fetchProdu = async () => {
    try {
      const response = await getAllProdu();
      setProductoras(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de productoras:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
    <DataGuard cargando={cargando}>
      <article className="admProductoras">
        <h1>Administracion de Productoras</h1>
        <hr />
        <ul className="allListaProductorasAdm">
          {productoras.map((productora) => (
            <li key={productora.user_id} className="productora">
              <p>{productora.nickname}</p>
              <Link
                className="verReporteAdmin"
                to={`reporte/${productora.user_id}`}
              >
                Ver Reporte
              </Link>
            </li>
          ))}
        </ul>
      </article>
      </DataGuard>
    </>
  );
}

export default AdmProductoras;
