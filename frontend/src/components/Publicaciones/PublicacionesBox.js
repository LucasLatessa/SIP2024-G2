import { Link } from "react-router-dom";
import "../styles/eventosBox.css";

export const PublicacionesBox = ({ id, foto, precio,eventoNombre,eventoFecha,eventoHora}) => {
    return(
        <article className="evento">
            <h2>{eventoNombre}</h2>
            <img src={foto} alt="Imagen del evento" />
            <p className="precio"> ${precio} id: {id}</p>
            <p className="fecha">{eventoFecha} - {eventoHora}</p>
            <Link to={`/publicacion/${id}`}>Comprar</Link>
        </article>
    );
}