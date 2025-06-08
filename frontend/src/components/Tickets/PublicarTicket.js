import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useLocation } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { useState, useEffect } from "react";
import "../Eventos/styles/EventoPage.css";
import { crearPublicacion } from '../../services/publicacion.service';
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserNick } from '../../services/usuarios.service';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Publicacion de tickets dentro del sitio
export const PublicarTicket = () => {
  const location = useLocation();
  const { ticket } = location.state || {}; // Obtener el ticket del estado del router
  const { register, control } = useForm();
  const [costos, setCostos] = useState(null);
  const navigate = useNavigate();
  const { user, getAccessTokenSilently } = useAuth0();
  const [userNoAuth0, setUserNoAuth0] = useState(null);
  const [token, setToken] = useState();
  
 // Observar el campo de precio
 const precio = useWatch({
    control,
    name: "precio",
    defaultValue: "",
  });


  // Calcular costos cada vez que el precio cambie
  useEffect(() => {
    if (precio) {
      calcularCostos(Number(precio));
    }
    async function obtenerToken() {
      const token = await getAccessTokenSilently();
      setToken(token);
    }
    async function getUsuario() {
      const res = await getUserNick(user.nickname);
      setUserNoAuth0(res);      
    }
    obtenerToken();
    getUsuario();

  }, [precio,getAccessTokenSilently]);

  const calcularCostos = (precio) => {
    const costo = precio * 0.15; // costo fijo del 15%
    const ganancia = precio - costo;
    setCostos({ precio, costo, ganancia });
  };
  const handlePublicar= async () => {    
    const publicacion= {
      ticket: ticket.id_ticket,
      precio: costos.precio
  }
   if (userNoAuth0.data.usuario.Public_Key !== null){
    try {
      await crearPublicacion(publicacion);
      navigate("/mercado");
     } catch (error) {
      toast.error('No se puede volver a publicar el mismo ticket')
       console.error("Error al crear publicacion:", error);
     }
   }
  else{
    toast.error('No tiene una cuenta de mercado pago')
  }
 
  }

  return (
    <>
      <Header />
      <main className="App eventoPage">
        {ticket ? (
          <div className="publicacion-container">
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

              <section className="comprarEntrada">
                <h3>Vende tu entrada</h3>
                <form className="formComprarEntrada" onSubmit={e => e.preventDefault()}>
                  <p>Tipo de ticket: {ticket.tipo_ticket}</p>
                  <label>
                    Precio para publicar:
                    <input
                      type="number"
                      {...register("precio", { required: true })}
                      className="no-spin"
                    />
                  </label>
                  {costos && (
                    <section className="costos">
                      <p>Precio: ${costos.precio}</p>
                      <p>Costo de servicio: ${costos.costo}</p>
                      <p>Ganancia: ${costos.ganancia}</p>
                      <div className="comprarTicketsButton">
                        <button type="button" className="comprarEntradaBtn" onClick={handlePublicar}>
                          Publicar
                        </button>
                      </div>
                    </section>
                  )}
                </form>
              </section>
            </article>
          </div>
        ) : (
          <p>No existe el evento</p>
        )}
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};