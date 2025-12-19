import React from 'react';
import styles from './Spinner.module.css';

export const Spinner = ({ texto = "Cargando..." }) => {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
      {texto && <p className={styles.texto}>{texto}</p>}
    </div>
  );
}