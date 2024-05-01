import { Link } from "react-router-dom";
import "../styles/proximosEventos.css";
import "../EventosBox";
import { EventosBox } from "../EventosBox";
import { useFetch } from "../useFetch";

export const ProximosEventos = () => {
  const { data, loading, error } = useFetch(
    "http://127.0.0.1:8000/eventos/Eventos"
  );

  return (
    <section>
      <header className="proximosEventos">
        <h2>Proximos eventos</h2>
        <Link className="allEventos" to="/eventos">
          Todos los eventos
        </Link>
      </header>
      <div className="listaEventos">
        {error && <h2>Error: {error}</h2>}
        {loading && <h2>Cargando eventos...</h2>}
        {data?.slice(0, 3).map((evento) => ( //Traigo solo los primeros 3
          <EventosBox
            nombre={evento.nombre}
            foto={evento.imagen}
            precioMin={"500"}
            precioMax={"700"}
            fecha={evento.fecha}
            hora={evento.hora}
            id={evento.id_Evento}
          />
        ))}
      </div>
    </section>
  );
};
