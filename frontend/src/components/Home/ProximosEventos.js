import React from "react";
import { Link } from "react-router-dom";
import "./styles/proximosEventos.css";
import { EventosBox } from "../Eventos/EventosBox";
//Seccion donde se mostraran los proximos eventos del sitio
export const ProximosEventos =  ({ eventos }) => {

  return (
    <section>
      <header className="proximosEventos">
        <h2>Próximos eventos</h2>
        <Link className="allEventos" to="/eventos">
          Todos los eventos
        </Link>
      </header>
      <div className="listaEventos">
        {eventos.slice(0, 3).map((evento) => (
          <EventosBox
            key={evento.id}
            nombre={evento.nombre}
            foto={evento.imagen}
            precioMin={evento.precioMin}
            precioMax={evento.precioMax}
            fecha={evento.fecha}
            hora={evento.hora}
            id={evento.id_Evento}
          />
        ))}
      </div>
    </section>
  );
};