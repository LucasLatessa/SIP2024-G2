import "./styles/eventosBox.css";

export const EventosBox = ({nombre, foto, precioMin, precioMax, fecha}) => {
    return(
        <article className="evento">
            <h2>{nombre}</h2>
            <img src={foto} alt="Imagen del evento" />
            <p className="precio"> ${precioMin} a ${precioMax}</p>
            <p className="fecha">{fecha}</p>
            <a href="">Comprar</a>
        </article>
    );
}