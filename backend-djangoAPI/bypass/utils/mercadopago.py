import os
import mercadopago
from dotenv import load_dotenv
import json
import requests

def preferencia(data_quantity, data_ticket_id_list, data_unit_price, data_unit_description, url, token):
    sdk = mercadopago.SDK(
        "APP_USR-614744135521445-050414-8d57f6a838fd306373c2724accac5802-1793151899"
    )
    
    ngrok_url = os.environ.get("NGROK_URL")

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
                "success": "https://youtube.com",
                "failure": "https://youtube.com",
                "pending": "https://youtube.com",
            },
            "auto_return": "approved",
            "notification_url": f"https://{ngrok_url}/{url}",
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
                "success": "https://youtube.com",
                "failure": "https://youtube.com",
                "pending": "https://youtube.com",
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


def entregartoken(payment_id, evento):
    solicitud = f"https://api.mercadopago.com/v1/payments/{payment_id}"
    if evento == "evento" :
        headers = {
                "Authorization": "Bearer APP_USR-614744135521445-050414-8d57f6a838fd306373c2724accac5802-1793151899"
            } 
    else: 
        headers = {
                "Authorization": "Bearer APP_USR-1598373692127396-061423-e44ea2d6679a1d18eb3811f21f243ce0-1796663413"                
            }    
    response = requests.get(solicitud, headers=headers)
    data = response.json()
    return data
