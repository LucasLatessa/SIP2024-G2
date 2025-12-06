import React from "react";
import { Link } from "react-router-dom";
import { EventCard } from '../EventCard/EventCard';

import styles from "./NextEvents.module.css";

export const NextEvents = ({ eventos }) => {
  return (
    <section className={styles.nextEvents}>
      <header className={styles.headerNextEvents}>
        <h2>Próximos eventos</h2>
      </header>
      <section className={styles.listaNextEvents}>
        {eventos?.slice(0, 3).map(
          (evento // Itera sobre los primeros 3 eventos
          ) => (
            <EventCard
              key={evento.id_Evento}
              id={evento.id_Evento}
              nombre={evento.nombre}
              foto={evento.imagen}
              descripcion={evento.descripcion}
              precioMin={evento.precioMin}
              precioMax={evento.precioMax}
              fecha={evento.fecha}
              hora={evento.hora}
            />
          )
        )}
      </section>
      <Link className={styles.allEventosNextEvents} to="/eventos">
        Todos los eventos
      </Link>
    </section>
  );
};
