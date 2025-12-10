import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  updateCliente,
  updateAdministrador,
  updateProductora,
} from "../../../../services/usuarios.service";
import styles from "./AccountInfo.module.css";
import { useOutletContext } from "react-router-dom";

export default function AccountInfo() {
  const { logout } = useAuth0();
  const { usuario, role, photo } = useOutletContext();

  console.log(usuario);

  // Estado local para los campos editables
  const [formData, setFormData] = useState({
    ...usuario
  });

  // Cargar valores iniciales cuando llega usuario
  useEffect(() => {
  if (usuario) {
    setFormData({
      ...usuario
    });
  }
  }, [usuario]);

  // Manejar cambios en inputs editables
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    console.log(value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    console.log(formData);
    try {
      let updateFunction;

      switch (usuario?.rol) {
        case "CLIENTE":
          updateFunction = updateCliente;
          break;
        case "ADMINISTRADOR":
          updateFunction = updateAdministrador;
          break;
        case "PRODUCTORA":
          updateFunction = updateProductora;
          break;
        default:
          alert("Rol desconocido. No se puede actualizar el perfil.");
          return;
      }

      await updateFunction(formData);

      alert("Perfil actualizado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el perfil. Puede que el DNI ya exista.");
    }
  };

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
      <form className={styles.formPerfil} onSubmit={(e) => e.preventDefault()}>
        {/* SOLO LECTURA */}
        <label>
          Nickname
          <input type="text" value={usuario?.nickname || ""} readOnly />
        </label>
        <label>
          Correo
          <input type="text" value={usuario?.correo || ""} readOnly />
        </label>

        {/* EDITABLES */}
        <label>
          DNI
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
          />
        </label>
        <label>
          Nombre
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </label>
        <label>
          Apellido
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
          />
        </label>
      </form>
      <button onClick={handleUpdateProfile} className={styles.saveChanges}>
        Guardar cambios
      </button>
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
