import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getUser, getUserNick } from "../../services/usuarios.service";
import { getTicket } from "../../services/tickets.service";
import { getEvento } from "../../services/eventos.service";
import {
  crearPreferenciaEvento,
  getPublicacion,
} from "../../services/publicacion.service";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import "./MercadoDetail.css";
import { formatDateEventDetail } from "../../utils/formatDateEventDetail";

const MercadoDetail = () => {
  const { id } = useParams();
  const [publicacion, setPublicacion] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const { user, getAccessTokenSilently } = useAuth0();
  const [userNoAuth0, setUserNoAuth0] = useState(null);
  const [token, setToken] = useState();
  const [userVendedor, setUserVendedor] = useState(null);
  

  useEffect(() => {
    async function cargarPublicacion() {
      try {
        const res = await getPublicacion(id);
        const publicacionConInfoCompleta = res.data;
        const ticketRes = await getTicket(publicacionConInfoCompleta.ticket);
        setTicketId(ticketRes);
        console.log(ticketRes);
        const vendedorRes = await getUser(ticketRes.data.propietario);
        setUserVendedor(vendedorRes); // Aquí se establece el userVendedor
        const eventoRes = await getEvento(ticketRes.data.evento);
        const { fecha: fechaFormat, hora: horaFormat } =
        formatDateEventDetail(eventoRes.data.fecha, eventoRes.data.hora);
        
        const publicacionCompleta = {
          id: publicacionConInfoCompleta.id_Publicacion,
          precio: publicacionConInfoCompleta.precio,
          foto: eventoRes.data.imagen,
          fecha: publicacionConInfoCompleta.fecha,
          vendedorNombre: vendedorRes.data.nickname,
          eventoNombre: eventoRes.data.nombre,
          eventoFecha: fechaFormat,
          eventoHora: horaFormat, 
        };
        setPublicacion(publicacionCompleta);
      } catch (error) {
        console.error("Error al cargar la publicación:", error);
      }
    }

    async function obtenerToken() {
      const token = await getAccessTokenSilently();
      setToken(token);
    }

    cargarPublicacion();
    obtenerToken();
  }, [id, getAccessTokenSilently]);

  useEffect(() => {
    async function getUsuario() {
      if (userVendedor) {
        try {
          const res = await getUserNick(userVendedor.data.nickname);
          setUserNoAuth0(res);
        } catch (error) {
          console.error("Error al obtener el usuario:", error);
        }
      }
    }

    getUsuario();
  }, [userVendedor]);

  const handleBuy = async () => {
    setButtonClicked(true);
    setLoading(true);
    console.log(userNoAuth0);
    if (userNoAuth0.data.usuario.public_key !== null) {
      console.log(user.nickname);
      initMercadoPago(userNoAuth0.data.usuario.public_key, {
        locale: "es-AR",
      });
      const ticket_publi_id = [ticketId.data.id_Ticket, publicacion.id];
      const res_id = await crearPreferenciaEvento(
        ticket_publi_id,
        publicacion.precio,
        user.nickname,
        publicacion.vendedorNombre
      );
      if (res_id.data.id) {
        setPreferenceId(res_id.data.id);
        console.log(res_id.data.id);
      }
    } else {
      console.log("no tiene cuenta de mp el vendedor");
    }

    setLoading(false);
  };

  return (
    <main>
      {publicacion ? (
        <>
          <section className="informacionEvento">
            <h2 className="titulo">{publicacion.eventoNombre}</h2>
            <figure className="figuraEvento">
              <img
                className="imagen"
                src={publicacion.foto}
                alt={"Imagen " + publicacion.eventoNombre}
              />
              <figcaption className="fechas">
                {" "}
                Fecha del evento: {publicacion.eventoFecha} -{" "}
                {publicacion.eventoHora}{" "}
              </figcaption>
              <p>Precio: ${publicacion.precio}</p>
              <p>Publicada por: <span>{publicacion.vendedorNombre}</span></p>
            </figure>
          </section>
        <section className="comprarEntradas">
          {!buttonClicked && (
            <button onClick={handleBuy}>Comprar</button>
          )}
          {buttonClicked &&
            (loading ? (
              <div>Cargando...</div>
            ) : preferenceId ? (
              <div>
                <Wallet initialization={{ preferenceId: preferenceId }} />
              </div>
            ) : (
              <div>
                No se pudo cargar la billetera porque el ID de preferencia es nulo
              </div>
            ))}
        </section>
      </>
      ) : (
        <p className="notExist">No existe el ticket</p>
      )}
    </main>
  );
};

export default MercadoDetail;
