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
            <div className="listaEventos">
                <EventosBox nombre={"test"} precio={"test"} fecha={"test"}/>
                <EventosBox nombre={"test"} precio={"test"} fecha={"test"}/>
                <EventosBox nombre={"test"} precio={"test"} fecha={"test"}/>
            </div>
            
        </section>    
    );
}