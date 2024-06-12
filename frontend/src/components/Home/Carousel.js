import React, { useEffect, useState } from "react";
import LazyLoad from "react-lazy-load";
import { Link } from "react-router-dom";
import "./styles/carousel.css";

//Carrousel para mostrar 3 eventos
const Carousel = ({ eventos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);

  //Cada vez que se renderize la pagina, cargaremos los eventos (por ahora, trae 3)
  useEffect(() => {
    async function cargarEventosCarrousel() {
      if (eventos && eventos.length > 0) {
        const nuevasImagenes = eventos?.slice(4, 7).map((evento) => ({
          imagen: evento.imagen,
          id: evento.id_Evento,
        }));

        setImages((prevImages) => [...prevImages, ...nuevasImagenes]);
      }
    }
    cargarEventosCarrousel();
  }, [eventos]);

  //Movimiento con flechas de izq a derecha
  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, images.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  if (images.length > 0) {
    return (
      <div className="carousel">
        <LazyLoad>
          <Link className="slide" to={`/evento/${images[currentIndex].id}`}>
            <img
              src={images[currentIndex].imagen}
              alt="carousel image"
              aria-label="carousel image"
              aria-hidden={currentIndex !== 0}
            />
          </Link>
        </LazyLoad>
        <button
          className="arrow left"
          onClick={handlePrev}
          aria-label="previous image"
          aria-hidden={currentIndex === 0}
        >
          {"<"}
        </button>
        <button
          className="arrow right"
          onClick={handleNext}
          aria-label="next image"
          aria-hidden={currentIndex === images.length - 1}
        >
          {">"}
        </button>
      </div>
    );
  }
};

export default Carousel;
