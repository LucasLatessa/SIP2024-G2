import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import "../Eventos/styles/EventoPage.css";
import { preferenciaTransferencia } from '../../services/tickets.service';
import { getUserNick } from '../../services/usuarios.service';
import { useNavigate } from "react-router-dom";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

//Publicacion de tickets dentro del sitio
export const TransferirTicket = () => {
  const location = useLocation();
  const { ticket } = location.state || {}; // Obtener el ticket del estado del router
  const { register, handleSubmit } = useForm();
  const [usuarioData, setUsuarioData] = useState(null);
  const porcTransferencia = 30;
  const [buttonClicked, setButtonClicked] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  initMercadoPago("APP_USR-c2efa0aa-3b60-4f2e-9d59-2e6922b0d2b2", {
    locale: "es-AR",
  });

  useEffect(() => {
    if (ticket) {
    ticket.costoTransferencia = ticket.precio * porcTransferencia/100;
  }
  }, [location.state, ticket]);

  const handleVerificar = async (data) => {
  try {
    setButtonClicked(true);
    const response = await getUserNick(data.nickname);
    const usuario = response.data.usuario; // usuario obtenido directamente
    setUsuarioData(usuario); // guardamos en estado por si quieres mostrar

    if (usuario) {
      const responsePref = await preferenciaTransferencia(ticket.id_ticket, ticket.costoTransferencia, usuario.nickname);
      if (responsePref?.data.success) {
        setPreferenceId(responsePref.data.preference_id);
      }
    }
  } catch (error) {
    console.error("Error durante la transferencia:", error);
  }
};

  return (
    <>
      <Header />
      <main className="App">
        {ticket ? ( // Si existe el ticket muestro los datos
          <>
            <header className="headerEvento">
              <img
                className="imagen"
                src={ticket.foto}
                alt={"Imagen " + ticket.nombre}
              />
            </header>
            <article className="informacionEvento">
              <section className="titulo-fecha">
                <h1 className="titulo">{ticket.nombre}</h1>
                <p className="fecha">
                  Fecha del evento: {ticket.fecha} - {ticket.hora}
                </p>
              </section>

              <section className="transferirEntrada">
                <h3>Transferí tu entrada</h3>
                <section className="formTransferirEntrada">
                  <form onSubmit={handleSubmit(handleVerificar)}>
                    <p>Tipo de ticket: {ticket.tipo_ticket}</p>
                    <p>Costo de transferencia({porcTransferencia}%): ${ticket.costoTransferencia}</p>
                    <label>
                      Nombre de usuario:
                      <input
                        type="text"
                        name="nickname"
                        {...register("nickname", { required: true })}
                        className="no-spin"
                      />
                    </label>
                    <section className="TransferirTicketButton">
                      <button type="submit">Verificar destinatario</button>
                    </section>
                  </form>
                  {usuarioData && (
                    <section className="usuarioData">
                      <h2 className="infoClienteTransferir">
                        Información del {usuarioData.rol.toLowerCase()}{" "}
                      </h2>
                      <p className="datos">Nombre: {usuarioData.nombre}</p>
                      <p className="datos">Apellido: {usuarioData.apellido}</p>
                      <p className="datos">Nickname: {usuarioData.nickname}</p>
                      <p className="datos">Correo: {usuarioData.correo}</p>
                      <section className="TransferirTicketButton">
                        {buttonClicked && (
                      <>
                        {preferenceId ? (
                          <div className="wallet-container">
                            <Wallet initialization={{ preferenceId: preferenceId }} />
                          </div>
                        ) : null}
                      </>
                    )}
                      </section>
                    </section>
                  )}
                </section>
              </section>
            </article>
          </>
        ) : (
          <p>No existe el evento</p>
        )}
      </main>
      <Footer />
    </>
  );
};
