import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEventReport } from "../../../services/eventos.service";
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
import "./ReporteEvento.css";

/* Este reporte muestra el rendimiento de un evento específico a nivel de ventas, asistencia y distribución de entradas, permitiendo evaluar su rentabilidad y comportamiento de los usuarios. */
const ReporteEvento = () => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const response = await getEventReport(id);
        setReporte(response.data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReporte();
  }, [id]);

  if (loading) {
    return <p>Cargando reporte...</p>;
  }

  if (error || !reporte) {
    return <p>Error al cargar el reporte</p>;
  }

  const entradasData = Object.entries(reporte.entradas_por_tipo).map(function ([
    tipo,
    cantidad,
  ]) {
    return { tipo: tipo, cantidad: cantidad };
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const asistenciaData = [
    {
      name: "Entradas",
      vendidas: reporte.entradas_totales,
      usadas: reporte.asistencia_total,
    },
  ];

  return (
    <article className="reporteEvento">
      <h1>Mis Eventos - {reporte.evento}</h1>
      <hr />

      {/* STATS */}
      <section className="stats">
        <img
          className="imagenEvento"
          src={reporte.imagen}
          alt={reporte.evento}
        />

        <article className="stat">
          <h2>ASISTENCIA TOTAL</h2>
          <p>{reporte.asistencia_total}</p>
        </article>

        <article className="stat">
          <h2>GANANCIA TOTAL</h2>
          <p>${reporte.ganancia_total}</p>
        </article>
      </section>

      <section className="chartSection">
        <h2>Entradas Vendidas vs Asistencia</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={asistenciaData} barGap={30}>
            <XAxis dataKey="name" />
            <YAxis interval={0} />
            <Tooltip />
            <Legend />
            <Bar dataKey="usadas" name="Entradas Usadas" fill={COLORS[2]} />
            <Bar dataKey="vendidas" name="Entradas Vendidas" fill={COLORS[1]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* GRÁFICO DE TORTA */}
      <section className="chartSection">
        <h2>Distribución de entradas</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={entradasData}
              dataKey="cantidad"
              nameKey="tipo"
              outerRadius={100}
              label
            >
              {entradasData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>
    </article>
  );
};

export default ReporteEvento;
