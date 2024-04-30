import { Link } from "react-router-dom";
import "../styles/proximosEventos.css";
import "../EventosBox";
import { EventosBox } from "../EventosBox";

export const ProximosEventos = () => {
    return(
        <section>
            <header className="proximosEventos">
                <h2>Proximos eventos</h2>
                <Link to="/eventos"> Todos los eventos </Link>
            </header>
            <EventosBox nombre={"test"} precio={"test"} fecha={"test"}/>
        </section>    
    );
}