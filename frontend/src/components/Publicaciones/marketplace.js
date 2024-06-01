import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { PublicacionesBox } from "./PublicacionesBox";
import "../Eventos/styles/Eventos.css";
import { getAllPublicacion } from "../../services/publicacion.service";
import { getEvento } from "../../services/eventos.service";
import { getTicket } from "../../services/tickets.service";
import { useEffect, useState } from "react";

//Mercado de entradas
export const Marketplace = () => {
  const [publicaciones, setPublicaciones] = useState([]);

  //Traigo todas las publicaciones
  useEffect(() => {
    async function cargarPublicaciones() {
      try {
        const res = await getAllPublicacion();
        const publicacionesConInfoCompleta = await Promise.all(
          res.data.map(async (publicacion) => {
            const ticketRes = await getTicket(publicacion.ticket);
            const eventoRes = await getEvento(ticketRes.data.evento);
            return {
              id: publicacion.id_Publicacion,
              precio: publicacion.precio,
              fecha: publicacion.fecha,
              foto: eventoRes.data.imagen,
              eventoNombre: eventoRes.data.nombre,
              eventoFecha: eventoRes.data.fecha,
              eventoHora: eventoRes.data.hora,
            };
          })
        );
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
              eventoNombre={publicacion.eventoNombre}
              eventoFecha={publicacion.eventoFecha}
              eventoHora={publicacion.eventoHora}
            />
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
};
