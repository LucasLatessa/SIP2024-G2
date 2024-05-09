import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';
import { useState } from 'react';

export const Mercadopago = () => {
    const [preferenceId, setPreferenceId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    
    initMercadoPago("TEST-ad9af574-3705-4b15-b991-f28af2497f9f", { locale: "es-AR" });

    const obtenerTicket = async () => {
        try {
            const response = await axios.get("http://localhost:8000/tickets/obtener_ticket_evento/1/");
            return response.data.ticket_id;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const createPreference = async (ticket_id) => {
        try {
            const response = await axios.post("http://localhost:8000/tickets/prueba_mercadopago/", {
                quantity: 1,
                ticket_id: ticket_id,
                unit_price: 1,
            });
            return response.data.id;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const handleBuy = async () => {
        setButtonClicked(true);
        setLoading(true); // Indicar que la carga ha comenzado
        const ticket_id = await obtenerTicket();
        if (ticket_id) {
            const id = await createPreference(ticket_id);
            if (id) {
                setPreferenceId(id);
            }
        }
        setLoading(false); // Indicar que la carga ha terminado
    };

    return (
        <div className='test'>
            <button onClick={handleBuy}>Comprar</button>
            {buttonClicked && (
                loading ? (
                    <div>Cargando...</div>
                ) : (
                    preferenceId ? (
                        <div>
                            <Wallet initialization={{ preferenceId: preferenceId }} />
                        </div>
                    ) : (
                        <div>No se pudo cargar la billetera porque el ID de preferencia es nulo</div>
                    )
                )
            )}
        </div>
    );
};