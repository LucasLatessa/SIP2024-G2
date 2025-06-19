import os
import mercadopago
from dotenv import load_dotenv
import json
import requests
CLIENT_ORIGIN_URL = os.environ.get('CLIENT_ORIGIN_URL')
NGROK_URL = os.environ.get('NGROK_URL')
def preferencia(data_quantity, data_ticket_id_list, data_unit_price, data_unit_description, url, token):
    sdk = mercadopago.SDK("APP_USR-614744135521445-050414-8d57f6a838fd306373c2724accac5802-1793151899")


    if data_ticket_id_list[-1] == -1:
        data_ticket_id_list.pop()
        sdk = mercadopago.SDK(token)  # SDK con token del vendedor
    ticket_id_list_str = ",".join(map(str, data_ticket_id_list))
    try:
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
            #"auto_return": "approved",
            "notification_url": f"{NGROK_URL}/{url}",
        }
        preference_response = sdk.preference().create(preference_data)
        status = preference_response.get("status", 500)
        if status == 201:
            preference = preference_response["response"]
            return {
                "ok": True,
                "preference_id": preference["id"],
                "init_point": preference["init_point"],
                "status": status,
            }
        else:
            return {
                "ok": False,
                "error": preference_response.get("response", {}),
                "status": status,
            }
    except Exception as e:
        return {
            "ok": False,
            "error": str(e),
            "status": 500,
        }

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
