import { useEffect, useState } from "react";
import "./ProductMetricas.css";
import { getProduReport } from "../../../../services/usuarios.service";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const ProductMetricas = () => {
  const [reporte, setReporte] = useState(null);
  const { usuario, role, photo } = useOutletContext();

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const response = await getProduReport(usuario.user_id);
        setReporte(response.data);
      } catch (error) {
        console.error("Error al obtener el reporte de productora");
      }
    };

    fetchReporte();
  }, [usuario.user_id]);

  useEffect(() => {
    console.log(reporte);
  }, [reporte]);

  if (!reporte) {
    return <p>Cargando reporte...</p>;
  }

  const eventosData = reporte.eventos.map((e) => ({
    nombre: e.evento,
    ganancia: e.ganancia_total,
    asistencia: e.asistencia_total,
    entradas: e.entradas_totales,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <section className="reporteProductora">
      <h1>Mis Metricas</h1>
      <hr />

      {/* STATS */}
      <section className="statsProductora">
        <article className="stat">
          <h2>EVENTOS REALIZADOS</h2>
          <p>{reporte.eventos.length}</p>
        </article>

        <article className="stat">
          <h2>ENTRADAS VENDIDAS</h2>
          <p>{reporte.total_entradas_vendidas}</p>
        </article>

        <article className="stat">
          <h2>ASISTENCIA TOTAL</h2>
          <p>{reporte.total_asistencia}</p>
        </article>

        <article className="stat">
          <h2>GANANCIA TOTAL</h2>
          <p>${reporte.total_ganancia}</p>
        </article>

        <article className="stat">
          <h2>% ASISTENCIA</h2>
          <p>
            {(
              (reporte.total_asistencia / reporte.total_entradas_vendidas) *
              100
            ).toFixed(1)}
            %
          </p>
        </article>
      </section>

      {/* ENTRADAS VS ASISTENCIA GLOBAL */}
      <section className="chartSection">
        <h2>Entradas vs Asistencia (Global)</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              {
                name: "Totales",
                vendidas: reporte.total_entradas_vendidas,
                usadas: reporte.total_asistencia,
              },
            ]}
            barGap={30}
          >
            <XAxis dataKey="name" />
            <YAxis interval={0} />
            <Tooltip />
            <Legend />
            <Bar dataKey="usadas" fill={COLORS[2]} name="Asistencia" />
            <Bar dataKey="vendidas" fill={COLORS[1]} name="Entradas Vendidas" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* GANANCIA POR EVENTO */}
      <section className="chartSection">
        <h2>Ganancia por Evento</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={eventosData}>
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ganancia" fill={COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="chartSection">
        <h2>Asistencia por Evento</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={eventosData}>
            <XAxis dataKey="nombre" />
            <YAxis interval={0} />
            <Tooltip />
            <Bar dataKey="asistencia" fill={COLORS[3]} />
            <Bar dataKey="entradas" fill={COLORS[1]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </section>
  );
};

export default ProductMetricas;
