import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { EventosBox } from "../EventosBox";
import "../styles/Eventos.css";
import { getAllPublicacion } from "../../services/publicacion.service";
import { useEffect, useState } from "react";

export const Marketplace = () => {
    const [publicaciones, setPublicaciones] = useState([]);

    useEffect(() => {
      async function cargarPublicaciones(){
        const res = await getAllPublicacion();
        setPublicaciones(res.data);
      }
      cargarPublicaciones();
    }, [])

    return (
      <>
        <Header />
        <main>
          <header className="tituloEventos">
            <h1>Mercado</h1>
          </header>
          
          <section className="allListaEventosa">
            {publicaciones?.map((publicacion) => (
              <EventosBox
              id={publicacion.id_Publicacion}
              nombre={publicacion.precio}
              foto={publicacion.imagen}
              precioMin={publicacion.precio}
              fecha={publicacion.fecha}
              hora={publicacion.hora}
            />)
            )}
          </section>
        </main>
  
        <Footer />
      </>
    );
  };
  