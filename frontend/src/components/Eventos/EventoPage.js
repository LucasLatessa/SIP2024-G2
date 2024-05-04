import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useParams } from "react-router";
import {
  FetchGET,
  getAllEventos,
  getEvento,
} from "../../services/eventos.service";
import "../styles/EventoPage.css";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

//Pagina donde se mostrara datos del evento y la posibilidad de comprar entradas
export const EventoPage = () => {
  const { id } = useParams(); //Obtengo el id del evento
  const [eventos, setEventos] = useState([]);

  //Realizo la peticion para obtener el evento
  useEffect(() => {
    async function cargarEventos() {
      const res = await getEvento(id); //Solo eventos validos, si no existe hay que arreglarlo
      setEventos(res.data);
    }
    cargarEventos();
  }, []);

  return (
    <>
      <Header />
      <main className="App">
        {eventos ? ( // Si existe el evento muestro los datos
          <>
            <header className="headerEvento">
              <img
                className="imagen"
                src={eventos.imagen}
                alt={"Imagen " + eventos.nombre}
              />
            </header>
            <article className="informacionEvento">
              <h1 className="titulo">{eventos.nombre}</h1>
              <p className="fecha">
                Fecha del evento: {eventos.fecha} - {eventos.hora}
              </p>
              <section className="comprarEntrada">
                <h3>Compra tu entrada</h3>
                <form>
                  { /* COMPRAR ENTRADA FORM */}
                </form>
              </section>
              <section>
                <h3>Acerca del evento</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam totam ut ipsum obcaecati neque voluptate labore nesciunt eligendi ab mollitia. Ipsa, culpa voluptatibus? Repudiandae minus corporis, ab ipsam eum est?</p>
              </section>
              <section>
                <h3>Como llegar</h3>
                {/* Mapita de Google Maps*/}
              </section>
            </article>
          </>
        ) : (
          <p>No existe el evento</p> // NO ANDA POR EL MOMENTO
        )}
        <section className="comprarEntradas">
          <form>{/* En proceso */}</form>
        </section>
      </main>
      <Footer />
    </>
  );
};
