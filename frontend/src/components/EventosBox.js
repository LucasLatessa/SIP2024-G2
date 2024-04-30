import "./styles/eventosBox.css";

export const EventosBox = ({nombre, foto, precio, fecha}) => {
    return(
        <article className="evento">
            <h2>{nombre}</h2>
            <p>{precio}</p>
            <p>{fecha}</p>
        </article>
    );
}