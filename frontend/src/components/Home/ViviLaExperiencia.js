import '../styles/viviLaExperiencia.css'

export const ViviLaExperiencia = () => {
 return(
    <section className="viviLaExperiencia">
        <h2 className="titulo"> Vivi la experiencia </h2>
        <div className='experiencias'>
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
        </div>
    </section>
 );   
}