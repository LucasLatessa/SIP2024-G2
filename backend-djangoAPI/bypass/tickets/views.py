import os
from django.shortcuts import render
from django.http import JsonResponse, HttpRequest
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from django.utils.dateformat import format as django_format_date

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
import time
import threading
from django.db.models import Min, Max
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

    ticket_data = []
    for ticket in tickets:
        evento = ticket.evento

        # Formatea la fecha si existe
        fecha_formateada = (
            django_format_date(evento.fecha, "d/m/Y") if evento and evento.fecha else None
        )

        ticket_data.append({
            "id_ticket": ticket.id_Ticket,
            "precio": ticket.precioInicial,
            "tipo_ticket": ticket.tipo_ticket.tipo if ticket.tipo_ticket else None,
            "qr": request.build_absolute_uri(ticket.qr.url) if ticket.qr else None,
            "usada": ticket.usada,
            "foto": request.build_absolute_uri(evento.imagen.url) if evento and evento.imagen else None,
            "eventoNombre": evento.nombre if evento else None,
            "eventoFecha": fecha_formateada,
            "eventoHora": str(evento.hora) if evento and evento.hora else None,
            "eventoLugarNombre": evento.lugar.nombre if evento and evento.lugar else None,
        })

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
        data = entregartoken(payment_id, "evento")
            
        ticket_publi_id = data["additional_info"]["items"][0]["id"]
        nick_name = data["additional_info"]["items"][0]["description"]
        ticket_publi_id_split = ticket_publi_id.split(",")

        Ticket.modificarPropietario(ticket_publi_id_split[0], nick_name, "publi")
        Publicacion.modificarPublicado(ticket_publi_id_split[1])
        return JsonResponse({"cliente": "cliente_data"})
    
    else:
        return JsonResponse({"cliente": None})

def get_or_none(model, **kwargs):
    try:
        return model.objects.get(**kwargs)
    except (ObjectDoesNotExist, MultipleObjectsReturned):
        return None

@csrf_exempt
@api_view(["POST"])
def transferirTicket(request):
    payment_id = request.query_params.get("id")
    topic = request.query_params.get("topic")

    if topic == "payment" and payment_id:
        # Obtener info del pago desde MercadoPago
        data = entregartoken(payment_id, "evento")
        if data.get("status") == "approved":
            try:
                ticket_id = data["additional_info"]["items"][0]["id"]
                nuevo_propietario = data["additional_info"]["items"][0]["description"]
                print(nuevo_propietario)
                Ticket.transferir(ticket_id, nuevo_propietario)

                return JsonResponse({"mensaje": "Ticket transferido con exito!"}, status=200)
            except Exception as e:
                print(f"Error en transferencia: {e}")
                return JsonResponse({"error": "Error al transferir ticket"}, status=500)
        else:
            return JsonResponse({"error": "Pago no aprobado aun"}, status=400)
    else:
        return JsonResponse({"error": "Notificacion no valida"}, status=400)
@api_view(["PUT"])
def preferenciaTransferir(request):
    data = request.data  # no uses json.loads si usas DRF

    id_ticket = data.get("id_ticket")
    costo_transferencia = data.get("costoTransferencia")
    nuevo_propietario = data.get("nuevoPropietario")

    if not id_ticket or not costo_transferencia or not nuevo_propietario:
        return JsonResponse({
            "success": False,
            "error": "Faltan datos obligatorios"
        }, status=400)

    # Llamar a la funcion preferencia (de MercadoPago)
    resultado = preferencia(
        1,                          # quantity
        [id_ticket],               # lista de IDs de tickets
        costo_transferencia,       # precio
        nuevo_propietario, # descripcion
        "tickets/Ticket/transferir",# success URL
        ""                         # failure URL
    )

    if resultado.get("ok"):
        return JsonResponse({
            "success": True,
            "preference_id": resultado.get("preference_id"),
            "init_point": resultado.get("init_point")
        })
    else:
        return JsonResponse({
            "success": False,
            "error": resultado.get("error"),
            "status": resultado.get("status"),
        }, status=resultado.get("status", 400))

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
        if (ticket.propietario is None) and (not ticket.reservado) and (ticket.tipo_ticket.tipo == tipo_ticket):
            ticket_id = ticket.id_Ticket
            if contador < int(quantity):
                contador += 1
                ticket_id_list.append(ticket_id)
    return JsonResponse({"ticket_id_list": ticket_id_list})

def reservar_ticket(request: HttpRequest):
    data_ticket_id_list = request.GET.get("ticket_id").split(",")
    for ticket_id in data_ticket_id_list :
        ticket = Ticket.objects.get(id_Ticket=ticket_id)
        ticket.reservado=True
        ticket.save()

    hilo=threading.Thread(target=timer_desreservar,args=(data_ticket_id_list,), daemon=False)
    hilo.start()

    return JsonResponse({"ticket_id_list": "data_ticket_id_list"})

def timer_desreservar(data_ticket_id_list):
    time.sleep(300)#5 minutos
    for ticket_id in data_ticket_id_list :
        ticket = Ticket.objects.get(id_Ticket=ticket_id)
        ticket.reservado=False
        ticket.save()
    
    print("Se completo el timer el ticket")


@csrf_exempt
@api_view(["POST"])
def prueba_mercadopago(request):
    body = json.loads(request.body)
    data_quantity = body.get("quantity")
    data_ticket_id_list = body.get("ticket_id")
    data_unit_price = body.get("unit_price")
    data_unit_description = body.get("description")
    resultado= preferencia(data_quantity, data_ticket_id_list, data_unit_price, data_unit_description, "tickets/entregar", "")
    if resultado.get("ok"):
        # si se creo la preferencia correctamente
        return JsonResponse({
            "success": True,
            "preference_id": resultado.get("preference_id"),
            "init_point": resultado.get("init_point")
        })
    else:
        # si hubo error, devolver info para debug
        return JsonResponse({
            "success": False,
            "error": resultado.get("error"),
            "status": resultado.get("status"),
        }, status=resultado.get("status", 400))


@csrf_exempt
@api_view(["POST"])
def entregarToken(request):
    payment_id = request.query_params.get("id")
    topic = request.query_params.get("topic")
    # Solo procesar pagos, no merchant orders
    if topic == "payment" and payment_id:
        data = entregartoken(payment_id, "evento")

        # Verificar que pago esté aprobado antes de seguir
        if data.get("status") == "approved":
            try:
                ticket_ids = data["additional_info"]["items"][0]["id"]
                cliente_nickname = data["additional_info"]["items"][0]["description"]
                Ticket.modificarPropietario(ticket_ids, cliente_nickname, "evento")
                # Tomo el primer ticket para acceder al evento
                primer_id = ticket_ids.split(",")[0].strip()
                primer_ticket = Ticket.objects.get(id_Ticket=primer_id)

                # Llamo al metodo del evento
                evento = primer_ticket.evento
                evento.revalorizar_tickets_restantes()
                return JsonResponse({"cliente": "cliente_data"})
            except Exception as e:
                print(f"Error procesando ticket: {e}")
                return JsonResponse({"error": "Error procesando ticket"}, status=500)
        else:
            return JsonResponse({"error": "Pago no aprobado aún"}, status=400)
    else:
        # No procesar merchant_order o notificaciones no deseadas
        return JsonResponse({"cliente": None})

def obtener_precio_entrada(request):
    tipo_ticket = request.GET.get("tipo_ticket")
    evento = request.GET.get("evento")
    precio = Ticket.obtener_ticket_precio(tipo_ticket, evento)
    return JsonResponse({"precio_ticket": precio})

@api_view(["PUT"])
def cambiar_estado_ticket(request, id_Ticket):
    ticket = Ticket.objects.get(id_Ticket=id_Ticket)
    ticket.usada = True
    ticket.save()
    return JsonResponse({"mensaje": "Cambio de estado a usado!"}, status=200)

