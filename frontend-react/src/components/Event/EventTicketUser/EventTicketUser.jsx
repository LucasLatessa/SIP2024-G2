import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TicketQR } from "../../Tickets/TicketQR/TicketQR";
import { TransferirTicketModal } from "../../Tickets/TransferirTicketModal/TransferirTicketModal";

import { formatearFechaParaCard } from "../../../utils/dateFormatter";
import "./EventTicketUser.css";
import { VenderTicketModal } from "../../Tickets/VenderTicketModal/VenderTicketModal";

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
  onTicketAction
}) => {
  const [modalType, setModalType] = useState(null); // modalType: "qr" | "transferir" | "vender" | null
  const fechaHoraCompleta = `${fecha} - ${hora}`;
  const {
    dia,
    mes,
    hora: horaVisual,
  } = formatearFechaParaCard(fechaHoraCompleta);

  const openModal = (type) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
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
            <button className="publicar" onClick={() => openModal("vender")}>
              Vender
            </button>
            <button
              className="transferir"
              onClick={() => openModal("transferir")}
            >
              Transferir
            </button>
            <button className="modalQR" onClick={() => openModal("qr")}>
              Ver QR
            </button>
          </div>
        )}
      </article>

      {modalType && (
        <div className="modal">
          <div onClick={closeModal} className="overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              {modalType === "qr" && (
                <TicketQR
                  nombre={nombre}
                  fecha={fecha}
                  hora={hora}
                  qr={qr}
                  lugar={lugar}
                />
              )}

              {modalType === "transferir" && (
                <TransferirTicketModal
                  ticket={{
                    id_ticket,
                    nombre,
                    foto,
                    tipo_ticket,
                    fecha,
                    hora,
                  }}
                  onClose={closeModal}
                  onSuccess={() => onTicketAction(id_ticket)}
                />
              )}

              {modalType === "vender" && (
                <VenderTicketModal
                  ticket={{
                    id_ticket,
                    nombre,
                    foto,
                    tipo_ticket,
                    fecha,
                    hora,
                  }}
                  onClose={closeModal}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventTicketUser;
