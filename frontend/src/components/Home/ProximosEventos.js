import React from "react";
import { Link } from "react-router-dom";
import "./styles/proximosEventos.css";
import { EventosBox } from "../Eventos/EventosBox";

//Seccion donde se mostraran los proximos eventos del sitio
export const ProximosEventos = ({ eventos }) => {
  return (
    <section>
      <header className="proximosEventos">
        <h2>Próximos eventos</h2>
        <Link className="allEventos" to="/eventos">
          Todos los eventos
        </Link>
      </header>
      <div className="listaEventos">
        {eventos?.slice(0, 3).map((evento) => ( // Itera sobre los primeros 3 eventos
          <EventosBox
            key={evento.id_Evento} // Proporciona una clave única para cada instancia de EventosBox
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
