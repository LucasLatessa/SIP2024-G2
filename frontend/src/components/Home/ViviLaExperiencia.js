import './styles/viviLaExperiencia.css'

//Apartado de informacion sobre el sitio
export const ViviLaExperiencia = () => {
 return(
    <section className="viviLaExperiencia">
        <h2 className="titulo"> Vivi la experiencia </h2>
        <article className='experiencias'>
            <figure>
                <img src="./assets/Ticket.png"/>
                <figcaption> Compra </figcaption>
            </figure>
            <figure>
                <img src="./assets/Ticket.png"/>
                <figcaption> Vivi </figcaption>
            </figure>
            <figure>
                <img src="./assets/Ticket.png"/>
                <figcaption> Disfruta </figcaption>
            </figure>
        </article>
    </section>
 );   
}