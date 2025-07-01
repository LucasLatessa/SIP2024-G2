import "./styles/ticketQR.css";
import { es } from "date-fns/locale";
import { parse, format } from "date-fns";

export const TicketQR = ({ nombre, fecha, hora, qr, lugar }) => {
  /*Cambio el formato de fecha-hora*/
  const formatoFecha = (fechaOriginal) => {
  const fecha = parse(fechaOriginal, "dd/MM/yyyy", new Date());
  return format(fecha, "d 'de' MMMM 'de' yyy", { locale: es });
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
