import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles/proximosEventos.css";
import { EventosBox } from "../Eventos/EventosBox";
import { getAllEventosAprobados } from "../../services/eventos.service";
import { getTicketByEventPrecio } from "../../services/tickets.service";

//Seccion donde se mostraran los proximos eventos del sitio
export const ProximosEventos = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    async function cargarEventos() {
      try {
        const res = await getAllEventosAprobados();
        const datosEventoCompleto = await Promise.all(
          res.data.map(async (evento) => {
            const precios = await getTicketByEventPrecio(evento.id_Evento);
            const fechaFormateada = new Date(evento.fecha).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
            return {
              id: evento.id_Evento,
              nombre: evento.nombre,
              imagen: evento.imagen,
              precioMin: precios.data.precios.precioMinimo,
              precioMax: precios.data.precios.precioMaximo,
              fecha: fechaFormateada,
              hora: evento.hora
            };
          })
        );
        setEventos(datosEventoCompleto);
      } catch (error) {
        console.error("Error cargando los eventos:", error);
      }
    }

    cargarEventos();
  }, []); // Se ejecuta una vez al cargar el componente

  return (
    <section>
      <header className="proximosEventos">
        <h2>Próximos eventos</h2>
        <Link className="allEventos" to="/eventos">
          Todos los eventos
        </Link>
      </header>
      <div className="listaEventos">
        {eventos.slice(0, 3).map((evento) => (
          <EventosBox
            key={evento.id}
            nombre={evento.nombre}
            foto={evento.imagen}
            precioMin={evento.precioMin}
            precioMax={evento.precioMax}
            fecha={evento.fecha}
            hora={evento.hora}
            id={evento.id}
          />
        ))}
      </div>
    </section>
  );
};