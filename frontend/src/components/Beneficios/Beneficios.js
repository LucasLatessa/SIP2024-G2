import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import "../styles/beneficios.css";
import { getAllBeneficios } from "../../services/beneficios.service";
import { useEffect, useState } from "react";
import { BeneficiosBox } from "./BeneficiosBox";

export const Beneficios = () => {
    const [beneficios, setBeneficios] = useState([]);
    //Realizo la peticion
    useEffect(() => {
        async function cargarBeneficios(){
        const res = await getAllBeneficios();
        setBeneficios(res.data);
        }
        cargarBeneficios();
    }, [])
    
    return(
        <>
        <Header />
        <main>
            <header className="tituloBeneficios">
                <h1>Beneficios</h1>
            </header>

            <section className="allListaBeneficios">
                {beneficios?.map((beneficios) => (
                    <BeneficiosBox
                        id={beneficios.id_beneficio}
                        nombre={beneficios.nombre}
                        foto={beneficios.imagen}
                        descripcion={beneficios.descripcion}
                        porcentajeDescuento={beneficios.porcentajeDescuento}
                        codigoDescuento={beneficios.codigoDescuento}
                        usado={beneficios.usado}
                />)
            )}
            </section>
        </main>
        <Footer />
        </>
    );
};
