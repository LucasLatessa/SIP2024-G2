import styles from "./ViviLaExperiencia.module.css";
import Ticket from "./images/Ticket.png"

export const ViviLaExperiencia = () => {
  return (
    <section className={styles.viviLaExperiencia}>
        <h2 className={styles.titulo}> Vivi la experiencia </h2>
        <article className={styles.experiencias}>
            <figure>
                <img src={Ticket} alt="Ticket image1"/>
                <figcaption> Compra </figcaption>
            </figure>
            <figure>
                <img src={Ticket} alt="Ticket image2"/>
                <figcaption> Vivi </figcaption>
            </figure>
            <figure>
                <img src={Ticket} alt="Ticket image3"/>
                <figcaption> Disfruta </figcaption>
            </figure>
        </article>
    </section>
  )};