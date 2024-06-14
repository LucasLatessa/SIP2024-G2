import { useEffect, useState } from "react";
import { getEventosByProductora } from "../../services/eventos.service";
import { Link } from "react-router-dom";
import "./styles/productoraView.css";

//Vista de productora
export const ProductoraView = ({ rol, id }) => {
  const [eventos, setEventos] = useState([]);
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        //console.log(id)
        const response = await getEventosByProductora(id);
        setEventos(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de eventos de la productora");
      }
    };
  
    if (rol === "PRODUCTORA") {
      fetchEventos();
    }
  }, [rol, id]);

 

  //Solo si es producotra se muestra este componente
  if (rol === "PRODUCTORA") {
    return (
      <section>
        <h2 className="misEventosProductora"> Beneficios </h2>
        <Link className="programar" to={`/crearBeneficio`}>Crear un beneficio</Link>
        <h2 className="misEventosProductora"> Tus eventos </h2>
        <ul className="listaEventosProductora">
          {eventos.map((evento) => (
            <li className="eventosProductora" key={evento.id_Evento}>
              <h3>{evento.nombre}</h3>
              <img
                className="imagenEventoProductura"
                src={evento.imagen}
                alt={evento.nombre}
              />
              <div className="botonesEventoProductora">
                <Link className="modificarEntrada" to={`/modificarEvento/${evento.id_Evento}`}>
                  Modificar datos
                </Link>
                <Link className="validarEntrada" to={`/validarEntrada/${evento.id_Evento}`}>
                  Validar entrada
                </Link>
                <Link className="verReporte" to={`/reporteEvento/${evento.id_Evento}`}>
                  Ver Reporte
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <Link className="programar" to={`/programarEvento`}>Programar Evento</Link>
      </section>
    );
  }
};