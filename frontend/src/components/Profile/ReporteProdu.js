import { useEffect, useState } from "react";
import { getProduReport } from "../../services/usuarios.service";
import { useParams } from "react-router-dom";

import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import "./styles/Profile.css";

export const ReporteProdu = () => {
  const [reporte, setReporte] = useState(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("");
  const [ordenSeleccionado, setOrdenSeleccionado] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const response = await getProduReport(id);
        setReporte(response.data);
      } catch (error) {
        console.error("Error al obtener el reporte de productora");
      }
    };

    fetchReporte();
  }, [id]);

  const handleEventoChange = (e) => {
    setEventoSeleccionado(e.target.value);
  };

  const handleOrdenChange = (e) => {
    setOrdenSeleccionado(e.target.value);
  };

  const eventosFiltrados = reporte?.eventos
    .filter((evento) =>
      eventoSeleccionado ? evento.evento === eventoSeleccionado : true
    )
    .sort((a, b) => {
      if (ordenSeleccionado === "tickets") {
        return b.entradas_totales - a.entradas_totales;
      } else if (ordenSeleccionado === "recaudado") {
        return b.ganancia_total - a.ganancia_total;
      } else if (ordenSeleccionado === "asistencia") {
        return b.asistencia_total - a.asistencia_total;
      }
      return 0;
    });

  if (!reporte) {
    return <div>Cargando reporte...</div>;
  }

  return (
    <main>
      <Header />
      <div className="reporteProdu">
        <header className="header">
          <h1>Reporte de Productora: {reporte.productora}</h1>
        </header>
        <section className="stats">
          <article className="stat">
            <h2>ENTRADAS TOTALES VENDIDAS</h2>
            <p>{reporte.total_entradas_vendidas}</p>
          </article>
          <article className="stat">
            <h2>GANANCIA TOTAL</h2>
            <p>${reporte.total_ganancia}</p>
          </article>
          <article className="stat">
            <h2>ASISTENCIA TOTAL</h2>
            <p>{reporte.total_asistencia}</p>
          </article>
        </section>
        <section className="events">
          <h2>Eventos de la Productora</h2>
          <section className="filtros">
            <h3>Filtros:</h3>
            <select id="evento-select" value={eventoSeleccionado} onChange={handleEventoChange}>
              <option value="">Todos los eventos</option>
              {reporte.eventos.map((evento, index) => (
                <option key={index} value={evento.evento}>
                  {evento.evento}
                </option>
              ))}
            </select>
            <select id="orden-select" value={ordenSeleccionado} onChange={handleOrdenChange}>
              <option value="">Ordenar por</option>
              <option value="tickets">Más tickets vendidos</option>
              <option value="recaudado">Más recaudado</option>
              <option value="asistencia">Mayor asistencia</option>
            </select>
          </section>
          {eventosFiltrados.map((evento, index) => (
            <div key={index} className="event">
              <h3>{evento.evento}</h3>
              <p>Entradas Totales: {evento.entradas_totales}</p>
              <p>Ganancia Total: ${evento.ganancia_total}</p>
              <p>Asistencia Total: {evento.asistencia_total}</p>
              <h4>Entradas por Tipo:</h4>
              <ul className="event-entradas-list">
                {Object.entries(evento.entradas_por_tipo).map(([tipo, cantidad]) => (
                  <li key={tipo} className="event-entradas-item">{tipo}: {cantidad}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
      <Footer />
    </main>
  );
};
