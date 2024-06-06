import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useLocation } from "react-router-dom";
import { useForm,useWatch  } from "react-hook-form";
import { useState, useEffect } from "react";
import "../Eventos/styles/EventoPage.css";
import { tranferir } from '../../services/tickets.service';
import { getUserNick } from '../../services/usuarios.service';
import { useNavigate } from "react-router-dom";

//Publicacion de tickets dentro del sitio
export const TransferirTicket = () => {
  const location = useLocation();
  const { ticket } = location.state || {}; // Obtener el ticket del estado del router
  const { register, control } = useForm();
  const navigate = useNavigate();
  const [usuarioData, setusuarioData] = useState(null);
  const [nickname, setNickname] = useState(null);

  const handleTransferir= async () => {
    const transferencia= {
      ticket: ticket.id_ticket,
      nickname: nickname
    }
    const response = await getUserNick(transferencia.nickname);
    setusuarioData(response.data.usuario);
  }

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

              <section className="TransferirEntrada">
                <h3>Tranferí tu entrada</h3>
                <section className="formTransferirEntrada">
                  <form>
                    <p>Tipo de ticket: {ticket.tipo_ticket}</p>
                    <label>
                      Nombre de usuario:
                      <input
                        type="text"
                        name="dni"
                        {...register("nickname", { required: true })}
                      />
                    </label>
                    <section className="TransferirTicketButton">
                      <button onClick={handleTransferir}>Transferir</button>
                    </section>
                  </form>
                  {usuarioData && (
                    <div>
                      <h2 className="infoClienteProfile">
                        Información del {usuarioData.rol.toLowerCase()}{" "}
                      </h2>
                      <p className="datos">ID: {usuarioData.user_id}</p>
                      <p className="datos">DNI: {usuarioData.dni} </p>
                      <p className="datos">Nombre: {usuarioData.nombre}</p>
                      <p className="datos">Apellido: {usuarioData.apellido}</p>
                      <p className="datos">Nickname: {usuarioData.nickname}</p>
                      <p className="datos">Correo: {usuarioData.correo}</p>
                    </div>
                  )}
                  <section className="TransferirTicketButton">
                    
                  </section>
                </section>
              </section>
            </article>
          </>
        ) : (
          <p>No existe el evento</p> // NO ANDA POR EL MOMENTO
        )}
      </main>
      <Footer />
    </>
  );
};