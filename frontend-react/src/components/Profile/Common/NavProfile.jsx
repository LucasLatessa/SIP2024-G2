import styles from "./NavProfile.module.css";

export default function NavProfile ({ user, role }){

  return (
    <section className={styles.navProfile}>
      <h2> Configuracion de la cuenta </h2>
      <nav>
        <li> Lorem ipsum dolor </li>
        <li> Lorem ipsum dolor </li>
        <li> Lorem ipsum dolor </li>
      </nav>
    </section>
  );
}