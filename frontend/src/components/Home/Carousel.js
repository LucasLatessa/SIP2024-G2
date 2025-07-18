import React, { useEffect, useState, useRef } from "react";
import LazyLoad from "react-lazy-load";
import { Link } from "react-router-dom";
import "./styles/carousel.css";

const Carousel = ({ eventos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    if (eventos?.length > 0) {
      const nuevasImagenes = eventos.map((evento) => ({
        imagen: evento.imagen,
        id: evento.id_Evento,
      }));
      setImages(nuevasImagenes);
      setCurrentIndex(0);
    }
  }, [eventos]);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      (prev - 1 + images.length) % images.length
    );
  };

  const goToSlide = (index) => setCurrentIndex(index);

  // Swipe events
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const delta = touchStartX.current - touchEndX.current;
    const threshold = 50; // px mínimo para detectar swipe
    if (delta > threshold) handleNext();
    else if (delta < -threshold) handlePrev();
  };

  if (images.length === 0) return null;

  return (
    <div
      className="carousel"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button className="arrow left" onClick={handlePrev}>
        &#10094;
      </button>

      <div className="slides-wrapper">
        {images.map((img, index) => (
          <div
            key={img.id}
            className={`slide ${index === currentIndex ? "active" : ""}`}
            aria-hidden={index !== currentIndex}
          >
            <LazyLoad offset={100} threshold={0.95}>
              <Link to={`/evento/${img.id}`}>
                <img src={img.imagen} alt={`Evento ${img.id}`} />
              </Link>
            </LazyLoad>
          </div>
        ))}
      </div>

      <button className="arrow right" onClick={handleNext}>
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
