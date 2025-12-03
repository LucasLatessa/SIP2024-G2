import React from "react";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <hr />
      <small className={styles.copyright}>
        <em>Copyright ByPass @2025. Todos los derechos reservados</em>
      </small>
    </footer>
  );
};
