import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { EventosBox } from "../EventosBox";
import "../styles/Eventos.css";
import { getAllEventos } from "../../services/eventos.service";
import { useEffect, useState } from "react";

//Pagina donde se mostraran todos los eventos posibles
export const Eventos = () => {
  const [eventos, setEventos] = useState([]);

  //Realizo la peticion para obtener todos los eventos
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
          {eventos?.map((eventos) => ( //Obtengo todos los eventos y utilizo el componente para mostrarlos
            <EventosBox
            key={eventos.id_Evento}
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
