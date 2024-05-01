import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useParams } from "react-router";
import { FetchGET } from "../../services/service";
import "../styles/EventoPage.css"

export const EventoPage = () => {
  const { id } = useParams(); //Obtengo el id del evento
  const { data , loading, error } = FetchGET(
    `http://127.0.0.1:8000/eventos/Eventos/${id}`
  );

  return (
    <>
      <Header />
      <main className="App">
        {error && <h2>Error: {error}</h2>}
        {loading && <h2>Cargando eventos...</h2>}
        {data ? (
        <section className="informacionEvento">
              <h2 className="titulo">{data.nombre}</h2>
              <figure className="figuraEvento">
                <img className="imagen" src={data.imagen} alt={"Imagen " + data.nombre}/>
                <figcaption className="descripcion"> Lorem </figcaption>
                <figcaption className="fechas"> Fecha del evento:  {data.fecha} - {data.hora} </figcaption>
              </figure>
        </section>
        ) : (
          <p>No existe el evento</p>
        )}
        <section className="comprarEntradas">
          <form>
            
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
