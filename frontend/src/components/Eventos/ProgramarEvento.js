import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useForm } from "react-hook-form";
import { crearEvento } from "../../services/eventos.service";
import { useEffect, useState } from "react";
import { getAllLugares } from "../../services/lugar.service";
import { useNavigate } from "react-router";
import "./styles/programarEvento.css";
import { useAuth0 } from "@auth0/auth0-react";

//Encargado de realizar la creacion de eventos dentro de la pagina
export const ProgramarEvento =() => {
  const { user } = useAuth0();
  const navegate = useNavigate();
  const {
    register,
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

    // Calcular el total de entradas
    const cantTickets =
      parseInt(data.cantidadEntradasVIP) +
      parseInt(data.cantidadEntradasPLATINIUM) +
      parseInt(data.cantidadEntradasSTANDARD);

    // Agregar el total de entradas a los datos
    data.cantTickets = cantTickets;
    data.id_productora = user.nickname;

    await crearEvento(data);
    //console.log(res);.
    //Vuelvo a la pagina de eventos
    navegate("/perfil");
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
                Fecha
                <input
                  type="date"
                  {...register("fecha", {
                    required: true,
                  })}
                  defaultValue={new Date().toISOString().split('T')[0]}
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
            <input className="buttonCrearEvento" type="submit" value="Enviar" />
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
