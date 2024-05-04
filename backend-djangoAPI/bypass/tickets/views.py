import os
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import viewsets
from .serializer import TicketSerializer, PublicacionSerializer, PrecioSerializer, TipoTicketSerializer
from .models import Ticket, Publicacion, Precio, TipoTickets
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import mercadopago
import json
from dotenv import load_dotenv


class TicketView(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    queryset = Ticket.objects.all()

class PublicacionView(viewsets.ModelViewSet):
    serializer_class = PublicacionSerializer
    queryset = Publicacion.objects.all()

class PrecioView(viewsets.ModelViewSet):
    serializer_class = PrecioSerializer
    queryset = Precio.objects.all()

class TipoTicketView(viewsets.ModelViewSet):
    serializer_class = TipoTicketSerializer
    queryset = TipoTickets.objects.all()

def get_all_publication(request):
    # Filtra las publicaciones que estén marcadas como publicas
    publications = Publicacion.objects.filter(publica=True)
    
    # Convierte las publicaciones a un formato JSON
    publication_data = [{'id_Publicacion': publication.id_Publicacion, 
                         'precio': publication.precio, 
                         'fecha': publication.fecha, 
                         'ticket_id': publication.ticket.id_Ticket if publication.ticket else None,
                         'nombre_evento': publication.ticket.evento.nombre if publication.ticket else None} 
                        for publication in publications]

    # Devuelve las publicaciones como una respuesta JSON
    return JsonResponse({'publicaciones': publication_data})

def obtener_ticket_evento(request, evento_id):  #por el momento asumimos que todo va a funcionar como debe 
    tickets_evento = Ticket.objects.filter(evento = evento_id)


    for ticket in tickets_evento:
        if ticket.propietario is None:
            ticket_id = ticket.id_Ticket
            break

    return JsonResponse({'ticket_id': ticket_id})


@csrf_exempt
@api_view(['POST'])
def prueba_mercadopago(request): #por el momento asumimos que todo va a funcionar como debe 
    sdk = mercadopago.SDK(os.environ.get("PROD_ACCESS_TOKEN"))
    #print(sdk)

    body = json.loads(request.body) 
    data_quantity = body.get("quantity") 
    data_ticket_id = body.get("ticket_id")
    data_unit_price = body.get("unit_price")

    preference_data = {
    "items": [
        {
            "title": "Mi producto",
            "quantity": data_quantity,
            "ticket_id": data_ticket_id,
            "unit_price": data_unit_price,
            }
        ]
    }
    preference_response = sdk.preference().create(preference_data)
    preference = preference_response["response"]

    return JsonResponse({'id': preference["id"]})

