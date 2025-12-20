import { useEffect, useState } from "react";
import "./ReporteProductora.css";
import { getProduReport } from "../../../services/usuarios.service.js";
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
  LineChart,
  Line,
} from "recharts";
import DataGuard from "../../../components/DataGuards.jsx";

const ReporteProductora = () => {
  const [reporte, setReporte] = useState(null);
  const { usuario, role, photo } = useOutletContext();
  const [cargando, setCargando] = useState(true);
  const {id} = useParams();

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const response = await getProduReport((id)? id : usuario.user_id);
        //console.log(usuario.user_id ? 'a' : 'b')
        setReporte(response.data);
      } catch (error) {
        console.error("Error al obtener el reporte de productora");
      } finally {
        setCargando(false);
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

  const eventosData = reporte.eventos.map((e) => {
    const vendidos = e.tickets_vendidos || 0;
    const totales = e.tickets_totales || 0;
    const reventas = e.transferencias?.reventas_total || 0;

    return {
      nombre: e.evento,
      ganancia: e.ganancia_total,
      vendidos: vendidos,
      totales: totales,
      asistencia: e.asistencia_total,
      regalos: e.transferencias.regalos_total,
      reventas: e.transferencias?.reventas_total || 0,
      margenTicket: e.tickets_vendidos
        ? e.ganancia_total / e.tickets_vendidos
        : 0,
      gananciaPromedioTicket: vendidos > 0 ? e.ganancia_total / vendidos : 0,

      porcentajeReventa: vendidos > 0 ? (reventas / vendidos) * 100 : 0,
    };
  });

  const porcentajeReventaGlobal =
    reporte.total_entradas_vendidas > 0
      ? (reporte.total_reventas / reporte.total_entradas_vendidas) * 100
      : 0;

  const tiposGlobal = { VIP: 0, PLATINIUM: 0, STANDARD: 0 };
  reporte.eventos.forEach((e) => {
    Object.entries(e.entradas_por_tipo || {}).forEach(([tipo, cantidad]) => {
      const tipoNormalizado = tipo;
      if (tiposGlobal[tipoNormalizado] !== undefined) {
        tiposGlobal[tipoNormalizado] += cantidad;
      }
    });
  });

  const pieGlobalData = Object.entries(tiposGlobal).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <DataGuard cargando={cargando}>
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

          {/* KPI: % de tickets revendidos (GLOBAL) */}
          <article className="stat">
            <h2>% TICKETS REVENIDOS</h2>
            <p>{porcentajeReventaGlobal.toFixed(1)}%</p>
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
              <Bar
                dataKey="vendidas"
                fill={COLORS[1]}
                name="Entradas Vendidas"
              />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Ganancia promedio por ticket */}
        <section className="chartSection">
          <h2>Ganancia promedio por ticket</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventosData}>
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
              <Bar
                dataKey="gananciaPromedioTicket"
                fill={COLORS[0]}
                name="Ganancia promedio"
              />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Vendidas vs Ganancia */}
        <section className="chartSection">
          <h2>Entradas vendidas vs Ganancia</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventosData}>
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar
                dataKey="vendidos"
                fill={COLORS[1]}
                name="Entradas vendidas"
              />
              <Bar dataKey="ganancia" fill={COLORS[2]} name="Ganancia total" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Tickets revendidos vs tickets totales */}
        <section className="chartSection">
          <h2>Reventas vs Tickets Totales</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventosData}>
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar dataKey="totales" fill={COLORS[3]} name="Tickets totales" />
              <Bar
                dataKey="reventas"
                fill={COLORS[0]}
                name="Tickets revendidos"
              />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Margen promedio por ticket */}
        <section className="chartSection">
          <h2>Margen promedio por ticket</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Vendidas", value: reporte.total_entradas_vendidas },
                  { name: "Regaladas", value: reporte.total_regalos },
                  { name: "Reventas", value: reporte.total_reventas },
                ]}
                dataKey="value"
                outerRadius={120}
              >
                {COLORS.map((c, i) => (
                  <Cell key={i} fill={c} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
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

        {/* Revendidas vs Vendidas */}
        <section className="chartSection">
          <h2>Revendidas vs Vendidas </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventosData}>
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar dataKey="vendidos" fill={COLORS[1]} name="Vendidas" />
              <Bar dataKey="reventas" fill={COLORS[2]} name="Revendidas" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="chartSection">
          <h2>Distribución global de tipos de entrada</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieGlobalData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {pieGlobalData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>

       
      </section>
    </DataGuard>
  );
};

export default ReporteProductora;
