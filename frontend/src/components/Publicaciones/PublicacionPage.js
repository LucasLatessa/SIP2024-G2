import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useParams } from "react-router";
import "../styles/EventoPage.css"
import { useEffect, useState } from "react";
import { getPublicacion } from "../../services/publicacion.service";
export const PublicacionPage = () => {
  const { id } = useParams(); //Obtengo el id del evento
  const [publicaciones, setPublicaciones] = useState([]);

  //Realizo la peticion
  useEffect(() => {
    async function cargarPublicaciones(){
      const res = await getPublicacion(id);
      setPublicaciones(res.data);
    }
    cargarPublicaciones();
  }, [])

  return (
    <>
      <Header />
      <main className="App">
        {publicaciones ? (
        <section className="informacionEvento">
              <h2 className="titulo">{publicaciones.nombre}</h2>
              <figure className="figuraEvento">
                <img className="imagen" src={publicaciones.imagen} alt={"Imagen " + publicaciones.nombre}/>
                <figcaption className="descripcion"> Lorem </figcaption>
                <figcaption className="fechas"> Fecha del evento:  {publicaciones.fecha} - {publicaciones.hora} </figcaption>
              </figure>
        </section>
        ) : (
          <p>No existe el evento</p>
        )}
        <section className="comprarEntradas">
          <form>
            
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
