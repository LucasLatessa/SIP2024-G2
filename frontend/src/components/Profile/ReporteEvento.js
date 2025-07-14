import { useEffect, useState } from "react";
import { getEventReport } from "../../services/eventos.service";
import { useParams } from "react-router-dom";

import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import "./styles/Profile.css";

export const ReporteEvento = () => {
  const [reporte, setReporte] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const response = await getEventReport(id);
        setReporte(response.data);
      } catch (error) {
        console.error("Error al obtener el reporte del evento");
      }
    };

    fetchReporte();
  }, [id]);

  if (!reporte) {
    return <div>Cargando reporte...</div>;
  }

  // Función para calcular porcentaje respecto a total de entradas
  const calcularPorcentaje = (cantidad, total) => {
    return total === 0 ? 0 : ((cantidad / total) * 100).toFixed(2);
  };

  return (
    <main>
      <Header />
      <div className="reporteEvento">
        <header className="header">
          <img
            className="imagenEvento"
            src={reporte.imagen}
            alt={reporte.evento}
            style={{ maxWidth: "300px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
          />
          <h1>{reporte.evento}</h1>
        </header>

        <section className="stats">
          <article className="stat">
            <h2>ASISTENCIA TOTAL</h2>
            <p>{reporte.asistencia_total}</p>
          </article>
          <article className="stat">
            <h2>GANANCIA TOTAL</h2>
            <p>${reporte.ganancia_total}</p>
          </article>
          <article className="stat">
            <h2>ENTRADAS TOTALES VENDIDAS</h2>
            <p>{reporte.entradas_totales}</p>
          </article>
        </section>

        <section className="entries">
          <h2>Entradas por Tipo</h2>
          <table className="tabla-eventos">
            <thead>
              <tr>
                <th>Tipo de Entrada</th>
                <th>Cantidad</th>
                <th>Porcentaje (%)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(reporte.entradas_por_tipo).map(([tipo, cantidad]) => (
                <tr key={tipo}>
                  <td>{tipo}</td>
                  <td>{cantidad}</td>
                  <td>{calcularPorcentaje(cantidad, reporte.entradas_totales)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      <Footer />
    </main>
  );
};
