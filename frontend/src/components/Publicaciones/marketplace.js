import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { PublicacionesBox } from "./PublicacionesBox";
import "../styles/Eventos.css";
import { getAllPublicacion } from "../../services/publicacion.service";
import { getEvento } from "../../services/eventos.service";
import { getTicket } from "../../services/tickets.service";
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
            <PublicacionesBox
            id={publicacion.id}
            foto={publicacion.imagen}
            precio={publicacion.precio}
            fecha={publicacion.fecha}
          />)
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};
/* export const Marketplace = () => {
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    async function cargarPublicaciones() {
  try {
    const res = await getAllPublicacion();
    const publicacionesConInfoCompleta = await Promise.all(res.data.map(async (publicacion) => {
      const ticketRes = await getTicket(publicacion.ticket);
      const eventoRes = await getEvento(ticketRes.data.evento);
      return {
        id: publicacion.id,
        foto: eventoRes.data.imagen,
        precio: publicacion.precio,
        fecha: publicacion.fecha,
        hora: eventoRes.data.hora,
        eventoNombre: eventoRes.data.nombre,
        eventoFecha: eventoRes.data.fecha
      };
    }));
    setPublicaciones(publicacionesConInfoCompleta);
  } catch (error) {
    console.error("Error al cargar las publicaciones:", error);
  }
}
    cargarPublicaciones();
  }, []);

  return (
    <>
      <Header />
      <main>
        <header className="tituloEventos">
          <h1>Mercado</h1>
        </header>
        
        <section className="allListaEventosa">
          {publicaciones?.map((publicacion) => (
            <PublicacionesBox
              id={publicacion.id}
              foto={publicacion.foto}
              precio={publicacion.precio}
              fecha={publicacion.fecha}
              hora={publicacion.hora}
              eventoNombre={publicacion.eventoNombre}
              eventoFecha={publicacion.eventoFecha}
            />
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
};  */