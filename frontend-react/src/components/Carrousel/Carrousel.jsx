import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { useEffect, useState } from "react";
import { getAllEventosAprobados } from "../../services/eventos.service";

import styles from "./Carrousel.module.css";

export const Carrousel = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    async function cargarEventos() {
      const res = await getAllEventosAprobados();
      //console.log(res.data);
      setEventos(res.data);
    }
    cargarEventos();
  }, []);

  useEffect(() => {
    console.log("Eventos cargados:", eventos);
  }, [eventos]);

  return (
    <section className={styles.hero}>
      <Swiper
        modules={[Autoplay, Navigation]}
        slidesPerView={1}
        loop={true}
        navigation={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        className={styles.heroSwiper}
      >
        {eventos?.slice(0, 3).map((evento) => (
          <SwiperSlide key={evento.id}>
            <div className={styles.heroSlide}>
              <img src={evento.imagen} alt={evento.nombre} />
              <div className={styles.info}>
                <h2>{evento.nombre}</h2>
                <p>{evento.descripcion}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
