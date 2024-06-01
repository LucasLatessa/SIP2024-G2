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

  return (
    <main>
        <Header />
        <div className="reporteEvento">
            <header className="header">
                <img className="imagenEvento" src={reporte.imagen} alt={reporte.evento} />
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
            </section>
            <section className="entries">
                <h2>Cantidad de Entradas Vendidas: {reporte.entradas_totales}</h2>
                <h2>Entradas por tipo:</h2>
                <ul>
                {Object.entries(reporte.entradas_por_tipo).map(([tipo, cantidad]) => (
                    <li key={tipo}>{tipo}: {cantidad}</li>
                ))}
                </ul>
            </section>
        </div>
        <Footer />
    </main>
  );
};