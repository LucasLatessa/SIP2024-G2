import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./AccountInfo.module.css";

export default function AccountInfo({ usuario, photo, role }) {
  const { logout } = useAuth0();

  return (
    <section className={styles.accountInfo}>
      <h1> Informacion de cuenta </h1>
      <hr />
      <article className={styles.userAccountInfo}>
        <div>
          <h3>Hola, {usuario?.nombre}</h3>
          <p>{usuario?.rol}</p>
        </div>
        <img src={photo} alt="Foto de perfil" />
      </article>
      <button
        className={styles.logOut}
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Cerrar sesion
      </button>
    </section>
  );
}
