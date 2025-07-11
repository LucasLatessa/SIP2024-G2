import React, { useState, useEffect } from "react";
import { TicketBox } from "../Tickets/TicketBox";
import { getAllTicketsByCli } from "../../services/tickets.service";

//Mostrar los tickets de un cliente
export const ClienteView = ({ rol, user_id }) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const cargarTickets = async () => {
      try {
        //Obtengo todos los ticket de un cliente con la informacion completa
        const res = await getAllTicketsByCli(user_id);
        setTickets(res.data.tickets);
      } catch (error) {
        console.error("Error al cargar los tickets:", error);
      }
    };
    //Si es cliente le cargo los tickets
    if (rol === "CLIENTE") {
      cargarTickets();
    }
  }, [rol, user_id]);

  if (rol === "CLIENTE") {
    //solo si es cliente tiene tickets asociados
    return (
      <>
        <h2 className="tusTickets">Tus tickets</h2>
        <section className="allListaEventosa">
          {tickets?.map((ticket, index) => (
            <TicketBox
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
            />
          ))}
        </section>
      </>
    );
  } else {
    return null;
  }
};
