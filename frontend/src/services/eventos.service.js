import axios from "axios";

/* PETICIONES A LOS EVENTOS */

const apiServerUrl = "http://127.0.0.1:8000"

const eventosAPI = axios.create({
  baseURL: `${apiServerUrl}/eventos`
})

export const getAllEventos = () => eventosAPI.get('/Eventos/');

export const getAllEventosAprobados = () => eventosAPI.get('/eventosAprobados');

export const getEvento = (id) => eventosAPI.get(`/Eventos/${id}`);

export const crearEvento = (evento) => eventosAPI.post('/crearEvento/',evento,{
  headers: {
    'Content-Type': 'multipart/form-data' //Estamos trabajando con imagenes
  }});
export const updateState = (id_event, newState) => eventosAPI.put(`/Evento/${id_event}/update-state/`, { state: newState });

export const getEstadoEvento = (id) => eventosAPI.get(`/EstadoEvento/${id}`);

export const getEventosByProductora = (id_productora) => eventosAPI.get(`/byProductora/${id_productora}`);

//Traer todos los clientes de la BD
/*export const getDataFromAPI = () => {
  return fetch("http://localhost:8000/usuarios/clientes/all/")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

export const getAdminResource = async (accessToken) => {
  const config = {
    url: `${apiServerUrl}/api/private-scoped`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  //const { data, error } = await callExternalApi({ config });

  /*return {
    data: data || null,
    error,
  };
};*/