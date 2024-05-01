import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useForm } from "react-hook-form";

export const ProgramarEvento = () => {

  const {register,formState: {errors}, handleSubmit} = useForm();

  const crearEvento = (data) => {
    console.log(data)
  }

  return (
    <>
      <Header />
      <main className="App">
        <header className="tituloEventos">
          <h1>Programar Evento</h1>
        </header>
        <section>
          <form onSubmit={handleSubmit(crearEvento)}>
            <label> Nombre del evento
              <input type="text" {...register('nombre', {
                required: true
              })}/>
              {errors.nombre?.type === 'required' && <p> El campo nombre es requerido</p>}
            </label>
            <label> Lugar
              <input type="text" {...register('lugar', {
                required: true
              })}/>
            </label>
            <label> Cantidad de entradas
              <input type="number" {...register('cantidadEntradas', {
                required: true
              })}/>
            </label>
            <label> Fecha
              <input type="date" {...register('fecha',{
                required: true
              })}/>
            </label>
            <label> Hora
              <input type="time" {...register('hora', {
                required: true
              })}/>
            </label>
            <label for="imagen"> Imagen
              <input type="file" accept=".jpg, .png"/>
            </label>
            <input type="submit" value="Enviar" />
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
