import React from "react";
import styles from "./EventDetail.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getEvento } from "../../services/eventos.service";
import { formatDateEventDetail } from "../../utils/formatDateEventDetail";

/* Iconos */
import { TiTicket } from "react-icons/ti";
import { MdOutlineDateRange } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";

export default function EventDetail(){
  const { id } = useParams();
  const [eventos, setEventos] = useState([]);

  const { fecha: fechaFormat, hora: horaFormat } = formatDateEventDetail(eventos.fecha, eventos.hora);


  //Realizo la peticion para obtener el evento y mostrar sus datos en pantalla
  useEffect(() => {
    async function cargarEventos() {
      const resEvento = await getEvento(id); //Solo eventos válidos, si no existe hay que arreglarlo
      setEventos(resEvento.data);
    }

    cargarEventos();
  }, [id]);

  useEffect(() => {
    console.log(id);
  }, [id])

  return (
    <main className={styles.eventDetail}>

      {/* Banner */}
      <header className={styles.headerEventDetail}>
        <img className={styles.imagenEventDetail} src={eventos.imagen} alt={"Imagen " + eventos.nombre} />
      </header>

      {/* Informacion del evento */}
      <article className={styles.infEventDetail}>

        <h1 className={styles.titleEventDetail}>{eventos.nombre}</h1>

        
        <div className={styles.fechaTicketsEventDetail}>

          {/* Fecha-Hora */}
          <section className={styles.fechaEventDetail}>
            <h2 className={styles.titleFecha}> Fecha y hora</h2>
            <ul className={styles.fechaHora}>
              <li><MdOutlineDateRange /> {fechaFormat}</li>
              <li><IoTimeOutline /> {horaFormat}</li>
            </ul>
          </section>

          {/* Informacion del tickets */}
          <section className={styles.ticketEventDetail}>
            <h3 className={styles.informationTicket}> Informacion de Tickets</h3>
            <ul className={styles.listaTicket}>
              <li> <TiTicket /> Standard</li>
              <li> <TiTicket /> Premium</li>
              <li> <TiTicket /> Platino</li>
            </ul>
            <button> <TiTicket /> Comprar Ticket</button>
          </section>
        </div>

        {/* Acerca del evento */}
        <section className={styles.descriptionEventDetail}>
          <h3 className={styles.titleDescription}>Acerca del evento</h3>
          <p className={styles.description}>{eventos.descripcion}</p>
        </section>
        
      </article>


    </main>
  );
};
