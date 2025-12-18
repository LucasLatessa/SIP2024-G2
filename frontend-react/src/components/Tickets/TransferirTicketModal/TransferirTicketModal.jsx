import { useState } from "react";
import { useForm } from "react-hook-form";
import { transferir } from "../../../services/tickets.service";
import { getUserNick } from "../../../services/usuarios.service";
import "./TTM.css";
import toast from "react-hot-toast";

export const TransferirTicketModal = ({ ticket, onClose, onSuccess}) => {
  const { register, handleSubmit, reset } = useForm();
  const [usuarioData, setUsuarioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Paso 1: buscar usuario
  const handleTransferir = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getUserNick(data.nickname);
      setUsuarioData(response.data.usuario);
    } catch (err) {
      setError("Usuario no encontrado");
      setUsuarioData(null);
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: confirmar transferencia
  const handleConfirmarTransferencia = async () => {
    try {
      await toast.promise(
        transferir(ticket.id_ticket, usuarioData.nickname, ticket.tipo_ticket),
        {
          loading: "Procesando transferencia...",
          success: "¡Ticket transferido con éxito!",
          error: "Error: No se pudo realizar la transferencia.",
        }
      );
      
      if (onSuccess) {
          onSuccess(); 
      }

      onClose();

    } catch (error) {
      console.error("Falló la transferencia:", error);
    }
  };

  const handleCancelar = () => {
    reset();
    setUsuarioData(null);
    setError(null);
    onClose();
  };

  return (
    <section className="transferirEntrada modal-content">
      <h3>Transferí tu entrada</h3>

      <div className="dataEventoTransferirEntrada">
        <p>{ticket.nombre}</p>
        <p>
          Tipo de ticket: <span> {ticket.tipo_ticket} </span>
        </p>
        <p>
          Fecha:{" "}
          <span>
            {ticket.fecha} - {ticket.hora}
          </span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleTransferir)}
        className="formTransferirEntrada"
      >
        <label>
          Nickname del destinatario
          <input
            type="text"
            {...register("nickname", { required: true })}
            className="no-spin"
          />
        </label>

        <div className="searchTransferirEntrada">
          <button type="submit" disabled={loading}>
            {loading ? "Buscando..." : "Buscar usuario"}
          </button>
        </div>
      </form>

      {error && <p className="error-message">{error}</p>}

      {usuarioData && (
        <section className="usuarioDataTransferirEntrada">
          <h4>Confirmar transferencia</h4>
          <p>Nombre: {usuarioData.nombre}</p>
          <p>Apellido: {usuarioData.apellido}</p>
          <p>Nickname: {usuarioData.nickname}</p>
          <p>Correo: {usuarioData.correo}</p>

          <div className="buttonsTransferrirEntrada">
            <button
              onClick={handleConfirmarTransferencia}
              className="confirmar"
            >
              Confirmar
            </button>
            <button className="cancelar" onClick={handleCancelar}>
              Cancelar
            </button>
          </div>
        </section>
      )}
    </section>
  );
};
