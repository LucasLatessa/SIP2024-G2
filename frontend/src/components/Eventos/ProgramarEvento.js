import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useForm } from "react-hook-form";
import { crearEvento } from "../../services/eventos.service";
import { useEffect, useState } from "react";
import { getAllLugares } from "../../services/lugar.service";
import { useNavigate } from "react-router";
import "../styles/programarEvento.css";

//Encargado de realizar la creacion de eventos dentro de la pagina
export const ProgramarEvento = () => {
  const navegate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [lugar, setLugar] = useState([]);

  //Realizo la peticion para cargar los lugares disponibles donde se puede realizar el evento
  useEffect(() => {
    async function cargarLugar() {
      const res = await getAllLugares();
      setLugar(res.data);
    }
    cargarLugar();
  }, []);

  //Realizo la peticion para crear el evento
  const onSubmit = handleSubmit(async (data) => {
    data.imagen = data.imagen[0]; //Para guardar la imagen
    //console.log(data)
    const res = await crearEvento(data);
    //console.log(res);.
    //Vuelvo a la pagina de eventos
    navegate("/eventos");
  });

  return (
    <>
      <Header />
      <main className="App">
        <header className="tituloEventos">
          <h1>Programar Evento</h1>
        </header>
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
            <input className="buttonCrearEvento" type="submit" value="Enviar" />
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
