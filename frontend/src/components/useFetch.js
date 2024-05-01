import { useEffect, useState } from "react";

//Encargado de realizar GET a una URL, utilizando Fetch
export function useFetch(url){
    const [data,setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [controller, setController] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    setController(abortController);
    setLoading(true);

    //Peticion GET a una URL
    fetch (url, {signal: abortController.signal})
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => {
        if(error.name === "AbortError"){
            console.log("Solicitud cancelada (abort controller)")
        } else {
            setError(error)
        }
      }) //Catch de errores
      .finally(() => setLoading(false)); //Cuando se terminan todas las problemas se ejecuta

      
    return () => abortController.abort(); //Se realiza el aborto para evitar peticiones imnecesarias
  }, []);

  const handleCancelRequest = () => {
    if (controller){
        abortController.abort();
    }
    
  }

  return {data, loading, error};
}