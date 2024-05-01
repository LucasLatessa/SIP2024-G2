import React, { useEffect, useState } from 'react';
import { getDataFromAPI } from '../services/service';

const PruebaDb = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDataFromAPI()
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      {data ? (
        <div>
          <h2>Data from API:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading...(puede que el backend este fuera de servicio)</p>
      )}
    </div>
  );
};

export { PruebaDb };
