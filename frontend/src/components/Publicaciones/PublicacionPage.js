import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useParams } from "react-router";
import "../Eventos/styles/EventoPage.css";
import { useEffect, useState } from "react";
import { getPublicacion,crearPreferenciaEvento } from "../../services/publicacion.service";
import { getEvento } from "../../services/eventos.service";
import { getTicket } from "../../services/tickets.service";
import { getTipoTicket } from "../../services/tickets.service";
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
  const { user,isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const [userNoAuth0,setUserNoAuth0 ] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const [token, setToken] = useState();
  const [userVendedor, setUserVendedor] = useState(null)


  useEffect(() => {
    async function cargarPublicacion() {
      try {
        const res = await getPublicacion(id);
        const publicacionConInfoCompleta = res.data;
        const ticketRes = await getTicket(publicacionConInfoCompleta.ticket);
        const tipoTicket= await getTipoTicket(ticketRes.data.tipo_ticket);
        setTicketId(ticketRes);
        const vendedorRes = await getUser(ticketRes.data.propietario);
        setUserVendedor(vendedorRes); // Aquí se establece el userVendedor
        const eventoRes = await getEvento(ticketRes.data.evento);
        const publicacionCompleta = {
          id: publicacionConInfoCompleta.id_Publicacion,
          precio: publicacionConInfoCompleta.precio,
          tipo: tipoTicket.data.tipo,
          fecha: publicacionConInfoCompleta.fecha,
          foto: eventoRes.data.imagen,
          vendedorNombre: vendedorRes.data.nickname,
          eventoNombre: eventoRes.data.nombre,
          eventoDesc: eventoRes.data.descripcion,
          eventoFecha: eventoRes.data.fecha,
          eventoHora: eventoRes.data.hora,
        };
        setPublicacion(publicacionCompleta);
      } catch (error) {
        console.error("Error al cargar la publicación:", error);
      }
    }
    cargarPublicacion();
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
    if (userNoAuth0.data.usuario.public_key !== null){
      initMercadoPago(userNoAuth0.data.usuario.public_key, {
        locale: "es-AR",
      });
      const ticket_publi_id = [ticketId.data.id_Ticket, publicacion.id];
      const res_id = await crearPreferenciaEvento(ticket_publi_id,publicacion.precio, user.nickname, publicacion.vendedorNombre);
      if (res_id.data.id) {
        setPreferenceId(res_id.data.id);
      }
      
    }
    else{
      console.error("no tiene cuenta de mp el vendedor");
    }
    
    setLoading(false);
  }


  return (
    <>
      <Header />
      <main className="App eventoPage">
        {publicacion ? ( // Si existe el evento muestro los datos
          <>
            <header className="headerEvento">
              <img
                className="imagen"
                src={publicacion.foto}
                alt={"Imagen " + publicacion.eventoNombre}
              />
            </header>
            <article className="informacionEvento">
              <section className="titulo-fecha">
                <h1 className="titulo">{publicacion.eventoNombre}</h1>
                <p className="fecha">
                  Fecha del evento: {publicacion.eventoFecha} - {publicacion.eventoHora}
                </p>
              </section>
  
              <section className="comprarEntrada">
                <h3>Compra tu entrada de reventa</h3>
                <section className="formComprarEntrada">
                  {/* COMPRAR ENTRADA FORM */}
                  <label>
                    Tipo de entrada: {publicacion.tipo }
                    
                  </label>
  
                  
                  
                  {publicacion.precio && (
                    <label>Precio de la entrada: ${publicacion.precio}</label>
                  )}
                   <label>Publicada por: {publicacion.vendedorNombre}</label>
                  <section className="comprarTicketsButton">
                      {isAuthenticated &&(!buttonClicked || !preferenceId )? (
                        <button className="comprarEntrada" onClick={handleBuy}>
                          Comprar
                        </button>
                      ) : null}
                      {!isAuthenticated && (
                        <div className="login-message">
                          <p>
                            Para comprar entradas, por favor <a href="" onClick={loginWithRedirect}>inicia sesión</a>.
                          </p>
                        </div>
                      )}
                    
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
                </section>
              </section>
              <section className="acercaDelEvento">
                <h3>Acerca del evento</h3>
                <p>{publicacion.eventoDesc}</p>
              </section>
              <section className="comoLLegar">
                <h3>Como llegar</h3>
                {/* Mapita de Google Maps*/}
              </section>
            </article>
          </>
        ) : (
          <p className="parrafo">Cargando...</p>
        )}
      </main>
      <Footer />
    </>
  );
};
