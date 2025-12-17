import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getAllLugares } from "../../../../services/lugar.service";
import { useAuth0 } from "@auth0/auth0-react";
import "./CrearEvento.css";
import toast from "react-hot-toast";
import { crearEvento } from "../../../../services/eventos.service";
import { useNavigate } from "react-router-dom";

const CrearEvento = () => {
  const { user } = useAuth0();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const [lugar, setLugar] = useState([]);
  const navigate = useNavigate();

  //Realizo la peticion para cargar los lugares disponibles donde se puede realizar el evento
  useEffect(() => {
    async function cargarLugar() {
      const res = await getAllLugares();
      setLugar(res.data);
    }
    cargarLugar();
  }, []);

  // //Realizo la peticion para crear el evento
  // const onSubmit = handleSubmit(async (data) => {
  //   data.imagen = data.imagen[0]; //Para guardar la imagen
  //   //console.log(data)

  //   // Calcular el total de entradas
  //   const cantTickets =
  //     parseInt(data.cantidadEntradasVIP) +
  //     parseInt(data.cantidadEntradasPLATINIUM) +
  //     parseInt(data.cantidadEntradasSTANDARD);

  //   // Agregar el total de entradas a los datos
  //   data.cantTickets = cantTickets;
  //   data.id_productora = user.nickname;

  //   await crearEvento(data);

  //   //Vuelvo a la pagina de eventos
  //   navegate("/perfil");
  // });

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.imagen = data.imagen[0]; //Para guardar la imagen

      const cantTickets =
        parseInt(data.cantidadEntradasVIP) +
        parseInt(data.cantidadEntradasPLATINIUM) +
        parseInt(data.cantidadEntradasSTANDARD);

      data.cantTickets = cantTickets;
      data.id_productora = user.nickname;

      // Usamos toast.promise para manejar Carga, Éxito y Error automáticamente
      await toast.promise(crearEvento(data), {
        loading: "Creando evento y subiendo archivos...",
        success: "¡Evento creado con éxito!",
        error: "Error al crear el evento. Intente nuevamente.",
      });

      // Esperamos 1.5 segundos para que el usuario vea el mensaje verde antes de cambiar de página.
      setTimeout(() => {
        navigate("/perfil");
      }, 1500);
    } catch (error) {
      console.error("Error en el formulario:", error);
    }
  });

  return (
    <main>
      <section className="crearEvento">
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
                {...register("nombre", {
                  required: true,
                })}
              />
            </label>
            <label>
              Lugar
              <select
                {...register("lugar", {
                  required: true,
                })}
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
                {...register("fecha", {
                  required: true,
                })}
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </label>
            <label>
              Hora
              <input
                type="time"
                {...register("hora", {
                  required: true,
                })}
              />
            </label>
            <label>
              Descripcion
              <input
                type="text"
                {...register("descripcion", {
                  required: true,
                })}
              />
            </label>
            <label>
              Imagen
              <input
                type="file"
                {...register("imagen", {
                  required: true,
                })}
              />
            </label>
          </div>
          <div className="datosEntradas">
            <div className="tipoEntrada">
              <label>
                Entradas VIP
                <input
                  type="number"
                  {...register("cantidadEntradasVIP", {
                    required: true,
                  })}
                />
              </label>
              <label>
                Precio
                <input
                  type="number"
                  step="0.01" // Incremento 0.01 para permitir decimales
                  {...register("precioVIP", {
                    required: true,
                  })}
                />
              </label>
            </div>
            <div className="tipoEntrada">
              <label>
                Entradas Platinium
                <input
                  type="number"
                  {...register("cantidadEntradasPLATINIUM", {
                    required: true,
                  })}
                />
              </label>
              <label>
                Precio
                <input
                  type="number"
                  {...register("precioPLATINIUM", {
                    required: true,
                  })}
                />
              </label>
            </div>
            <div className="tipoEntrada">
              <label>
                Entradas Standard
                <input
                  type="number"
                  {...register("cantidadEntradasSTANDARD", {
                    required: true,
                  })}
                />
              </label>
              <label>
                Precio
                <input
                  type="number"
                  {...register("precioSTANDARD", {
                    required: true,
                  })}
                />
              </label>
            </div>
          </div>
          <input
            className="buttonCrearEvento"
            type="submit"
            value={isSubmitting ? "Enviando..." : "Enviar"}
            disabled={isSubmitting} // Se bloquea mientras carga
            style={{ opacity: isSubmitting ? 0.5 : 1 }}
          />
        </form>
      </section>
    </main>
  );
};

export default CrearEvento;
