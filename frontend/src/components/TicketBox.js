import { Link } from "react-router-dom";
import "./styles/ticketsBox.css";

export const TicketBox = ({nombre, foto, tipo_ticket, precio, fecha,hora}) => {
    return(
        <article className="ticket">
            <h2>{nombre}</h2>
            <img src={foto} alt="Imagen del evento" />
            <p className="precio"> ${precio}</p>
            <p className="tipo"> {tipo_ticket}</p>
            <p className="fecha">{fecha} - {hora}</p>
            <Link to={``}>Ver QR (prox) </Link>
        </article>
    );
}