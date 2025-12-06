import React, { useEffect, useState } from "react";

import {
  getAllEventosAprobados,
  getAllEventos,
} from "../../services/eventos.service";
import { getTicketByEventPrecio } from "../../services/tickets.service";

import styles from "./Events.module.css";
import { EventCard } from "../../components/Event/EventCard/EventCard";
import { EventFiltro } from "../../components/Filtros/EventFiltro";

export default function Events() {
  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);

  useEffect(() => {
    async function cargarEventos() {
      const res = await getAllEventosAprobados();
      const datosEventoCompleto = await Promise.all(
        res.data.map(async (evento) => {
          const precios = await getTicketByEventPrecio(evento.id_Evento)
          return {
            id: evento.id_Evento,
            nombre: evento.nombre,
            descripcion: evento.descripcion, //No llega la descripcion (TO-DO)
            imagen: evento.imagen,
            precioMin: precios.data.precios[0].precioMinimo,
            precioMax: precios.data.precios[0].precioMaximo,
            fecha: evento.fecha,
            hora: evento.hora
          }
          
        })
      )


      setEventos(datosEventoCompleto);
      setFilteredEventos(datosEventoCompleto); //Por defecto muestro todo sin filtro
    }

    async function ticketsEventos(){
      const res = await getTicketByEventPrecio(res.data)
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
        ))}
      </section>
    </>
  );
}
