import "./styles/ticketQR.css";

export const TicketQR = ({nombre,fecha,hora,qr}) => {
  return (
    <figure className="ticketQR">
        <img className="imagenEvento" src="/assets/entrada.png" alt="" srcset="" />
        <figcaption>
            <h3>{nombre}</h3>
            <p>

            </p>
        </figcaption>
    </figure>
  )
}
