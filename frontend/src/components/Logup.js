import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Logup = () => {
  const { user, isAuthenticated } = useAuth0();
  const [responseMessage, setResponseMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [dni, setDni] = useState('');
  const navigate = useNavigate();

  const validarCliente = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/usuarios/clientes/${user.nickname}/`);
      // Cliente existe, navegar al perfil
      navigate('/perfil');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Cliente no encontrado, solicitar todos los datos necesarios
        setNickname(user.nickname);
        setNombre(user.given_name || '');
        setApellido(user.family_name || '');
        setCorreo(user.email || '');
        setDni('');
      } else {
        setResponseMessage(`Error al verificar el cliente: ${error.message}`);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nickname && nombre && apellido && correo && dni) {
      crearCliente();
    } else {
      setResponseMessage('Debe completar todos los datos para continuar.');
    }
  };

  const crearCliente = async () => {
    const data = {
      informacion: {
        nickname: nickname,
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        dni: dni
      }
    };

    try {
      const response = await axios.post('http://localhost:8000/usuarios/clientes/create/', data);
      setResponseMessage(`Cliente creado con éxito: ${JSON.stringify(response.data)}`);
      navigate('/perfil');
    } catch (error) {
      setResponseMessage(`Error al crear el cliente: ${error.message}`);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      validarCliente();
    }
  }, [isAuthenticated]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label style={{ color: 'black' }}>
          Nickname:
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            disabled={Boolean(nickname)}
          />
        </label >
        <label style={{ color: 'black' }}>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>
        <label style={{ color: 'black' }}>
          Apellido:
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </label>
        <label style={{ color: 'black' }}>
          Correo:
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </label>
        <label style={{ color: 'black' }}>
          DNI:
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />
        </label>
        <button type="submit">Crear Cliente</button>
      </form>
      <p>{responseMessage}</p>
    </div>
  );
};
