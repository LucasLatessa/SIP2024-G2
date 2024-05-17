import { Link } from "react-router-dom";
import "./styles/ticketsBox.css";
import { useState } from "react";

export const TicketBox = ({nombre,foto,tipo_ticket,precio,fecha,hora}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTicket(null);
    setModalOpen(false);
  };

  return (
    <>
      <article className="ticket">
        <h2>{nombre}</h2>
        <img src={foto} alt="Imagen del evento" />
        <p className="precio"> ${precio}</p>
        <p className="tipo"> {tipo_ticket}</p>
        <p className="fecha">
          {fecha} - {hora}
        </p>
        <button className="modalQR" onClick={openModal}>Ver QR (prox) </button>
      </article>

      {modalOpen && (
        <div className="modal">
          <div onClick={closeModal} className="overlay"></div>
          <div className="modal-content">
            <h2>Hello Modal</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
              perferendis suscipit officia recusandae, eveniet quaerat assumenda
              id fugit, dignissimos maxime non natus placeat illo iusto!
              Sapiente dolorum id maiores dolores? Illum pariatur possimus
              quaerat ipsum quos molestiae rem aspernatur dicta tenetur. Sunt
              placeat tempora vitae enim incidunt porro fuga ea.
            </p>
            <button className="close-modal" onClick={closeModal}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
};
