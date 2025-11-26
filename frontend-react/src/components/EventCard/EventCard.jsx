import React from "react";
import { Link } from "react-router-dom";
import styles from "./EventCard.module.css";

export const EventCard = ({id, nombre, foto, precioMin, precioMax, fecha,hora}) => {
    console.log(id)
    return(
      <article className={styles.eventCard}>
          <h2 className={styles.nombreEventCard}>{nombre}</h2>
          <img className={styles.imgEventCard} src={foto} alt="Imagen del evento" />
          <p className={styles.precioEventCard}> ${precioMin} a ${precioMax}</p>
          <p className={styles.fechaEventCard}>{fecha} - {hora}</p>
          <Link to={`/evento/${id}`}>Comprar</Link>
      </article>
    );
}