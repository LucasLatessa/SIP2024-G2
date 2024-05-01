//import { callExternalApi } from "./external-api.service";
import { useEffect, useState } from "react";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

//Traer todos los clientes de la BD
export const getDataFromAPI = () => {
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

//Encargado de realizar GET a una URL, utilizando Fetch
export function FetchGET(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [controller, setController] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    setController(abortController);
    setLoading(true);

    //Peticion GET a una URL
    fetch(url, { signal: abortController.signal })
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("Solicitud cancelada (abort controller)");
        } else {
          setError(error);
        }
      }) //Catch de errores
      .finally(() => setLoading(false)); //Cuando se terminan todas las problemas se ejecuta

    return () => abortController.abort(); //Se realiza el aborto para evitar peticiones imnecesarias
  }, []);

  const handleCancelRequest = () => {
    if (controller) {
      abortController.abort();
    }
  };

  return { data, loading, error };
}

/*
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