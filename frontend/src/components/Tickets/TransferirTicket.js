import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import "../Eventos/styles/EventoPage.css";
import { transferir } from '../../services/tickets.service';
import { getUserNick } from '../../services/usuarios.service';
import { useNavigate } from "react-router-dom";

//Publicacion de tickets dentro del sitio
export const TransferirTicket = () => {
  const location = useLocation();
  const { ticket } = location.state || {}; // Obtener el ticket del estado del router
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [usuarioData, setUsuarioData] = useState(null);

  useEffect(() => {
  }, [location.state, ticket]);

  const handleTransferir = async (data) => {
    try {
      const transferencia = {
        ticket: ticket.id_ticket,
        nickname: data.nickname
      };
      const response = await getUserNick(transferencia.nickname);
      setUsuarioData(response.data.usuario);
    } catch (error) {
      console.error("Error during transfer:", error);
    }
  };

  const handleConfirmarTransferencia = async () => {
    try {
      if (usuarioData) {
        const transferencia = {
          ticket: ticket.id_ticket,
          nickname: usuarioData.nickname
        };
        const response = await transferir(transferencia.ticket,transferencia.nickname);
        // Redirigir o mostrar mensaje de éxito
        navigate("/perfil");
      }
    } catch (error) {
      console.error("Error al confirmar transferencia:", error);
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
                  <form onSubmit={handleSubmit(handleTransferir)}>
                    <p>Tipo de ticket: {ticket.tipo_ticket}</p>
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
                      <button type="submit">Transferir</button>
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
                        <button onClick={handleConfirmarTransferencia}>Confirmar</button>
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
