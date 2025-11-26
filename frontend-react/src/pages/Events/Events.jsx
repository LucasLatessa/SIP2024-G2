import React, { useEffect, useState } from 'react'
import {getAllEventosAprobados, getAllEventos} from "../../services/eventos.service"
import styles from "./Events.module.css";
import { EventCard } from '../../components/EventCard/EventCard';

export default function Events(){
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    async function cargarEventos(){
      const res = await getAllEventos();
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
            (eventos) => ( //Obtengo todos los eventos y utilizo el componente para mostrarlos
              <EventCard
                key={eventos.id}
                id={eventos.id}
                nombre={eventos.nombre}
                foto={eventos.imagen}
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
