import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useForm } from "react-hook-form";
import { crearBeneficio } from "../../services/beneficios.service";
import { useNavigate } from "react-router";
import "./styles/crearBeneficio.css";

//Encargado de realizar la creacion de beneficios dentro de la pagina
export const CrearBeneficio = () => {
  const navegate = useNavigate();
  const {
    register,
    handleSubmit,
  } = useForm();

  //Realizo la peticion para crear el beneficio
  const onSubmit = handleSubmit(async (data) => {
    data.imagen = data.imagen[0]; //Para guardar la imagen
    await crearBeneficio(data);
    navegate("/beneficios");
  });

  return (
    <>
      <Header />
      <main className="App">
        <header className="tituloBeneficio">
          <h1>Crear Beneficio</h1>
        </header>
        <section className="crearBeneficio">
          
          { /* FORMULARIO DE CREACION DE BENEFICIOS */ }
          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="formularioBeneficio"
          >
            <div className="datosBeneficio">
              <label>
                Nombre
                <input
                  type="text"
                  {...register("nombre", {
                    required: true,
                  })}
                />
              </label>
              <label>
                Descripcion
                <input
                  type="text"
                  {...register("descripcion", {
                    required: true,
                  })}
                />
              </label>
              <label>
                Porcentaje de descuento
                <input
                  type="number"
                  {...register("porcentajeDescuento", {
                    required: false,
                  })}
                />
              </label>
              <label>
                Codigo de descuento
                <input
                  type="number"
                  {...register("codigoDescuento", {
                    required: true,
                  })}
                />
              </label>
              <label>
                Imagen
                <input
                  type="file"
                  {...register("imagen", {
                    required: true,
                  })}
                />
              </label>
            </div>
            <input
              className="buttonCrearBeneficio"
              type="submit"
              value="Enviar"
            />
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
