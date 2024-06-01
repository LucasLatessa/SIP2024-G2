import './styles/viviLaExperiencia.css'

//Apartado de informacion sobre el sitio
export const ViviLaExperiencia = () => {
 return(
    <section className="viviLaExperiencia">
        <h2 className="titulo"> Vivi la experiencia </h2>
        <article className='experiencias'>
            <figure>
                <img src="./assets/Ticket.png" alt="Ticket image1"/>
                <figcaption> Compra </figcaption>
            </figure>
            <figure>
                <img src="./assets/Ticket.png" alt="Ticket image2"/>
                <figcaption> Vivi </figcaption>
            </figure>
            <figure>
                <img src="./assets/Ticket.png" alt="Ticket image3"/>
                <figcaption> Disfruta </figcaption>
            </figure>
        </article>
    </section>
 );   
}