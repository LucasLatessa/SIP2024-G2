import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useForm } from "react-hook-form";
import { AxiosPOST, FetchGET } from "../../services/service";
import axios from 'axios';

export const ProgramarEvento = () => {

  const {register,formState: {errors}, handleSubmit} = useForm();

  const { data , loading, error } = FetchGET(
    `http://127.0.0.1:8000/eventos/Lugar`
  );

  const onSubmit = handleSubmit(async data => {
    const res = await axios.post('http://127.0.0.1:8000/eventos/Eventos/',data)
    console.log(res)
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
            <label> Nombre del evento
              <input type="text" {...register('nombre', {
                required: true
              })}/>
              {errors.nombre?.type === 'required' && <p> El campo nombre es requerido</p>}
            </label>
            <label> Lugar
              <select {...register("lugar")}>
              {data ?.map((lugar) => (
                <option key={lugar.id_Lugar} value={lugar.id_Lugar}> {lugar.nombre}</option>
              ))}
              </select>
            </label>
            <label> Cantidad de entradas
              <input type="number" {...register("cantidadEntradas")}/>
            </label>
            <label> Fecha
              <input type="date" {...register("fecha")}/>
            </label>
            <label> Hora
              <input type="time" {...register("hora")}/>
            </label>
            <label htmlFor="imagen"> Imagen
              <input type="file" accept=".jpg, .png" {...register("imagen")}/>
            </label>
            <input type="submit" value="Enviar" />
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
