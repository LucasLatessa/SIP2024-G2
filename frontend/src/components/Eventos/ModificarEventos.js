import React, { useState, useEffect } from "react";
import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { getEvento, actualizarEvento } from "../../services/eventos.service";
import { getAllLugares } from "../../services/lugar.service";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";

export const ModificarEventos = () => {
  const [setEvento] = useState([]);
  const navegate = useNavigate();
  const {
    register,
    handleSubmit,
  } = useForm();
  const { id } = useParams();
  const [lugar, setLugar] = useState([]);

  useEffect(() => {
    async function cargarEvento() {
      const resEvento = await getEvento(id);
      setEvento(resEvento.data);
    }
    cargarEvento();

    async function cargarLugar() {
      const res = await getAllLugares();
      setLugar(res.data);
    }
    cargarLugar();
  }, [id,setEvento]);

  const onSubmit = handleSubmit(async (data) => {
    data.imagen = data.imagen[0]; //Para guardar la imagen
    //console.log(data)
    await actualizarEvento(data);
    //Vuelvo a la pagina de eventos
    navegate("/perfil");
  });

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
                Cantidad de entradas
                <input
                  type="number"
                  {...register("cantidadEntradas", {
                    required: true,
                  })}
                />
              </label>
              <label>
                Fecha
                <input
                  type="date"
                  {...register("fecha", {
                    required: true,
                  })}
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
            <input className="buttonCrearEvento" type="submit" value="Actualizar" />
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
