import React, { useState } from 'react';
import { restore } from "../../services/backup.service";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Restore = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleRestore = async () => {
        if (!file) {
            alert('Por favor, selecciona un archivo SQL.');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('backup_file', file);

        try {
            const response = await restore(formData);
            if (response.data.restore === 'realizado') {
                toast.success('Restauración realizada con éxito');
                onClose();
            } else {
                toast.error('Error en la restauración');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="restore-overlay">
            <div className="restore-content">
                <h2>Restaurar Base de Datos</h2>
                <input
                    type="file"
                    accept=".sql"
                    onChange={handleFileChange}
                />
                <button
                    onClick={handleRestore}
                    disabled={loading}
                >
                    {loading ? 'Restaurando...' : 'Restaurar'}
                </button>
                <button onClick={onClose} disabled={loading}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default Restore;