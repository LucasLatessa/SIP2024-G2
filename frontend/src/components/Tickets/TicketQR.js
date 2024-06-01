import "./styles/ticketQR.css";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const TicketQR = ({ nombre, fecha, hora, qr, lugar }) => {
  /*Cambio el formato de fecha-hora*/
  const formatoFecha = (fechaOriginal) => {
    return format(new Date(fechaOriginal), "d 'de' MMMM", { locale: es });
  };

  const formatoHora = (horaOriginal) => {
    const partes = horaOriginal.split(":");

    const horas = partes[0];
    const minutos = partes[1];

    const horaFormateada = `${horas}:${minutos}`;

    return horaFormateada;
  };

  return (
    <figure className="ticketQR">
      <img
        className="imagenEventoQR"
        src="/assets/entrada.png"
        alt=""
        srcset=""
      />
      <figcaption className="datosEventoQR">
        <h3 className="datosEventoQRNombre">{nombre}</h3>
        <p className="datosEventoQRFecha">{formatoFecha(fecha)}</p>
        <img className="datosEventoQRImagen" src={qr} alt="" />
        <p className="datosEventoQRhora">{formatoHora(hora)} hs.</p>
        <p className="datosEventoQRlugar">{lugar}</p>
      </figcaption>
    </figure>
  );
};
