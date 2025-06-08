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
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset
  } = useForm();
  const [lugares, setLugares] = useState([]);

  //Realizo la peticion para cargar los lugares disponibles donde se puede realizar el evento
  useEffect(() => {
    async function cargarLugar() {
      const res = await getAllLugares();
      setLugares(res.data);
    }
    cargarLugar();
  }, []);

  //Realizo la peticion para crear el evento
  const onSubmit = handleSubmit(async (data) => {
    data.imagen = data.imagen[0]; //Para guardar la imagen

    // Calcular el total de entradas
    const cantTickets =
      parseInt(data.cantidadEntradasVIP) +
      parseInt(data.cantidadEntradasPLATINIUM) +
      parseInt(data.cantidadEntradasSTANDARD);

    // Agregar el total de entradas a los datos
    data.cantTickets = cantTickets;
    data.id_productora = user.nickname;

    await crearEvento(data);
    reset();
    //Vuelvo a la pagina de eventos
    navigate("/perfil");
  });

  return (
    <>
      <Header />
      <main className="App">
        <header className="tituloEventos">
          <h1>Programar Evento</h1>
        </header>
        <section className="crearEvento">
          <form className="formularioEvento" onSubmit={onSubmit} encType="multipart/form-data">
            <div className="bloquesForm">
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
                    <option value="">Selecciona un lugar</option>
                    {lugares?.map((lugar) => (
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
                  Descripción
                  <textarea
                    {...register("descripcion", {
                      required: true,
                    })}
                    rows={3}
                  />
                </label>
                <label>
                  Imagen
                  <input
                    type="file"
                    accept="image/*"
                    {...register("imagen", {
                      required: true,
                    })}
                  />
                </label>
              </div>
              <div className="datosEntradas">
                <div className="tipoEntrada">
                  <h4>VIP</h4>
                  <div className="fila-entrada">
                    <label>
                      Cantidad
                      <input
                        type="number"
                        min="0"
                        {...register("cantidadEntradasVIP", { required: true })}
                      />
                    </label>
                    <label>
                      Precio
                      <input
                        type="number"
                        min="0"
                        step="0.01" // Incremento 0.01 para permitir decimales
                        {...register("precioVIP", { required: true })}
                      />
                    </label>
                  </div>
                </div>
                <div className="tipoEntrada">
                  <h4>Platinium</h4>
                  <div className="fila-entrada">
                    <label>
                      Cantidad
                      <input
                        type="number"
                        min="0"
                        {...register("cantidadEntradasPLATINIUM", { required: true })}
                      />
                    </label>
                    <label>
                      Precio
                      <input
                        type="number"
                        min="0"
                        step="0.01" // Incremento 0.01 para permitir decimales
                        {...register("precioPLATINIUM", { required: true })}
                      />
                    </label>
                  </div>
                </div>
                <div className="tipoEntrada">
                  <h4>Standard</h4>
                  <div className="fila-entrada">
                    <label>
                      Cantidad
                      <input
                        type="number"
                        min="0"
                        {...register("cantidadEntradasSTANDARD", { required: true })}
                      />
                    </label>
                    <label>
                      Precio
                      <input
                        type="number"
                        min="0"
                        step="0.01" // Incremento 0.01 para permitir decimales
                        {...register("precioSTANDARD", { required: true })}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <input className="buttonCrearEvento" type="submit" value="Crear evento" />
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
