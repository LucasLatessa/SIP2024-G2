import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useParams } from "react-router";
import { FetchGET, getAllEventos, getEvento } from "../../services/eventos.service";
import "../styles/EventoPage.css"
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const EventoPage = () => {
  const { id } = useParams(); //Obtengo el id del evento
  const [eventos, setEventos] = useState([]);

  //Realizo la peticion
  useEffect(() => {
    async function cargarEventos(){
      const res = await getEvento(id);
      setEventos(res.data);
    }
    cargarEventos();
  }, [])

  return (
    <>
      <Header />
      <main className="App">
        {eventos ? (
        <section className="informacionEvento">
              <h2 className="titulo">{eventos.nombre}</h2>
              <figure className="figuraEvento">
                <img className="imagen" src={eventos.imagen} alt={"Imagen " + eventos.nombre}/>
                <figcaption className="descripcion"> Lorem </figcaption>
                <figcaption className="fechas"> Fecha del evento:  {eventos.fecha} - {eventos.hora} </figcaption>
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
