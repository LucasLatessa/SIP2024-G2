import { Link } from "react-router-dom";
import "../styles/proximosEventos.css";
import "../EventosBox";
import { EventosBox } from "../EventosBox";
import { getAllEventos } from "../../services/eventos.service";
import { useEffect, useState } from "react";

export const ProximosEventos = () => {
  const [eventos, setEventos] = useState([]);

  //Realizo la peticion
  useEffect(() => {
    async function cargarEventos(){
      const res = await getAllEventos();
      setEventos(res.data);
    }
    cargarEventos();
  }, [])

  return (
    <section>
      <header className="proximosEventos">
        <h2>Proximos eventos</h2>
        <Link className="allEventos" to="/eventos">
          Todos los eventos
        </Link>
      </header>
      <div className="listaEventos">
        {eventos?.slice(0, 3).map((eventos) => ( //Traigo solo los primeros 3
          <EventosBox
            nombre={eventos.nombre}
            foto={eventos.imagen}
            precioMin={"500"}
            precioMax={"700"}
            fecha={eventos.fecha}
            hora={eventos.hora}
            id={eventos.id_Evento}
          />
        ))}
      </div>
    </section>
  );
};
