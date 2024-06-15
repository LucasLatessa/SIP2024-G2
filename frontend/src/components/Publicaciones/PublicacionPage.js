import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useParams } from "react-router";
import "../Eventos/styles/EventoPage.css";
import { useEffect, useState } from "react";
import { getPublicacion,crearPreferenciaEvento } from "../../services/publicacion.service";
import { getEvento } from "../../services/eventos.service";
import { getTicket } from "../../services/tickets.service";
import { getUser, getUserNick } from "../../services/usuarios.service";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useAuth0 } from "@auth0/auth0-react";

//Pagina donde se puede ver la publicacion en si
export const PublicacionPage = () => {

  const { id } = useParams(); //Obtengo el id del evento
  const [publicacion, setPublicacion] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const { user,getAccessTokenSilently } = useAuth0();
  const [userNoAuth0,setUserNoAuth0 ] = useState(null);
  const [token, setToken] = useState();
  const [userVendedor, setUserVendedor] = useState(null)


  useEffect(() => {
    async function cargarPublicacion() {
      try {
        const res = await getPublicacion(id);
        const publicacionConInfoCompleta = res.data;
        const ticketRes = await getTicket(publicacionConInfoCompleta.ticket);
        setTicketId(ticketRes);
        const vendedorRes = await getUser(ticketRes.data.propietario);
        setUserVendedor(vendedorRes); // Aquí se establece el userVendedor
        const eventoRes = await getEvento(ticketRes.data.evento);
        const publicacionCompleta = {
          id: publicacionConInfoCompleta.id_Publicacion,
          precio: publicacionConInfoCompleta.precio,
          fecha: publicacionConInfoCompleta.fecha,
          foto: eventoRes.data.imagen,
          vendedorNombre: vendedorRes.data.nickname,
          eventoNombre: eventoRes.data.nombre,
          eventoFecha: eventoRes.data.fecha,
          eventoHora: eventoRes.data.hora,
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
    if (userNoAuth0.data.usuario.public_key !== null){
      console.log(user.nickname)
      initMercadoPago(userNoAuth0.data.usuario.public_key, {
        locale: "es-AR",
      });
      const ticket_publi_id = [ticketId.data.id_Ticket, publicacion.id];
      const res_id = await crearPreferenciaEvento(ticket_publi_id,publicacion.precio, user.nickname, publicacion.vendedorNombre);
      if (res_id.data.id) {
        setPreferenceId(res_id.data.id);
        console.log(res_id.data.id);
      }
      
    }
    else{
      console.log("no tiene cuenta de mp el vendedor");
    }
    
    setLoading(false);
  }


  return (
    <>
      <Header />
      <main className="App">
        {publicacion ? (
          <section className="informacionEvento">
            <h2 className="titulo">{publicacion.eventoNombre}</h2>
            <figure className="figuraEvento">
              <img
                className="imagen"
                src={publicacion.foto}
                alt={"Imagen " + publicacion.eventoNombre}
              />
              <figcaption className="descripcion"> Lorem</figcaption>
              <figcaption className="fechas">
                {" "}
                Fecha del evento: {publicacion.eventoFecha} -{" "}
                {publicacion.eventoHora}{" "}
              </figcaption>
              <p>Precio: ${publicacion.precio}</p>
              <p>Publicada por: {publicacion.vendedorNombre} </p>
            </figure>
          </section>
        ) : (
          <p>No existe el evento</p>
        )}
        <section className="comprarEntradas">
        <button onClick={handleBuy}>Comprar</button>
                    {buttonClicked &&
                      (loading ? (
                        <div>Cargando...</div>
                      ) : preferenceId ? (
                        <div>
                          <Wallet
                            initialization={{ preferenceId: preferenceId }}
                          />
                        </div>
                      ) : (
                        <div>
                          No se pudo cargar la billetera porque el ID de
                          preferencia es nulo
                        </div>
                      ))}
        </section>
      </main>
      <Footer />
    </>
  );
};
