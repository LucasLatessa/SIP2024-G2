import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import axios from 'axios';
import { useState } from "react";



export const Mercadopago = () => {
    const [preferenceId, setPreferenceId] = useState(null);
    const dominioMP = process.env.REACT_APP_TEST_MERCADOPAGO;

    initMercadoPago("TEST-ad9af574-3705-4b15-b991-f28af2497f9f", {locale: "es-AR"});
    
    
    const obtenerTicket = async () => { //datos hardcodeados
        try {
            const evento = "1"
            const response = await axios.get("http://localhost:8000/tickets/obtener_ticket_evento/1/");
            const ticket_id = response.data.ticket_id;
            return ticket_id;

        } catch (error){
            console.log(error);
        }              
    }

    const createPreference = async (ticket_id) => {
        try{
            const response = await axios.post("http://localhost:8000/tickets/prueba_mercadopago/", {
            quantity: 1,
            ticket_id:ticket_id,
            unit_price: 1,
        });
            const { id } = response.data;
            return id;
        }catch(error){
            console.log(error);
        }

    }

    const handleBuy = async () => {
        const ticket_id = await obtenerTicket();
        if (ticket_id){
            const id = await createPreference(ticket_id);
            if (id){
                setPreferenceId(id);
            }
        }
    }
    return(    
        <div className='test'>
            <button onClick={handleBuy}>Comprar</button> 
            <div> {preferenceId && <Wallet initialization={{ preferenceId: preferenceId }}/> }</div>    
        </div>
    )

}