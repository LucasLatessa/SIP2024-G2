import os
from django.shortcuts import render
from django.http import JsonResponse, HttpRequest
from rest_framework import viewsets
from .serializer import TicketSerializer, PublicacionSerializer, PrecioSerializer, TipoTicketSerializer
from .models import Ticket, Publicacion, Precio, TipoTickets
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import mercadopago
import json
from dotenv import load_dotenv
import requests
from utils.authorization import RequestToken, authorized, can, getRequestToken

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

def get_tickets_by_cliente(request, cliente_id):
    # Filtra los tickets pertenecientes al cliente especificado
    tickets = Ticket.objects.filter(propietario_id=cliente_id)

    # Convierte los tickets a un formato JSON
    ticket_data = [{'id_Ticket': ticket.id_Ticket,
                    'precioInicial': ticket.precioInicial,
                    'evento': ticket.evento.id_Evento if ticket.evento else None,
                    'tipo_ticket': ticket.tipo_ticket.tipo if ticket.tipo_ticket else None}
                   for ticket in tickets]

    # Devuelve los tickets como una respuesta JSON
    return JsonResponse({'tickets': ticket_data})

#Funcion para obtener todos los tickets de un evento
#@authorized
def get_tickets_by_evento(request, evento_id):
    #Obtengo todos los tickets de ese evento
    tickets = Ticket.objects.filter(evento_id = evento_id)

    # Convierte los tickets a un formato JSON
    ticket_data = [{'id_Ticket': ticket.id_Ticket,
                    'precioInicial': ticket.precioInicial,
                    'evento': ticket.evento.id_Evento if ticket.evento else None,
                    'tipo_ticket': ticket.tipo_ticket.tipo if ticket.tipo_ticket else None}
                   for ticket in tickets]

    # Devuelve los tickets como una respuesta JSON
    return JsonResponse({'tickets': ticket_data})

@authorized
def obtener_ticket_evento(request:HttpRequest, token:RequestToken) -> JsonResponse:
    print(token)
    evento_id = request.GET.get('evento_id') 
    quantity = request.GET.get('quantity') 
    tipo_ticket = request.GET.get('tipo_ticket') 
    contador = 0
    ticket_id_list = [] 
    tickets_evento = Ticket.objects.filter(evento = evento_id)
    ticket_id = None

    for ticket in tickets_evento:      
        if ((ticket.propietario is None) and (ticket.tipo_ticket.tipo == tipo_ticket)):
            ticket_id = ticket.id_Ticket
            if (contador < int(quantity)):
                contador += 1
                ticket_id_list.append(ticket_id)

    return JsonResponse({'ticket_id_list': ticket_id_list})


@csrf_exempt
@api_view(['POST'])
def prueba_mercadopago(request): #por el momento asumimos que todo va a funcionar como debe 
    sdk = mercadopago.SDK("TEST-2575880952392402-051110-b1664a93c9ad6040e18dc6f01e896cca-1793151899")

    body = json.loads(request.body) 
    data_quantity = body.get("quantity") 
    data_ticket_id_list = body.get("ticket_id")
    data_unit_price = body.get("unit_price")
    data_unit_description = body.get("description")

    ticket_id_list_str = ",".join(map(str, data_ticket_id_list)) #paso la lista a string porque no le gusta a mercado libre sino

    #URL de Ngrok
    ngrok_url = os.environ.get('NGROK_URL')

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
    "back_urls":{
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
        return JsonResponse({'id': preference["id"]})
    except:
        print("No se pudo crear la preferencia")
        return JsonResponse({'id': None})


    
@csrf_exempt
@api_view(['POST'])
def entregarToken(request):
    try:
        payment_id = request.query_params.get('data.id')
        solicitud = f"https://api.mercadopago.com/v1/payments/{payment_id}"	
        merchant_order= request.query_params.get('topic')

        headers = {
            "Authorization": "Bearer TEST-614744135521445-050414-2d9b1d04724212f02c2f8e3615f70b4c-1793151899"
        }

        response = requests.get(solicitud, headers= headers)
        data = response.json()
        
        if(merchant_order != "merchant_order"):
            ticket_id_list= data["additional_info"]["items"][0]["id"]
            nick_name = data["additional_info"]["items"][0]["description"]
            print(ticket_id_list)
            Ticket.modificarPropietario(ticket_id_list, nick_name)
        
        return JsonResponse({'cliente': "cliente_data"})
    except:
        print("Error con el pago")

def obtener_precio_entrada(request):
    tipo_ticket = request.GET.get('tipo_ticket') 
    evento = request.GET.get('evento') 
    precio = Ticket.obtener_ticket_precio(tipo_ticket, evento)
    print(precio)
    return JsonResponse({'precio_ticket': precio})
