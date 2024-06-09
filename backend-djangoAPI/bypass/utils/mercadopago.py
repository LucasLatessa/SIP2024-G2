import os
import mercadopago
from dotenv import load_dotenv
import json
import requests

def preferencia(data_quantity, data_ticket_id_list, data_unit_price, data_unit_description, url):
    sdk = mercadopago.SDK(
        "TEST-2575880952392402-051110-b1664a93c9ad6040e18dc6f01e896cca-1793151899"
    )

    if not isinstance(data_ticket_id_list, list):
        ticket_id_list_str = str(data_ticket_id_list)
    else:
        ticket_id_list_str = ",".join(map(str, data_ticket_id_list))

    # URL de Ngrok
    ngrok_url = os.environ.get("NGROK_URL")

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
            "success": "http://localhost:4040",
            "failure": "http://localhost:4040",
            "pending": "http://localhost:4040",
        },
        "auto_return": "approved",
        "notification_url": f"https://{ngrok_url}/{url}",
    }
    try:
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]
        return preference["id"]
    except:
        print("No se pudo crear la preferencia")
        return None


def entregartoken(payment_id):
    solicitud = f"https://api.mercadopago.com/v1/payments/{payment_id}"
        
    headers = {
            "Authorization": "Bearer TEST-614744135521445-050414-2d9b1d04724212f02c2f8e3615f70b4c-1793151899"
        }    
    
    response = requests.get(solicitud, headers=headers)
    data = response.json()
    return data
