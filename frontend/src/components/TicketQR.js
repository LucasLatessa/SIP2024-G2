import "./styles/ticketQR.css";

export const TicketQR = ({nombre,fecha,hora,qr,lugar}) => {
  return (
    <figure className="ticketQR">
        <img className="imagenEventoQR" src="/assets/entrada.png" alt="" srcset="" />
        <figcaption className="datosEventoQR">
            <h3 className="datosEventoQRNombre">{nombre}</h3>
            <p className="datosEventoQRFecha">{fecha}</p>
            <img className="datosEventoQRImagen" src={qr} alt=""/>
            <p className="datosEventoQRhora">{hora}</p>
            <p className="datosEventoQRlugar">{lugar}</p>
        </figcaption>
    </figure>
  )
}
