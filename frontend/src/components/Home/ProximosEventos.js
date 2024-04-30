import { Link } from "react-router-dom";
import "../styles/proximosEventos.css";
import "../EventosBox";
import { EventosBox } from "../EventosBox";

export const ProximosEventos = () => {
    return(
        <section>
            <header className="proximosEventos">
                <h2>Proximos eventos</h2>
                <Link className="allEventos" to="/eventos"> Todos los eventos </Link>
            </header>
            <div className="listaEventos">
                <EventosBox nombre={"Tan Bionica"} foto={"./assets/TanBionica.jpg"} precioMin={"500"} precioMax={"700"}fecha={"20/02/2002"}/>
                <EventosBox nombre={"Tan Bionica"} foto={"./assets/TanBionica.jpg"} precioMin={"500"} precioMax={"700"}fecha={"20/02/2002"}/>
                <EventosBox nombre={"Tan Bionica"} foto={"./assets/TanBionica.jpg"} precioMin={"500"} precioMax={"700"}fecha={"20/02/2002"}/>
            </div>
            
        </section>    
    );
}