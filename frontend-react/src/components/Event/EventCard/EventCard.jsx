import React from "react";
import { Link } from "react-router-dom";
import styles from "./EventCard.module.css";

import { formatearFechaParaCard } from "../../../utils/dateFormatter";

export const EventCard = ({ id,
  nombre,
  foto,
  descripcion,
  precioMin,
  precioMax,
  fecha,
  hora,
}) => {
  const fechaHoraCompleta = `${fecha} - ${hora}`;
  const {
    dia,
    mes,
    hora: horaVisual,
  } = formatearFechaParaCard(fechaHoraCompleta);

  console.log(id);

  return (
    <Link className={styles.eventCard} to={`/eventos/${id}`}>
      <h2 className={styles.nombreEventCard}>{nombre}</h2>
      <img className={styles.imgEventCard} src={foto} alt="Imagen del evento" />
      <p className={styles.descripcionEventCard}>{descripcion}</p>
      <div className={styles.fechaEventCard}>
        <p>{dia}</p>
        <p>{mes}</p>
        <p>{horaVisual}</p>
      </div>
      {precioMax && (
        <p className={styles.precioEventCard}>
          Rango de precios: ${precioMin}-${precioMax}
        </p>
      )}
    </Link>
  );
};
