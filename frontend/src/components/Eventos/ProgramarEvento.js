import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useForm } from "react-hook-form";
import { crearEvento } from "../../services/eventos.service";
import { useEffect, useState } from "react";
import { getAllLugares } from "../../services/lugar.service";

//Encarga de realizar la creacion de eventos dentro de la pagina
export const ProgramarEvento = () => {
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
    const res = await crearEvento(data);
    console.log(res);
  });

  return (
    <>
      <Header />
      <main className="App">
        <header className="tituloEventos">
          <h1>Programar Evento</h1>
        </header>
        <section>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              {" "}
              Nombre del evento
              <input type="text" {...register("nombre")} />
            </label>
            <input type="submit" value="Enviar" />
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
