import React, { useState, useEffect } from "react";
import { TicketBox } from "./TicketBox";
import { getAllTicketsByCli } from '../services/tickets.service';
import { getEvento } from '../services/eventos.service';

export const Tickets_profile = ({ rol, user_id}) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const cargarTickets = async () => {
        try {
          const res = await getAllTicketsByCli(user_id);
          const ticketsConInfoCompleta = await Promise.all(res.data.tickets.map(async (ticket) => {
            const eventoRes = await getEvento(ticket.evento);
            return {
              precio: ticket.precioInicial,
              tipo_ticket: ticket.tipo_ticket,
              qr: ticket.qr,
              foto: eventoRes.data.imagen,              
              eventoNombre: eventoRes.data.nombre,
              eventoFecha: eventoRes.data.fecha,
              eventoHora: eventoRes.data.hora
            };
          }));
          setTickets(ticketsConInfoCompleta);
        } catch (error) {
          console.error("Error al cargar los tickets:", error);
        }
    };
    if (rol=="CLIENTE") {
    cargarTickets();
  }
  }, []);

  if (rol=="CLIENTE") {//solo si es cliente tiene tickets asociados
    return (<>
        <h2 className="tusTickets">Tus tickets</h2>
        <section className="allListaEventosa">
          {tickets?.map((ticket, index) => (
            <TicketBox
              key={index}
              nombre={ticket.eventoNombre}
              foto={ticket.foto}
              tipo_ticket={ticket.tipo_ticket}
              precio={ticket.precio}
              fecha={ticket.eventoFecha}
              hora={ticket.eventoHora}
              qr={ticket.qr}
            />
          ))}
        </section>
        </>
    )}
  else{
    return null;
  }
}
