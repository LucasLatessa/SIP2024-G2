import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useLocation } from "react-router-dom";
import { useForm,useWatch  } from "react-hook-form";
import { useState, useEffect } from "react";
import "../Eventos/styles/EventoPage.css";
import { crearPublicacion } from '../../services/publicacion.service';
import { useNavigate } from "react-router-dom";

export const PublicarTicket = () => {
  const location = useLocation();
  const { ticket } = location.state || {}; // Obtener el ticket del estado del router
  const { register, handleSubmit, watch, control } = useForm();
  const [costos, setCostos] = useState(null);
  const navigate = useNavigate();
  
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
  }, [precio]);

  const calcularCostos = (precio) => {
    const costo = precio * 0.15; // costo fijo del 15%
    const ganancia = precio - costo;
    setCostos({ precio, costo, ganancia });
  };
  const handlePublicar= () => {
    const publicacion= {
      ticket: ticket.id_ticket,
      precio: costos.precio
  }
    crearPublicacion(publicacion);
    navigate("/mercado");
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

              <section className="publicarEntrada">
                <h3>Vende tu entrada</h3>
                <section className="formPublicarEntrada">
                  <form>
                    <p>Tipo de ticket: {ticket.tipo_ticket}</p>
                    <label>
                      Precio para publicar:
                      <input
                        type="number"
                        {...register("precio", { required: true })}
                        className="no-spin"
                      />
                    </label>
                  </form>
                  {costos && (
                    <section className="costos">
                      <p>Precio: ${costos.precio}</p>
                      <p>Costo de servicio: ${costos.costo}</p>
                      <p>Ganancia: ${costos.ganancia}</p>
                      <section className="publicarTicketButton">
                        <button onClick={handlePublicar}>Publicar</button>
                      </section>
                    </section>
                  )}
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