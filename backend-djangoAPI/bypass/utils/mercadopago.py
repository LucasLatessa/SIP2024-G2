import os
import mercadopago
from dotenv import load_dotenv


def preferencia(data_quantity, data_ticket_id_list, data_unit_price, data_unit_description):
    sdk = mercadopago.SDK(
        "TEST-2575880952392402-051110-b1664a93c9ad6040e18dc6f01e896cca-1793151899"
    )

    body = json.loads(request.body)
    data_quantity = body.get("quantity")
    data_ticket_id_list = body.get("ticket_id")
    data_unit_price = body.get("unit_price")
    data_unit_description = body.get("description")

    ticket_id_list_str = ",".join(
        map(str, data_ticket_id_list)
    )  # paso la lista a string porque no le gusta a mercado libre sino

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
        "notification_url": f"https://{ngrok_url}/tickets/entregar",
    }
    try:
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]
        return preference["id"]
    except:
        print("No se pudo crear la preferencia")
        return None