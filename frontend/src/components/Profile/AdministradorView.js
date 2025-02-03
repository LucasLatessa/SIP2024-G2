import React, { useState } from 'react';
import "./styles/productoraView.css";
import { UserList } from "./UserList";
import { EventsList } from "./EventsList";
import { ProductorasList } from "./ProductorasList";
import Restore from './Restore';
import { crearBackup } from "../../services/backup.service";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

//Vista de productora
export const AdministradorView = ({ rol, id }) => {
  const [showRestore, setShowRestore] = useState(false);
  const handleBackup = async () => {
    try {
        const response = await crearBackup();
        if (response.data.backup === 'realizado') {
             toast.success('Backup realizado con éxito');
        } else {
            toast.error('Error al realizar el backup');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
};

const handleRestore = () => {
    setShowRestore(true); // Mostrar la pantalla de restauración
};
  //Solo si es producotra se muestra este componente
  if (rol === "ADMINISTRADOR") {
    return (
        <> 
        <ToastContainer />
        <UserList />
        <EventsList  />
        <ProductorasList />
        
        <div style={{ margin: '20px' }}>
                <button onClick={handleBackup} style={{ marginRight: '10px' }}>
                    Backup de DB
                </button>
                <button onClick={handleRestore}>
                    Restore de DB 
                </button>
            </div>
            
            {showRestore && (
                <Restore onClose={() => setShowRestore(false)} />
            )}
          
        </>
    );
  }
};
