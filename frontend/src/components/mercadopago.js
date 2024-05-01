import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import axios from 'axios';
import { usesState } from React;



const Mercadopago = () => {
    const [preferenceId, setPreferenceId] = useState(null);
    initMercadoPago('YOUR_PUBLIC_KEY', {locale: "es-AR"});
    
    const createPreference = async () => {
        try {
            const evento = "1"
            const response = await axios.get(`http//localhost:8000/tickets/comprarticket/${evento}/`);
            const {ticket_id} = response.data;
            return ticket_id;

        } catch (error){
            console.log(error);
        }              
    }

    const hanldeBuy = async () => {
        const id = await createPreference();
        if (id){
            setPreferenceId(id)
        }
    }
        
    <div className='test'>
        <button onClick={hanldeBuy}>Comprar</button> 
        {preferenceId && <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} /> }       
        
    </div>

}