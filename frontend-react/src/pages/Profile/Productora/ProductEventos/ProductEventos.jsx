import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { getEventosByProductora } from "../../../../services/eventos.service";
import "./ProductEventos.css";
import { EventProductView } from "../../../../components/Event/EventProductView/EventProductView";

function ProductEventos() {
  const [eventos, setEventos] = useState([]);
  const { usuario, role, photo } = useOutletContext();

  useEffect(() => {
      const fetchEventos = async () => {
      try {
        //console.log(id)
        const response = await getEventosByProductora(usuario.user_id);
        setEventos(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de eventos de la productora");
      }}

      fetchEventos();
  }, [role])

  useEffect(() => {
    console.log(eventos)
  },[eventos])

  return (
    <>
      <article className="productEventos">
        <h1>Mis Eventos</h1>
        <hr />
        <section className="allListaEventosProductora">
          {eventos?.map((evento) => (
            <EventProductView
              key={evento.id_Evento}
              id={evento.id_Evento}
              nombre={evento.nombre}
              imagen={evento.imagen}
            />
          ))}
        </section>
        <Link className="crearEventoProductora" to="/crear-evento">
        Crear Evento
        </Link>
      </article>
    </>
    )
}

export default ProductEventos