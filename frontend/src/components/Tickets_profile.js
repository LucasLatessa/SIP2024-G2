import React, { useState, useEffect } from "react";
import { TicketBox } from "./TicketBox";
export const Tickets_profile = ({ rol}, {tickets}) => {

  if (rol=="CLIENTE") {//solo si es cliente tiene tickets asociados
    return (<>
        <h2 className="tusTickets">Tus tickets</h2>
        <section className="allListaEventosa">
          {tickets?.map((ticket) => (
            <TicketBox
              nombre={ticket.eventoNombre}
              foto={ticket.foto}
              tipo_ticket={ticket.tipo_ticket}
              precio={ticket.precio}
              fecha={ticket.eventoFecha}
              hora={ticket.eventoHora}
            />
          ))}
        </section>
        </>
    )}
  else{
    return null;
  }
}
