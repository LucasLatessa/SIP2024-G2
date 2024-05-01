import { Link } from "react-router-dom";
import "../styles/eventosBox.css";

export const PublicacionesBox = ({ id,nombre, foto, precio, fecha}) => {
    return(
        <article className="evento">
            <h2>{nombre}</h2>
            <img src={foto} alt="Imagen del evento" />
            <p className="precio"> ${precio}</p>
            <p  className="fecha">Fecha publicada: {fecha} </p>
            <Link to={`/publicacion/${id}`}>Comprar</Link>
        </article>
    );
}