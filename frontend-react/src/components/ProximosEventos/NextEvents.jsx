import React from "react";
import { Link } from "react-router-dom";
import styles from "./NextEvents.module.css";
import { EventCard } from '../EventCard/EventCard';

export const NextEvents = ({ eventos }) => {
  return (
    <section>
      <header className="proximosEventos">
        <h2>Próximos eventos</h2>
      </header>
      <section className="listaEventos">
        {eventos?.slice(0, 3).map(
          (evento // Itera sobre los primeros 3 eventos
          ) => (
            <EventCard
              key={eventos.id}
              id={eventos.id}
              nombre={eventos.nombre}
              foto={eventos.imagen}
              descripcion={eventos.descripcion}
              precioMin={eventos.precioMin}
              precioMax={eventos.precioMax}
              fecha={eventos.fecha}
              hora={eventos.hora}
            />
          )
        )}
      </section>
      <Link className="allEventos" to="/eventos">
        Todos los eventos
      </Link>
    </section>
  );
};
