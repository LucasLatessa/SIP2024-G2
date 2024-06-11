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
        <section className="crearBeneficio">
          <h3>Publica un nuevo beneficio</h3>
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
            <section className="buttonCrearBeneficio">
              <button type="submit">Confirmar</button>
            </section>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
