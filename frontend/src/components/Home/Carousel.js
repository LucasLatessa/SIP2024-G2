  import React, { useState } from 'react';
  import LazyLoad from 'react-lazy-load';
  import { Link } from "react-router-dom";
  import "../styles/carousel.css";
  const images = [
    '/assets/TanBionica.jpg',
    '/assets/PatoSosa.png',
    '/assets/TanBionica.jpg'
  ];
  
  const Carousel = ({eventos}) => {
/* 
    const [currentIndex, setCurrentIndex] = useState(0);
    //const [images, setImages] = useState([]);
    let images= [];
    eventos?.slice(4, 7).map((eventos) => { //Traigo solo los primeros 3
      //setImages([...images, { imagen: eventos.imagen, id: eventos.id_Evento }]);
      images.push({ imagen: eventos.imagen, id: eventos.id_Evento });
      
    })
    console.log(images[0]);
    const handleNext = () => {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, images.length - 1));
    };
  
    const handlePrev = () => {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };
  
    return (
      <div className="carousel">
      <LazyLoad>
      {images[currentIndex] && (
        <Link to={`/evento/${images[currentIndex].id}`}>
          <img
            src={images[currentIndex].imagen}
            alt="carousel image"
            aria-label="carousel image"
            aria-hidden={currentIndex !== 0}
          />
        </Link>
      )}
      </LazyLoad>
      <button
        onClick={handlePrev}
        aria-label="previous image"
        aria-hidden={currentIndex === 0}
      >
        Prev
      </button>
      <button
        onClick={handleNext}
        aria-label="next image"
        aria-hidden={currentIndex === images.length - 1}
      >
        Next
      </button>
    </div>
    ); */
  };
  
  export default Carousel;