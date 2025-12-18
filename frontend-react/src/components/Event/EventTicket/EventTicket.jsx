import { Link } from "react-router-dom";
import { formatearFechaParaCard } from "../../../utils/dateFormatter";

import styles from "./EventTicket.module.css";

export const EventTicket = ({
  id,
  foto,
  precio,
  tipo,
  eventoNombre,
  eventoFecha,
  eventoHora,
}) => {
  const fechaHoraCompleta = `${eventoFecha} - ${eventoHora}`;
  const {
    dia,
    mes,
    hora: horaVisual,
  } = formatearFechaParaCard(fechaHoraCompleta);

  return (
    <Link  className={styles.linkEventTicket} to={`/mercado/${id}`}>
      <article className={styles.eventTicket}>
        <div className={styles.leftEventTicket}>
          <h2>{eventoNombre}</h2>
          <img src={foto} alt="Imagen del evento" />
          <p>
            {dia} {mes} - {horaVisual}hs.
          </p>
        </div>
        <div className={styles.rightEventTicket}>
          <p className={styles.tipo}>{tipo}</p>
          <p className={styles.precio}> ${precio}</p>
        </div>
        {/* <Link to={`/publicacion/${id}`}>Comprar</Link> */}
      </article>
    </Link>
  );
};
