import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { EventosBox } from "../EventosBox";
import "../styles/Eventos.css";
import { getAllEventos } from "../../services/eventos.service";
import { useEffect, useState } from "react";


export const Eventos = () => {
  const [eventos, setEventos] = useState([]);

  //Realizo la peticion
  useEffect(() => {
    async function cargarEventos(){
      const res = await getAllEventos();
      setEventos(res.data);
    }
    cargarEventos();
  }, [])

  return (
    <>
      <Header />
      <main>
        <header className="tituloEventos">
          <h1>Eventos</h1>
        </header>
        
        <section className="allListaEventosa">
          {eventos?.map((eventos) => (
            <EventosBox
            id={eventos.id_Evento}
            nombre={eventos.nombre}
            foto={eventos.imagen}
            precioMin={"500"}
            precioMax={"700"}
            fecha={eventos.fecha}
            hora={eventos.hora}
          />)
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};
