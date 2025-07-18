import React, { useState, useEffect } from "react";
import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { getEvento, actualizarEvento } from "../../services/eventos.service";
import { getAllLugares } from "../../services/lugar.service";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useAuth0 } from "@auth0/auth0-react";

export const ModificarEventos = () => {
  const [evento, setEvento] = useState([]);
  const navegate = useNavigate();
  const {register,handleSubmit,setValue} = useForm();
  const { id } = useParams();
  const [lugar, setLugar] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

useEffect(() => {
  const cargarDatos = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });
      const [resEvento, resLugar] = await Promise.all([
        getEvento(id, token),
        getAllLugares(token),
      ]);

      setEvento(resEvento.data);
      setLugar(resLugar.data);

    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  cargarDatos();
}, [id]);

  useEffect(() => {
    setValue("nombre", evento.nombre); // Establecer el valor predefinido
    setValue("lugar", evento.lugar); // Establecer el valor predefinido
    setValue("fecha", evento.fecha); // Establecer el valor predefinido
    setValue("hora", evento.hora); // Establecer el valor predefinido
    setValue("descripcion", evento.descripcion); // Establecer el valor predefinido
  }, [evento, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    for (const key in data) {
      if (key === "imagen" && data.imagen && data.imagen[0]) {
        formData.append(key, data.imagen[0]); // Extraer el archivo del FileList
      } else {
        formData.append(key, data[key]);
      }
    }

    try {
      await actualizarEvento(formData,id);
      alert('Evento actualizado con éxito');
      navegate('/perfil');
    } catch (error) {
      console.error('Error actualizando el evento:', error);
      alert('Hubo un error actualizando el evento');
    }
  };

  return (
    <>
      <Header />
      <main>
        <header className="tituloEventos">
          <h1>Modificar evento</h1>
        </header>
        <section className="modificarEvento">
          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="formularioEvento"
          >
            <div className="datosEvento">
              <label>
                Nombre del evento
                <input
                  type="text"
                  {...register("nombre")}
                />
              </label>
              <label>
                Lugar
                <select
                  {...register("lugar")}
                >
                  {lugar?.map((lugar) => (
                    <option key={lugar.id_Lugar} value={lugar.id_Lugar}>
                      {lugar.nombre}{" "}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Fecha
                <input
                  type="date"
                  {...register("fecha")}
                />
              </label>
              <label>
                Hora
                <input
                  type="time"
                  {...register("hora")}
                />
              </label>
              <label>
                Descripcion
                <textarea
                  {...register("descripcion")}
                  rows="4" // Número de filas visibles
                  cols="130" // Ancho del textarea
                />
              </label>
              <label>
                Imagen
                <input
                  type="file"
                  {...register("imagen")}
                />
              </label>
            </div>
            <input className="buttonCrearEvento" type="submit" value="Actualizar" />
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
