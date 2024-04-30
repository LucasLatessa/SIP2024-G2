// service.js

const getDataFromAPI = () => {
    return fetch('http://localhost:8000/usuarios/clientes/all/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
  };
  
  export { getDataFromAPI };