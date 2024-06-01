import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useParams } from "react-router";
import "../Eventos/styles/EventoPage.css";
import { useEffect, useState } from "react";
import { getPublicacion } from "../../services/publicacion.service";
import { getEvento } from "../../services/eventos.service";
import { getTicket } from "../../services/tickets.service";
import { getUser } from "../../services/usuarios.service";

//Pagina donde se puede ver la publicacion en si
export const PublicacionPage = () => {
  const { id } = useParams(); //Obtengo el id del evento
  const [publicacion, setPublicacion] = useState(null);

  useEffect(() => {
    async function cargarPublicacion() {
      try {
        const res = await getPublicacion(id);
        const publicacionConInfoCompleta = res.data;
        const ticketRes = await getTicket(publicacionConInfoCompleta.ticket);
        const vendedorRes = await getUser(ticketRes.data.propietario);
        const eventoRes = await getEvento(ticketRes.data.evento);
        const publicacionCompleta = {
          id: publicacionConInfoCompleta.id_Publicacion,
          precio: publicacionConInfoCompleta.precio,
          fecha: publicacionConInfoCompleta.fecha,
          foto: eventoRes.data.imagen,
          vendedorNombre: vendedorRes.data.nickname,
          eventoNombre: eventoRes.data.nombre,
          eventoFecha: eventoRes.data.fecha,
          eventoHora: eventoRes.data.hora,
        };
        setPublicacion(publicacionCompleta);
      } catch (error) {
        console.error("Error al cargar la publicación:", error);
      }
    }
    cargarPublicacion();
  }, [id]);

  return (
    <>
      <Header />
      <main className="App">
        {publicacion ? (
          <section className="informacionEvento">
            <h2 className="titulo">{publicacion.eventoNombre}</h2>
            <figure className="figuraEvento">
              <img
                className="imagen"
                src={publicacion.foto}
                alt={"Imagen " + publicacion.eventoNombre}
              />
              <figcaption className="descripcion"> Lorem</figcaption>
              <figcaption className="fechas">
                {" "}
                Fecha del evento: {publicacion.eventoFecha} -{" "}
                {publicacion.eventoHora}{" "}
              </figcaption>
              <p>Precio: ${publicacion.precio}</p>
              <p>Publicada por: {publicacion.vendedorNombre} </p>
            </figure>
          </section>
        ) : (
          <p>No existe el evento</p>
        )}
        <section className="comprarEntradas">
          <form></form>
        </section>
      </main>
      <Footer />
    </>
  );
};
