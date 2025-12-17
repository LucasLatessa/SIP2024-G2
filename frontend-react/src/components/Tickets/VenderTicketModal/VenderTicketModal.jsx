import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserNick } from "../../../services/usuarios.service";
import { crearPublicacion } from "../../../services/publicacion.service";
import "./VTM.css";

export const VenderTicketModal = ({ ticket, onClose }) => {
  const { register, control } = useForm();
  const { user } = useAuth0();

  const [costos, setCostos] = useState(null);
  const [usuarioData, setUsuarioData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // observar precio
  const precio = useWatch({
    control,
    name: "precio",
    defaultValue: "",
  });

  // traer usuario y calcular costos
  useEffect(() => {
    if (precio) {
      const costo = precio * 0.15;
      const ganancia = precio - costo;
      setCostos({ precio, costo, ganancia });
    } else {
      setCostos(null);
    }
  }, [precio]);

  useEffect(() => {
    const fetchUsuario = async () => {
      const res = await getUserNick(user.nickname);
      setUsuarioData(res.data.usuario);
    };

    fetchUsuario();
  }, [user.nickname]);

  const handlePublicar = async () => {
    if (!usuarioData?.public_key) {
      setError("No tenés una cuenta de Mercado Pago vinculada");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const publicacion = {
        ticket: ticket.id_ticket,
        precio: costos.precio,
      };

      await crearPublicacion(publicacion);
      onClose();
    } catch (err) {
      setError("No se puede volver a publicar el mismo ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="publicarEntrada modal-content">
      <h3>Vendé tu entrada</h3>

      <div className="dataEventoPublicarEntrada">
        <p>{ticket.nombre}</p>
        <p>
          Tipo de ticket: <span>{ticket.tipo_ticket}</span>
        </p>
        <p>
          Fecha:{" "}
          <span>
            {ticket.fecha} - {ticket.hora}
          </span>
        </p>
      </div>

      <form className="formPublicarEntrada">
        <label>
          Precio para publicar
          <input
            type="number"
            {...register("precio", { required: true })}
            className="no-spin"
          />
        </label>
      </form>

      {costos && (
        <section className="costosPublicarEntrada">
          <p>Precio: ${costos.precio}</p>
          <p>Costo de servicio: ${costos.costo}</p>
          <p>Ganancia: ${costos.ganancia}</p>

          {error && <p className="error-message">{error}</p>}

          <div className="buttonsPublicarEntrada">
            <button
              onClick={handlePublicar}
              disabled={loading}
              className="confirmar"
            >
              {loading ? "Publicando..." : "Publicar"}
            </button>
            <button className="cancelar" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </section>
      )}
    </section>
  );
};
