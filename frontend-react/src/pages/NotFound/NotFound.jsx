import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return(
    <main className={styles.mainNotFound}>
      <h1 className={styles.titleNotFound}>Pagina no encontrada</h1>
      <a href="/" className={styles.linkNotFound}>Volver al inicio</a>
    </main>
  );
}