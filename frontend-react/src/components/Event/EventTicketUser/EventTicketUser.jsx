import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TicketQR } from "../TicketQR/TicketQR";
import { formatearFechaParaCard } from "../../../utils/dateFormatter";
import "./EventTicketUser.css";

const EventTicketUser = ({
  id_ticket,
  nombre,
  foto,
  tipo_ticket,
  precio,
  fecha,
  hora,
  qr,
  lugar,
  usada,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const openModal = (ticket) => {
    setModalOpen(true);
  };
  const fechaHoraCompleta = `${fecha} - ${hora}`;
  const {
    dia,
    mes,
    hora: horaVisual,
  } = formatearFechaParaCard(fechaHoraCompleta);
  

  const closeModal = () => {
    setModalOpen(false);
  };
  const handlePublicar = () => {
    const ticket = {
      id_ticket,
      nombre,
      foto,
      tipo_ticket,
      precio,
      fecha,
      hora,
      qr,
      lugar,
    };
    navigate("/publicar-ticket", { state: { ticket } });
  };
  const handleTransferir = () => {
    const ticket = {
      id_ticket,
      nombre,
      foto,
      tipo_ticket,
      precio,
      fecha,
      hora,
      qr,
      lugar,
    };
    navigate("/transferirTicket", { state: { ticket } });
  };

  return (
    <>
      <article className={`ticket ${usada ? "usado" : "no-usado"}`}>
        <h2>{nombre}</h2>
        <img src={foto} alt="Imagen del evento" />
        <p className="precio"> ${precio} </p>
        <p className="tipo"> {tipo_ticket}</p>
        <p className="fecha">
          {dia}-{mes} {horaVisual}
        </p>
        {!usada && (
          <div className="acciones">
            <button className="publicar" onClick={handlePublicar}>
              Vender
            </button>
            <button className="transferir" onClick={handleTransferir}>
              Transferir
            </button>
            <button className="modalQR" onClick={openModal}>
              Ver QR
            </button>
          </div>
        )}
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

export default EventTicketUser;
