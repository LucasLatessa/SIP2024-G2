import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "./CliMercadoPago.module.css";
import { updateClienteMP } from "../../../../services/usuarios.service";
import toast from "react-hot-toast";

function CliMercadoPago() {
  const { usuario, role, photo } = useOutletContext();

  const [formData, setFormData] = useState({
    public_key: "",
    access_token: "",
  });

  const [loading, setLoading] = useState(false);

  // Cargar datos iniciales si existen
  useEffect(() => {
    if (usuario?.public_key || usuario?.access_token) {
      setFormData({
        public_key: usuario.public_key || "",
        access_token: usuario.access_token || "",
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleSaveMP = async () => {
  //   setLoading(true);
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     const payload = {
  //       public_key: formData.public_key,
  //       access_token: formData.access_token,
  //       user_nn: usuario.nickname,
  //     };

  //     await updateClienteMP(payload);
  //     setSuccess("Cuenta de Mercado Pago actualizada correctamente");
  //   } catch (err) {
  //     console.error(err);
  //     setError("Error al actualizar la cuenta de Mercado Pago");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSaveMP = async () => {

    setLoading(true);

    const payload = {
      public_key: formData.public_key,
      access_token: formData.access_token,
      user_nn: usuario.nickname,
    };

    try {
      // Promesa envuelta en el Toast
      await toast.promise(updateClienteMP(payload), {
        loading: "Vinculando cuenta de Mercado Pago...",
        success: "¡Cuenta de Mercado Pago actualizada correctamente!",
        error: "Error al actualizar. Verifique sus credenciales.",
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (role !== "cliente") {
    return <p>No tenés acceso a esta sección.</p>;
  }

  return (
    <section className={styles.mpContainer}>
      <h1>Cuenta Mercado Pago</h1>
      <hr />

      <article className={styles.userAccountInfo}>
        <div>
          <h3>Hola, {usuario?.nombre}</h3>
          <p>{usuario?.rol}</p>
        </div>
        <img src={photo} alt="Foto de perfil" />
      </article>

      <form onSubmit={(e) => e.preventDefault()} className={styles.formMP}>
        <label>
          Public Key
          <input
            type="text"
            name="public_key"
            value={formData.public_key}
            onChange={handleChange}
          />
        </label>

        <label>
          Access Token
          <input
            type="text"
            name="access_token"
            value={formData.access_token}
            onChange={handleChange}
          />
        </label>

        <button
          onClick={handleSaveMP}
          disabled={loading}
          className={styles.saveChanges}
        >
          {loading ? "Actualizando..." : "Actualizar cuenta MP"}
        </button>
      </form>
    </section>
  );
}

export default CliMercadoPago;
