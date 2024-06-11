import React from "react";
import { Link } from "react-router-dom";
import "./styles/eventosBox.css";

export const EventosBox = ({id, nombre, foto, precioMin, precioMax, fecha,hora}) => {
    
    console.log(id)
    return(
        <article className="evento">
            <h2>{nombre}</h2>
            <img src={foto} alt="Imagen del evento" />
            <p className="precio"> ${precioMin} a ${precioMax}</p>
            <p className="fecha">{fecha} - {hora}</p>
            <Link to={`/evento/${id}`}>Comprar</Link>
        </article>
    );
}