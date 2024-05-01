import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import axios from 'axios';
import { useState } from "react";



export const Mercadopago = () => {
    const [preferenceId, setPreferenceId] = useState(null);
    initMercadoPago('YOUR_PUBLIC_KEY', {locale: "es-AR"});
    
    const createPreference = async () => {
        try {
            const evento = "1"
            const response = await axios.get(`http//localhost:8000/tickets/obtener_ticket_evento/${evento}/`);
            const {ticket_id} = response.data;
            return ticket_id;

        } catch (error){
            console.log(error);
        }              
    }

    const handleBuy = async () => {
        const id = await createPreference();
        if (id){
            setPreferenceId(id)
        }
    }
    return(    
        <div className='test'>
        <button onClick={handleBuy}>Comprar</button> 
        <div> {preferenceId} hola </div>
    
        </div>
        //{preferenceId && <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} /> }
    )

}