import { useEffect, useState } from "react";
import { getEventosByProductora } from "../../services/eventos.service";
import { Link } from "react-router-dom";

export const ProductoraView = ({ rol, id }) => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    if (rol === "PRODUCTORA") {
      fetchEventos();
    }
  }, [rol]);

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
    return (
      <div>
        <h2> Mis eventos
          <ul>{eventos.map(evento => (
            <li key={evento.id_Evento}>
              {evento.nombre}
              <Link to={`/validarEntrada/${evento.id_Evento}`}>Validar entrada</Link>
            </li>
            
          ))}</ul>
        </h2>
        <Link to={`/programarEvento`}>Programar Evento</Link>
      </div>
    );
  }
};
