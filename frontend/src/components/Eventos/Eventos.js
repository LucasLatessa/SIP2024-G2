import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { EventosBox } from "../EventosBox";
import "../styles/Eventos.css";

export const Eventos = () => {
  return (
    <>
      <Header />
      <main>
        <header className="tituloEventos">
          <h1>Eventos</h1>
        </header>
        <section className="allListaEventosa">
          <EventosBox
            nombre={"Tan Bionica"}
            foto={"./assets/TanBionica.jpg"}
            precioMin={"500"}
            precioMax={"700"}
            fecha={"20/02/2002"}
          />
          <EventosBox
            nombre={"Tan Bionica"}
            foto={"./assets/TanBionica.jpg"}
            precioMin={"500"}
            precioMax={"700"}
            fecha={"20/02/2002"}
          />
          <EventosBox
            nombre={"Tan Bionica"}
            foto={"./assets/TanBionica.jpg"}
            precioMin={"500"}
            precioMax={"700"}
            fecha={"20/02/2002"}
          />
          <EventosBox
            nombre={"Tan Bionica"}
            foto={"./assets/TanBionica.jpg"}
            precioMin={"500"}
            precioMax={"700"}
            fecha={"20/02/2002"}
          />
          <EventosBox
            nombre={"Tan Bionica"}
            foto={"./assets/TanBionica.jpg"}
            precioMin={"500"}
            precioMax={"700"}
            fecha={"20/02/2002"}
          />
          <EventosBox
            nombre={"Tan Bionica"}
            foto={"./assets/TanBionica.jpg"}
            precioMin={"500"}
            precioMax={"700"}
            fecha={"20/02/2002"}
          />
        </section>
      </main>

      <Footer />
    </>
  );
};
