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
  const [lugarSeleccionado, setLugarSeleccionado] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
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

  const handleEventoChange = (e) => setEventoSeleccionado(e.target.value);
  const handleOrdenChange = (e) => setOrdenSeleccionado(e.target.value);
  const handleLugarChange = (e) => setLugarSeleccionado(e.target.value);
  const handleFechaDesdeChange = (e) => setFechaDesde(e.target.value);
  const handleFechaHastaChange = (e) => setFechaHasta(e.target.value);

  const eventosFiltrados = reporte?.eventos
    .filter((evento) => {
      const cumpleEvento = eventoSeleccionado ? evento.evento === eventoSeleccionado : true;
      const cumpleLugar = lugarSeleccionado ? evento.lugar === lugarSeleccionado : true;

      const cumpleFecha =
        (!fechaDesde || evento.fecha >= fechaDesde) &&
        (!fechaHasta || evento.fecha <= fechaHasta);

      return cumpleEvento && cumpleLugar && cumpleFecha;
    })
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

  const calcularPorcentaje = (valor, total) => {
    return total === 0 ? 0 : Number(((valor / total) * 100).toFixed(2));
  };

  const asistenciaClase = (porcentaje) => {
    return porcentaje < 30.0 ? "asistencia-baja" : "";
  };

  const lugaresUnicos = [...new Set(reporte.eventos.map((e) => e.lugar))];

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

            <label>
              Evento:
              <select value={eventoSeleccionado} onChange={handleEventoChange}>
                <option value="">Todos los eventos</option>
                {reporte.eventos.map((evento, index) => (
                  <option key={index} value={evento.evento}>
                    {evento.evento}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Lugar:
              <select value={lugarSeleccionado} onChange={handleLugarChange}>
                <option value="">Todos los lugares</option>
                {lugaresUnicos.map((lugar, index) => (
                  <option key={index} value={lugar}>
                    {lugar}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Desde:
              <input
                type="date"
                value={fechaDesde}
                onChange={handleFechaDesdeChange}
              />
            </label>

            <label>
              Hasta:
              <input
                type="date"
                value={fechaHasta}
                onChange={handleFechaHastaChange}
              />
            </label>

            <label>
              Ordenar:
              <select value={ordenSeleccionado} onChange={handleOrdenChange}>
                <option value="">Ordenar por</option>
                <option value="tickets">Más tickets vendidos</option>
                <option value="recaudado">Más recaudado</option>
                <option value="asistencia">Mayor asistencia</option>
              </select>
            </label>
          </section>

          <table className="tabla-eventos">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Lugar</th>
                <th>Fecha</th>
                <th>Entradas Totales</th>
                <th>Ganancia Aportada</th>
                <th>Asistencia</th>
                <th>Entradas por Tipo</th>
              </tr>
            </thead>
            <tbody>
              {eventosFiltrados.map((evento, index) => {
                const entradasPct = calcularPorcentaje(evento.entradas_totales, reporte.total_entradas_vendidas);
                const gananciaPct = calcularPorcentaje(evento.ganancia_total, reporte.total_ganancia);
                const asistenciaPct = calcularPorcentaje(evento.asistencia_total, reporte.total_asistencia);

                return (
                  <tr key={index} className={asistenciaClase(asistenciaPct)}>
                    <td>{evento.evento}</td>
                    <td>{evento.lugar}</td>
                    <td>{evento.fecha}</td>
                    <td>
                      {evento.entradas_totales} ({entradasPct}%)
                    </td>
                    <td>
                      ${evento.ganancia_total} ({gananciaPct}%)
                    </td>
                    <td>
                      {evento.asistencia_total} ({asistenciaPct}%)
                    </td>
                    <td>
                      <ul>
                        {Object.entries(evento.entradas_por_tipo).map(
                          ([tipo, cantidad]) => (
                            <li key={tipo}>
                              {tipo}: {cantidad}
                            </li>
                          )
                        )}
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
      <Footer />
    </main>
  );
};
