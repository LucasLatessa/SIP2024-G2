import React, { useState, useEffect } from "react";
import { getAllTicketsByCli } from "../../../../services/tickets.service";
import { getEvento } from "../../../../services/eventos.service";
import { getLugar } from "../../../../services/lugar.service";
import { useOutletContext } from "react-router-dom";
import EventTicketUser from "../../../../components/Event/EventTicketUser/EventTicketUser";
import "./CliEventos.css";

function CliEventos() {
  const [tickets, setTickets] = useState([]);
  const { usuario, role, photo } = useOutletContext();

  useEffect(() => {
    const cargarTickets = async () => {
      try {
        //Obtengo todos los ticket de un cliente con la informacion completa
        const res = await getAllTicketsByCli(usuario.user_id);
        const ticketsConInfoCompleta = await Promise.all(
          res.data.tickets.map(async (ticket) => {
            const eventoRes = await getEvento(ticket.evento);
            const lugarRes = await getLugar(eventoRes.data.lugar);
            return {
              id_ticket: ticket.id_Ticket,
              precio: ticket.precioInicial,
              tipo_ticket: ticket.tipo_ticket,
              qr: ticket.qr,
              usada: ticket.usada,
              foto: eventoRes.data.imagen,
              eventoNombre: eventoRes.data.nombre,
              eventoFecha: eventoRes.data.fecha,
              eventoHora: eventoRes.data.hora,
              eventoLugarNombre: lugarRes.data.nombre,
            };
          })
        );
        setTickets(ticketsConInfoCompleta);
      } catch (error) {
        console.error("Error al cargar los tickets:", error);
      }
    };

    cargarTickets();
  }, [role]);

  const eliminarTicketDeLista = (idParaBorrar) => {
    setTickets((prevTickets) => 
      prevTickets.filter((t) => t.id_ticket !== idParaBorrar)
    );
  };

  //console.log(role);
  //console.log(usuario);
  //console.log(tickets);

  return (
    <>
      <article className="cliEventos">
        <h1>Mis eventos</h1>
        <hr />
        <section className="allListaEventos">
          {tickets?.map((ticket, index) => (
            <EventTicketUser
              key={index}
              id_ticket={ticket.id_ticket}
              nombre={ticket.eventoNombre}
              foto={ticket.foto}
              tipo_ticket={ticket.tipo_ticket}
              precio={ticket.precio}
              fecha={ticket.eventoFecha}
              hora={ticket.eventoHora}
              qr={ticket.qr}
              lugar={ticket.eventoLugarNombre}
              usada={ticket.usada}
              onTicketAction={eliminarTicketDeLista}
            />
          ))}
        </section>
      </article>
    </>
  );
}

export default CliEventos;
