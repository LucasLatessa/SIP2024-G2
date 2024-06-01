import "./styles/ticketsBox.css";
import { useState } from "react";
import { TicketQR } from "./TicketQR";
import { useNavigate } from "react-router-dom";

export const TicketBox = ({id_ticket,nombre,foto,tipo_ticket,precio,fecha,hora,qr,lugar}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const openModal = (ticket) => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const handlePublicar = () => {
    const ticket = {id_ticket, nombre, foto, tipo_ticket, precio, fecha, hora, qr, lugar };
    navigate('/publicar-ticket', { state: { ticket } });
  };
  return (
    <>
      <article className="ticket">
        <h2>{nombre}</h2>
        <img src={foto} alt="Imagen del evento" />
        <p className="precio"> ${precio} </p>
        <p className="tipo"> {tipo_ticket}</p>
        <p className="fecha">
          {fecha} - {hora}
        </p>
        <button className="publicar" onClick={handlePublicar}>Vender</button>
        <button className="transferir">Transferir</button>
        <button className="modalQR" onClick={openModal}>Ver QR</button>
      </article>

      {modalOpen && (
        <div className="modal">
          <div onClick={closeModal} className="overlay">
          <TicketQR
              nombre={nombre}
              fecha={fecha}
              hora={hora}
              qr={qr}
              lugar={lugar}
            />
          </div>
          
        </div>
      )}
    </>
  );
};
