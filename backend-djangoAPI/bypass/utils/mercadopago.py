import os
import mercadopago
from dotenv import load_dotenv
import json
import requests
CLIENT_ORIGIN_URL = os.environ.get('CLIENT_ORIGIN_URL')
def preferencia(data_quantity, data_ticket_id_list, data_unit_price, data_unit_description, url, token):
    sdk = mercadopago.SDK(
        "APP_USR-7414342170996710-012615-503bde8fdc5c4c1dc5d80c79c6ba7382-2235055866"#Cuenta de prueba "Vendedor"de lucas
    )
    
    BACKEND_ORIGIN_URL = os.environ.get("BACKEND_ORIGIN_URL")

    if (data_ticket_id_list[-1] == -1):

        data_ticket_id_list.pop()
        ticket_id_list_str = ",".join(map(str, data_ticket_id_list))
        sdk = mercadopago.SDK(
            token
        )
        
        preference_data = {
            "items": [
                {
                    "title": "Mi producto",
                    "quantity": data_quantity,
                    "id": ticket_id_list_str,
                    "unit_price": data_unit_price,
                    "description": data_unit_description,
                },
            ],
            "back_urls": {
                "success": CLIENT_ORIGIN_URL,
                "failure": CLIENT_ORIGIN_URL,
                "pending": CLIENT_ORIGIN_URL,
            },
            "auto_return": "approved",
            "notification_url": f"https://{BACKEND_ORIGIN_URL}/{url}",
            #"marketplace": 614744135521445,
            #"marketplace_fee": 1,
        }

    else:
        ticket_id_list_str = ",".join(map(str, data_ticket_id_list))
        
        preference_data = {
            "items": [
                {
                    "title": "Mi producto",
                    "quantity": data_quantity,
                    "id": ticket_id_list_str,
                    "unit_price": data_unit_price,
                    "description": data_unit_description,
                },
            ],
            "back_urls": {
                "success": CLIENT_ORIGIN_URL,
                "failure": CLIENT_ORIGIN_URL,
                "pending": "http://localhost:4040",
            },
            "auto_return": "approved",
            "notification_url": f"https://{BACKEND_ORIGIN_URL}/{url}",
        }


    try:
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]
        return preference["id"]
    except:
        print("No se pudo crear la preferencia")
        return None


def entregartoken(payment_id, evento):
    solicitud = f"https://api.mercadopago.com/v1/payments/{payment_id}"
    if evento == "evento" :
        headers = {
                "Authorization": "Bearer APP_USR-7414342170996710-012615-503bde8fdc5c4c1dc5d80c79c6ba7382-2235055866"
            } 
    else: 
        headers = {
                "Authorization": "Bearer APP_USR-7414342170996710-012615-503bde8fdc5c4c1dc5d80c79c6ba7382-2235055866"                
            }    
    response = requests.get(solicitud, headers=headers)
    data = response.json()
    return data
