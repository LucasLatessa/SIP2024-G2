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
    data.imagen = data.imagen[0]; //Para guardar la imagen
    console.log(data)
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
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <label> Nombre del evento
              <input type="text" {...register("nombre",{
                required: true
              })} />
            </label>
            <label> Lugar
              <select {...register("lugar")}>
                {lugar ?.map((lugar) => (
                  <option key={lugar.id_Lugar} value={lugar.id_Lugar}> {lugar.nombre} </option>
                ))}
              </select>
            </label>
            <label> Cantidad de entradas
              <input type="number" {...register("cantidadEntradas",{
                required: true
              })} />
            </label>
            <label> Fecha
              <input type="date" {...register("fecha")}/>
            </label>
            <label> Hora
              <input type="time" {...register("hora")}/>
            </label>
            <label> Imagen
              <input type="file" {...register("imagen")}/>
            </label>
            <input type="submit" value="Enviar" />
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
