import React, { useState, useEffect } from 'react';
import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useForm } from "react-hook-form";
import { crearBeneficio } from "../../services/beneficios.service";
import { getEventosByProductora } from "../../services/eventos.service";
import { getUserNick } from "../../services/usuarios.service";
import { useNavigate } from "react-router";
import "./styles/crearBeneficio.css";
import { useAuth0 } from '@auth0/auth0-react';

export const CrearBeneficio = () => {
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { user } = useAuth0();
  const [usuarioData, setUsuarioData] = useState(null);

  useEffect(() => {
    async function obtenerDatos() {
      try {
        // Obtener la productora
        const productora = await getUserNick(user.nickname);
        setUsuarioData(productora.data.usuario);

        // Obtener los eventos de la productora
        if (productora.data.usuario && productora.data.usuario.user_id) {
          const response = await getEventosByProductora(productora.data.usuario.user_id);
          setEventos(response.data);

          // Establecer el primer evento como seleccionado por defecto si hay eventos
          if (response.data.length > 0) {
            setEventoSeleccionado(response.data[0].id_Evento);
          }
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    }

    obtenerDatos();
  }, [user.nickname]);

  const handleEventoChange = (event) => {
    setEventoSeleccionado(event.target.value);
  };

  const onSubmit = async (data) => {
    data.imagen = data.imagen[0]; // Para guardar la imagen
    data.evento = eventoSeleccionado; // Añadir el evento seleccionado al formulario
    data.vigente = true;
    await crearBeneficio(data);
    navigate("/beneficios");
  };

  return (
    <>
      <Header />
      <main className="App">
        <section className="crearBeneficio">
          <h3>Publica un nuevo beneficio</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="formularioBeneficio"
          >
            <div className="datosBeneficio">
              <label>
                Nombre
                <input
                  type="text"
                  name="nombre" 
                  {...register("nombre", {
                    required: true,
                  })}
                />
              </label>
              <label>
                Descripción
                <input
                  type="text"
                  name="descripcion" 
                  {...register("descripcion", {
                    required: true,
                  })}
                />
              </label>
              <label>
                Eventos
                <select id="evento-select" name="evento-select" value={eventoSeleccionado} onChange={handleEventoChange}>
                  {eventos.map((evento) => (
                    <option key={evento.id_Evento} value={evento.id_Evento}>
                      {evento.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Porcentaje de descuento
                <input
                  type="number"
                  name="descuento" 
                  {...register("porcentajeDescuento", {
                    required: false,
                  })}
                />
              </label>
              <label>
                Código de descuento
                <input
                  type="text"
                  name="codigo" 
                  {...register("codigoDescuento", {
                    required: true,
                  })}
                 
                />
              </label>
              <label>
                Imagen
                <input
                  type="file"
                  name="imagen"
                  {...register("imagen", {
                    required: true,
                  })}
                />
              </label>
            </div>
            <section className="buttonCrearBeneficio">
              <button type="submit">Confirmar</button>
            </section>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
