import React from "react";
import { Link } from "react-router-dom";
import styles from "./EventProductView.module.css";

export const EventProductView = ({ id, nombre, imagen }) => {
  return (
    <article className={styles.eventoProductora}>
      <h3 className={styles.titulo}>{nombre}</h3>

      <img
        src={imagen}
        alt={`Imagen del evento ${nombre}`}
        className={styles.imagen}
      />

      <div className={styles.acciones}>
        {/* <Link
          to={`/perfil/productora-eventos/modificar/${id}`}
          className={styles.modificar}
        >
          Modificar datos
        </Link> */}

        <Link
          to={`/perfil/productora-eventos/validar/${id}`}
          className={styles.validar}
        >
          Validar entrada
        </Link>

        <Link
          to={`/perfil/productora-eventos/reporte/${id}`}
          className={styles.reporte}
        >
          Ver reporte
        </Link>
      </div>

      
    </article>
  );
};
