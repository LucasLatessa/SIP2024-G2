import { Link } from "react-router-dom";
import "../Eventos/styles/eventosBox.css";

//Forma de mostrar las publicaciones dentro de la pagina
export const PublicacionesBox = ({ id, foto, precio,precio_original,eventoNombre,eventoFecha,eventoHora}) => {
    return(
        <article className="evento">
            <h2>{eventoNombre}</h2>
            <img src={foto} alt="Imagen del evento" />
            <div className="precio">
                <p>Precio: ${precio}</p>
                <p> Precio de referencia: ${precio_original}</p>
            </div>
            <p className="fecha">{eventoFecha} - {eventoHora}</p>
            <Link to={`/publicacion/${id}`}>Comprar</Link>
        </article>
    );
}
