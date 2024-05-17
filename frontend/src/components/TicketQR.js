import "./styles/ticketQR.css";

export const TicketQR = ({nombre,fecha,hora,qr}) => {
  return (
    <figure className="ticketQR">
        <img className="imagenEventoQR" src="/assets/entrada.png" alt="" srcset="" />
        <figcaption className="datosEventoQR">
            <h3 className="datosEventoQRNombre">{nombre}</h3>
            <p className="datosEventoQRFecha">{fecha}</p>
            <img className="datosEventoQRImagen" src={qr} alt="" srcset="" />
        </figcaption>
    </figure>
  )
}
