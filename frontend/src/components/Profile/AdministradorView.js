import React, { useState, useEffect } from 'react';
import "./styles/productoraView.css";
import { UserList } from "./UserList";
import { EventsList } from "./EventsList";
import { ProductorasList } from "./ProductorasList";
import Restore from './Restore';
import { crearBackup } from "../../services/backup.service";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react"

export const AdministradorView = ({ rol }) => {
    const [showRestore, setShowRestore] = useState(false);
    const [token, setToken] = useState(null);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const accessToken = await getAccessTokenSilently({
                    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                });
                setToken(accessToken);
            } catch (error) {
                console.error("Error obteniendo token:", error);
                toast.error("Error al obtener token de autenticacion");
            }
        };

        fetchToken();
    }, [getAccessTokenSilently]);

    const handleBackup = async () => {
        try {
            const response = await crearBackup();
            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/sql' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;

                const now = new Date();
                const dateStr = now.toISOString().replace(/[:.]/g, "-");
                link.setAttribute('download', `backup_${dateStr}.sql`);

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.success('Backup descargado con exito');
            } else {
                toast.error('Error al realizar el backup');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al conectar con el servidor');
        }
    };

    const handleRestore = () => {
        setShowRestore(true);
    };

    if (rol === "ADMINISTRADOR") {
        return (
            <>
                <ToastContainer />
                {/* Pasamos el token como prop */}
                <UserList token={token} />
                <EventsList />
                <ProductorasList token={token} />

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

    return null;
};
