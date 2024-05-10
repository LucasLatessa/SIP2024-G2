import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';
import { useState } from 'react';

export const Mercadopago = () => {
    const [preferenceId, setPreferenceId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    
    initMercadoPago("TEST-ad9af574-3705-4b15-b991-f28af2497f9f", { locale: "es-AR" });
    let evento_id = 1;
    let quantity = 1;
    let unit_price = 1;

    const obtenerTicket = async () => {
        try {
            const response = await axios.get("http://localhost:8000/tickets/obtener_ticket_evento/",{
                params: {
                    evento_id:evento_id,
                    quantity:quantity
                }
            });
            console.log(response.data.ticket_id_list);
            return response.data.ticket_id_list;

        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const createPreference = async (ticket_id_list) => {
        try {
            const response = await axios.post("http://localhost:8000/tickets/prueba_mercadopago/", {
                quantity: quantity,
                ticket_id: ticket_id_list,
                unit_price: unit_price,
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
        const ticket_id_list = await obtenerTicket();
        if (ticket_id_list.length === quantity) {
            const id = await createPreference(ticket_id_list);
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