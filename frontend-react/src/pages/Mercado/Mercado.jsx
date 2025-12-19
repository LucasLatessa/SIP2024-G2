import { getAllPublicacion1 } from "../../services/publicacion.service";
import { getEvento } from "../../services/eventos.service";
import { getTicket, getTipoTicket } from "../../services/tickets.service";
import { useEffect, useEffectEvent, useState } from "react";
import { EventTicket } from "../../components/Event/EventTicket/EventTicket";

import "./Mercado.css";
import { MercadoFiltro } from "../../components/Filtros/MercadoFiltro";
import DataGuard from "../../components/DataGuards.jsx";

export const Mercado = ({}) => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [cargando, setCargando] = useState(true);

  //Traigo todas las publicaciones
  useEffect(() => {
    async function cargarPublicaciones() {
      try {
        const res = await getAllPublicacion1();
        const publicacionesConInfoCompleta = await Promise.all(
          res.data.publicaciones.map(async (publicacion) => {
            const ticketRes = await getTicket(publicacion.ticket_id);
            const eventoRes = await getEvento(ticketRes.data.evento);
            const tipoRes = await getTipoTicket(ticketRes.data.tipo_ticket);
            return {
              id: publicacion.id_Publicacion,
              precio: publicacion.precio,
              fecha: publicacion.fecha,
              tipo: tipoRes.data.tipo,
              foto: eventoRes.data.imagen,
              eventoNombre: eventoRes.data.nombre,
              eventoFecha: eventoRes.data.fecha,
              eventoHora: eventoRes.data.hora,
            };
          })
        );
        setPublicaciones(publicacionesConInfoCompleta);
        setFilteredTickets(publicacionesConInfoCompleta);
      } catch (error) {
        console.error("Error al cargar las publicaciones:", error);
      }  finally {
      setCargando(false);
    }
      
    }
    cargarPublicaciones();
  }, []);

  useEffect(() => {
    console.log(filteredTickets);
  }, [filteredTickets]);

  return (
    <DataGuard cargando={cargando}>
    <main className="mercado">
      <MercadoFiltro tickets={publicaciones} setFilteredTickets={setFilteredTickets}/>
      <section className="listMercado">
        {filteredTickets?.map((publicacion) => (
          <EventTicket
            id={publicacion.id}
            foto={publicacion.foto}
            precio={publicacion.precio}
            tipo={publicacion.tipo}
            eventoNombre={publicacion.eventoNombre}
            eventoFecha={publicacion.eventoFecha}
            eventoHora={publicacion.eventoHora}
          />
        ))}
      </section>
    </main>
    </DataGuard>
  );
};
