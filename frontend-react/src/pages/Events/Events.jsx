import React, { useEffect, useState } from 'react'
import {getAllEventosAprobados, getAllEventos} from "../../services/eventos.service"
import styles from "./Events.module.css";
import { EventCard } from '../../components/EventCard/EventCard';

export default function Events(){
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    async function cargarEventos(){
      const res = await getAllEventosAprobados();
      //console.log(res.data);
      setEventos(res.data);
    }
    cargarEventos();
  }, [])

  useEffect(() => {
   console.log("Eventos cargados:", eventos);
  }, [eventos]);


  return (
    <>
      <section>Filtros</section>
      <section className={styles.listEvents}>
          {eventos?.map(
            (eventos) => (
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
            )
          )}
      </section>
    </>
  )
}
