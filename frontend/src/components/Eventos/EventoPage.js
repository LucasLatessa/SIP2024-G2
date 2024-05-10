import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useParams } from "react-router";
import {
  FetchGET,
  getAllEventos,
  getEvento,
} from "../../services/eventos.service";
import "../styles/EventoPage.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

//Pagina donde se mostrara datos del evento y la posibilidad de comprar entradas
export const EventoPage = () => {
  const { id } = useParams(); //Obtengo el id del evento
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [eventos, setEventos] = useState([]);
  const [tickets, setTickets] = useState([]);

  //Realizo la peticion para obtener el evento
  useEffect(() => {
    async function cargarEventos() {
      const resEvento = await getEvento(id); //Solo eventos validos, si no existe hay que arreglarlo
      setEventos(resEvento.data);
    }
    cargarEventos();
  }, []);

  /*Compra de tickets*/
  const onSubmit = handleSubmit(async (data) => {
    //const res = await comprarTicket(data);
  });

  return (
    <>
      <Header />
      <main className="App eventoPage">
        {eventos ? ( // Si existe el evento muestro los datos
          <>
            <header className="headerEvento">
              <img
                className="imagen"
                src={eventos.imagen}
                alt={"Imagen " + eventos.nombre}
              />
            </header>
            <article className="informacionEvento">
              <section className="titulo-fecha">
                <h1 className="titulo">{eventos.nombre}</h1>
                <p className="fecha">
                  Fecha del evento: {eventos.fecha} - {eventos.hora}
                </p>
              </section>

              <section className="comprarEntrada">
                <h3>Compra tu entrada</h3>
                <form className="formComprarEntrada">
                  {/* COMPRAR ENTRADA FORM */}
                  <label htmlFor=""> Tipo de entrada
                    <select
                      {...register("tipoEntrada", {
                        required: true,
                      })}
                    >
                      <option value="STANDARD">STANDARD</option>
                      <option value="PLATINIUM">PLATINIUM</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </label>

                  <label>
                    Cantidad Entrada
                    <input
                      type="number"
                      {...register("cantidadEntradas", {
                        required: true,
                      })}
                    />
                  </label>
                  <div className="comprarTicketSubmit">
                    <input type="submit" value="Comprar" />
                  </div>
                  
                </form>
              </section>
              <section className="acercaDelEvento">
                <h3>Acerca del evento</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
                  totam ut ipsum obcaecati neque voluptate labore nesciunt
                  eligendi ab mollitia. Ipsa, culpa voluptatibus? Repudiandae
                  minus corporis, ab ipsam eum est?
                </p>
              </section>
              <section className="comoLLegar">
                <h3>Como llegar</h3>
                {/* Mapita de Google Maps*/}
              </section>
            </article>
          </>
        ) : (
          <p>No existe el evento</p> // NO ANDA POR EL MOMENTO
        )}
        <section className="comprarEntradas">
          <form>{/* En proceso */}</form>
        </section>
      </main>
      <Footer />
    </>
  );
};
