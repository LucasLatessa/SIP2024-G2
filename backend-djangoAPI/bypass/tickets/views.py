import os
from django.shortcuts import render
from django.http import JsonResponse, HttpRequest
from rest_framework import viewsets
from .serializer import (
    TicketSerializer,
    PublicacionSerializer,
    PrecioSerializer,
    TipoTicketSerializer,
)
from .models import Ticket, Publicacion, Precio, TipoTickets
from usuarios.models import Usuario
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import mercadopago
import json
from dotenv import load_dotenv
import requests
from datetime import datetime
from utils.authorization import RequestToken, authorized, can, getRequestToken
from utils.mercadopago import preferencia, entregartoken
import sys


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


def get_all_publication(request,l):
    # Filtra las publicaciones que estén marcadas como publicas
    publications = Publicacion.objects.filter(publica=True)

    # Convierte las publicaciones a un formato JSON
    publication_data = [
        {
            "id_Publicacion": publication.id_Publicacion,
            "precio": publication.precio,
            "fecha": publication.fecha,
            "ticket_id": publication.ticket.id_Ticket if publication.ticket else None,
            "nombre_evento": (
                publication.ticket.evento.nombre if publication.ticket else None
            ),
        }
        for publication in publications
    ]
    # Devuelve las publicaciones como una respuesta JSON
    return JsonResponse({"publicaciones": publication_data})


def get_tickets_by_cliente(request, cliente_id):
    # Filtra los tickets pertenecientes al cliente especificado
    tickets = Ticket.objects.filter(propietario_id=cliente_id)

    # Convierte los tickets a un formato JSON
    ticket_data = [
        {
            "id_Ticket": ticket.id_Ticket,
            "precioInicial": ticket.precioInicial,
            "evento": ticket.evento.id_Evento if ticket.evento else None,
            "tipo_ticket": ticket.tipo_ticket.tipo if ticket.tipo_ticket else None,
            "qr": request.build_absolute_uri(ticket.qr.url) if ticket.qr else None,
            "usada": ticket.usada
        }  # Construye una URL absoluta para el campo QR
        for ticket in tickets
    ]

    # Devuelve los tickets como una respuesta JSON
    return JsonResponse({"tickets": ticket_data})

@api_view(["POST"])
def crearPublicacion(request):
    publicacion = json.loads(request.body)
    ticketRequest = publicacion.get("ticket")
    precioRequest = publicacion.get("precio")
    ticket = Ticket.objects.get(id_Ticket = ticketRequest)
    publicado = Publicacion.objects.filter(ticket = ticket, publica = True)
    if (not publicado):
        Publicacion.objects.create(ticket=ticket, precio=precioRequest)
        return JsonResponse(
            {"mensaje": "Publicacion creada con éxito"}, status=200
        )
    else:
        return JsonResponse({"error": "Publicacion existente"}, status=404)

@api_view(["POST"])
def comprarPublicacion(request):
    body = json.loads(request.body)
    data_ticket_publi_id= body.get("ticket_publi_id")
    data_unit_price= body.get("unit_price")
    data_description= body.get("description")
    data_vendedor_nickname= body.get("vendedor_nickname")
    data_ticket_publi_id.append(-1)

    access_token = Usuario.objects.get(nickname=data_vendedor_nickname).Access_Token

    respuesta= preferencia(1,data_ticket_publi_id,data_unit_price,data_description,"tickets/Publicacion/entregarTicketTpublicacion", access_token)
    return JsonResponse({"id":respuesta})

@api_view(["POST"])
def entregarTicketTpublicacion(request):
    payment_id = request.query_params.get("data.id")
    merchant_order = request.query_params.get("topic")
    if (merchant_order != "merchant_order" and payment_id != None):
        data = entregartoken(payment_id, "vendedor")
            
        ticket_publi_id = data["additional_info"]["items"][0]["id"]
        nick_name = data["additional_info"]["items"][0]["description"]
        ticket_publi_id_split = ticket_publi_id.split(",")

        Ticket.modificarPropietario(ticket_publi_id_split[0], nick_name, "publi")
        Publicacion.modificarPublicado(ticket_publi_id_split[1])
        return JsonResponse({"cliente": "cliente_data"})
    
    else:
        return JsonResponse({"cliente": None})

# Funcion para obtener todos los tickets de un evento
# @authorized
def get_tickets_by_evento(request, evento_id):
    # Obtengo todos los tickets de ese evento
    tickets = Ticket.objects.filter(evento_id=evento_id)

    # Convierte los tickets a un formato JSON
    ticket_data = [
        {
            "id_Ticket": ticket.id_Ticket,
            "precioInicial": ticket.precioInicial,
            "evento": ticket.evento.id_Evento if ticket.evento else None,
            "tipo_ticket": ticket.tipo_ticket.tipo if ticket.tipo_ticket else None,
        }
        for ticket in tickets
    ]
    # Devuelve los tickets como una respuesta JSON
    return JsonResponse({"tickets": ticket_data})

def get_tickets_by_evento_min_max(request, evento_id):
# Obtengo todos los tickets de ese evento
    tickets = Ticket.objects.filter(evento_id=evento_id,usada=False)

    valorMax = 10000000000
    min = valorMax
    max = 0
    for ticket_no_usados in  tickets:
        if ticket_no_usados.precioInicial >= max:
            max = ticket_no_usados.precioInicial
        elif  ticket_no_usados.precioInicial <= min:
            min = ticket_no_usados.precioInicial

    if valorMax == min:
        min = 0

    # Creo el JSON  
    precios_data = [
        {
            "precioMaximo": max,
            "precioMinimo": min
        }
    ]

    # Devuelve los tickets como una respuesta JSON
    return JsonResponse({"precios":precios_data})

@authorized
def obtener_ticket_evento(request: HttpRequest, token: RequestToken) -> JsonResponse:
    evento_id = request.GET.get("evento_id")
    quantity = request.GET.get("quantity")
    tipo_ticket = request.GET.get("tipo_ticket")
    contador = 0
    ticket_id_list = []
    tickets_evento = Ticket.objects.filter(evento=evento_id)
    ticket_id = None
    for ticket in tickets_evento:
        if (ticket.propietario is None) and (ticket.tipo_ticket.tipo == tipo_ticket):
            ticket_id = ticket.id_Ticket
            if contador < int(quantity):
                contador += 1
                ticket_id_list.append(ticket_id)

    return JsonResponse({"ticket_id_list": ticket_id_list})


@csrf_exempt
@api_view(["POST"])
def prueba_mercadopago(request):
    body = json.loads(request.body)
    data_quantity = body.get("quantity")
    data_ticket_id_list = body.get("ticket_id")
    data_unit_price = body.get("unit_price")
    data_unit_description = body.get("description")

    respuesta= preferencia(data_quantity, data_ticket_id_list, data_unit_price, data_unit_description, "tickets/entregar", "")
    return JsonResponse({"id":respuesta})


@csrf_exempt
@api_view(["POST"])
def entregarToken(request):
    payment_id = request.query_params.get("data.id")
    merchant_order = request.query_params.get("topic")
    if (merchant_order != "merchant_order" and payment_id != None):
        data = entregartoken(payment_id, "evento")    
        Ticket.modificarPropietario(data["additional_info"]["items"][0]["id"], data["additional_info"]["items"][0]["description"], "evento")
        return JsonResponse({"cliente": "cliente_data"})
    
    else:
        return JsonResponse({"cliente": None})


def obtener_precio_entrada(request):
    tipo_ticket = request.GET.get("tipo_ticket")
    evento = request.GET.get("evento")
    print(tipo_ticket)
    print(evento)
    precio = Ticket.obtener_ticket_precio(tipo_ticket, evento)
    return JsonResponse({"precio_ticket": precio})

@api_view(["PUT"])
def cambiar_estado_ticket(request, id_Ticket):
    ticket = Ticket.objects.get(id_Ticket=id_Ticket)
    ticket.usada = True
    ticket.save()
    return JsonResponse({"mensaje": "Cambio de estado a usado!"}, status=200)

@api_view(["PUT"])
def transferirTicket(request):
    body = json.loads(request.body)
    id_ticket = body.get("id_ticket")
    nuevoPropietario = body.get("nuevoPropietario")
    tipo = body.get("tipo")
    print(id_ticket)
    print(nuevoPropietario)
    print(tipo)
    Ticket.modificarPropietario(str(id_ticket), nuevoPropietario, tipo)  
    return JsonResponse({"mensaje": "Ticket transferido con exito!"}, status=200)