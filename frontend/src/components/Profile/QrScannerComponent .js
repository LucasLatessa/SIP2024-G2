import React, { useState } from "react";
import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useParams } from "react-router";
import "./styles/escanearQR.css";
import { Scanner } from "@yudiel/react-qr-scanner";
import { cambiarEstadoTicket, getTicket } from "../../services/tickets.service";
import { getEvento } from "../../services/eventos.service";

export const QrScannerComponent = () => {
  const { id } = useParams();
  const [ticketInfo, setTicketInfo] = useState(null);
  const [error, setError] = useState(null);
  const [scanActivo, setScanActivo] = useState(true);

  const analizarEntrada = async (data) => {
    if (!data || !scanActivo) return;

    setScanActivo(false);
    const [ide, idt, dni] = data.split("-");
    try {
      const resEvento = await getEvento(ide);
      if (id === ide) {
        const ticketData = await getTicket(idt);
        if (ticketData) {
          setTicketInfo({
            tipo_ticket: ticketData.data.tipo_ticket,
            ide: resEvento.data.nombre,
            dni: ticketData.data.propietario,
            mensaje: ticketData.data.usada
              ? "La entrada ya fue usada"
              : "Entrada válida, que lo disfrute!",
          });
          if (!ticketData.data.usada) {
            await cambiarEstadoTicket(idt);
          }
          setError(null);
        } else {
          setTicketInfo(null);
          setError("No se encontró el ticket");
        }
      } else {
        setError("La entrada no pertenece a este evento");
      }
    } catch (e) {
      setError("Error procesando la entrada");
    }
  };

  const cerrarModal = () => {
    setTicketInfo(null);
    setError(null);
    setScanActivo(true);
  };

  return (
    <>
      <Header />
      <main className="qr-main">
        <h1 className="escanearQRTitulo">Validar entrada</h1>
        {scanActivo && (
          <div className="scanner-box">
            <Scanner
              onScan={(result) => {
                if (result?.[0]?.rawValue) {
                  analizarEntrada(result[0].rawValue);
                }
              }}
              options={{
                constraints: { facingMode: "environment" },
              }}
            />
          </div>
        )}
        {/* Modal */}
        {!scanActivo && (ticketInfo || error) && (
          <div className="modal-qr-overlay">
            <div className="modal-qr-content">
              {ticketInfo ? (
                <>
                  <h2
                    className={
                      ticketInfo.mensaje === "Entrada válida, que lo disfrute!"
                        ? "escanearQR"
                        : "errorQR"
                    }
                  >
                    {ticketInfo.mensaje}
                  </h2>
                  <ul className="datosEntradaQR">
                    <li>Ticket: {ticketInfo.tipo_ticket}</li>
                    <li>Evento: {ticketInfo.ide}</li>
                    <li>DNI: {ticketInfo.dni}</li>
                  </ul>
                </>
              ) : error ? (
                <h2 className="errorQR">{error}</h2>
              ) : null}
              <button onClick={cerrarModal}>Cerrar</button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};
