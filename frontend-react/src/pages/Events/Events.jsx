import React, { useEffect, useState } from "react";
import {
  getAllEventosAprobados,
  getAllEventos,
} from "../../services/eventos.service";
import styles from "./Events.module.css";
import { EventCard } from "../../components/EventCard/EventCard";
import { EventFiltro } from "../../components/EventFiltro/EventFiltro";

export default function Events() {
  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);

  useEffect(() => {
    async function cargarEventos() {
      const res = await getAllEventosAprobados();
      setEventos(res.data);
      setEventosFiltrados(res.data); //Por defecto muestro todo sin filtro
    }
    cargarEventos();
  }, []);

  useEffect(() => {
    console.log("Eventos cargados:", eventos);
  }, [eventos]);

  return (
    <>
      <EventFiltro eventos={eventos} setFilteredEventos={setEventosFiltrados} />
      <section className={styles.listEvents}>
        {eventosFiltrados?.map((eventos) => (
          <EventCard
            key={eventos.id_Evento}
            id={eventos.id_Evento}
            nombre={eventos.nombre}
            foto={eventos.imagen}
            descripcion={eventos.descripcion}
            precioMin={eventos.precioMin}
            precioMax={eventos.precioMax}
            fecha={eventos.fecha}
            hora={eventos.hora}
          />
        ))}
      </section>
    </>
  );
}
