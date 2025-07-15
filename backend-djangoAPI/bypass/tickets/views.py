import os
from django.shortcuts import render
from django.http import JsonResponse, HttpRequest
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from django.utils.dateformat import format as django_format_date
from rest_framework.response import Response
from rest_framework import status
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
import json
from django.utils import timezone
from datetime import timedelta
from utils.authorization import RequestToken, authorized
from utils.mercadopago import preferencia, entregartoken
import time
import threading
class TicketView(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    queryset = Ticket.objects.all()


class PublicacionView(viewsets.ModelViewSet):
    serializer_class = PublicacionSerializer
    queryset = Publicacion.objects.all()
    def retrieve(self, request, pk=None):
        try:
            publicacion = Publicacion.objects.select_related(
                'ticket', 'ticket__evento', 'ticket__tipo_ticket'
            ).get(pk=pk)

            evento = publicacion.ticket.evento if publicacion.ticket else None
            tipo = publicacion.ticket.tipo_ticket if publicacion.ticket else None
            ticket=publicacion.ticket if publicacion.ticket else None
            # Formatea la fecha si existe
            fecha_formateada = (
                django_format_date(evento.fecha, "d/m/Y") if evento and evento.fecha else None
            )
            data = {
                "id": publicacion.id_Publicacion,
                "id_ticket": ticket.id_Ticket if ticket else None,
                "precio": publicacion.precio,
                "fecha": publicacion.fecha,
                "precio_original": publicacion.ticket.precioInicial if publicacion.ticket else None,
                "evento_nombre": evento.nombre if evento else None,
                "evento_fecha": fecha_formateada,
                "evento_hora": evento.hora if evento else None,
                "vendedorNombre": publicacion.ticket.propietario.nickname if publicacion.ticket and publicacion.ticket.propietario else None,
                "tipo": tipo.tipo if tipo else None,
                'imagen': (request.build_absolute_uri(evento.imagen.url) if evento.imagen else None)
            }

            return Response(data, status=status.HTTP_200_OK)

        except Publicacion.DoesNotExist:
            return Response({"error": "Publicacion no encontrada"}, status=status.HTTP_404_NOT_FOUND)


class PrecioView(viewsets.ModelViewSet):
    serializer_class = PrecioSerializer
    queryset = Precio.objects.all()


class TipoTicketView(viewsets.ModelViewSet):
    serializer_class = TipoTicketSerializer
    queryset = TipoTickets.objects.all()

def get_all_publication(request):
    publicaciones = Publicacion.objects.filter(publica=True).select_related(
        'ticket__evento', 'ticket__tipo_ticket'
    )

    publication_data = []
    for pub in publicaciones:
        ticket = pub.ticket
        evento = ticket.evento if ticket else None
        tipo = ticket.tipo_ticket if ticket else None
        fecha_formateada = (
            django_format_date(evento.fecha, "d/m/Y") if evento and evento.fecha else None
        )
        publication_data.append({
            "id_Publicacion": pub.id_Publicacion,
            "precio": pub.precio,
            "fecha": pub.fecha,
            "ticket_id": ticket.id_Ticket if ticket else None,
            "precio_original": ticket.precioInicial if ticket else None,
            "tipo": tipo.tipo if tipo else None,
            "eventoNombre": evento.nombre if evento else None,
            "eventoFecha": fecha_formateada,
            "eventoHora": evento.hora if evento else None,
            "foto": request.build_absolute_uri(evento.imagen.url) if evento.imagen else None,
        })

    return JsonResponse({"publicaciones": publication_data})

def get_publicacion_by_id(request, id):
    return JsonResponse({"tickets"})

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
    data = request.data
    data_ticket_publi_id= data.get("ticket_publi_id")
    data_unit_price= data.get("unit_price")
    data_description= data.get("description")
    data_vendedor_nickname= data.get("vendedor_nickname")
    data_ticket_publi_id.append(-1)
    access_token = Usuario.objects.get(nickname=data_vendedor_nickname).Access_Token

    respuesta= preferencia(1,data_ticket_publi_id,data_unit_price,data_description,"tickets/Publicacion/entregarTicketTpublicacion", access_token)
    if respuesta.get("ok"):
        return JsonResponse({
            "success": True,
            "preference_id": respuesta.get("preference_id"),
            "init_point": respuesta.get("init_point")
        })
    else:
        return JsonResponse({
            "success": False,
            "error": respuesta.get("error"),
            "status": respuesta.get("status"),
        }, status=respuesta.get("status", 400))

@api_view(["POST"])
def entregarTicketTpublicacion(request):
    payment_id = request.query_params.get("id")
    topic = request.query_params.get("topic")
    if topic == "payment" and payment_id:
        # Obtener info del pago desde MercadoPago
        data = entregartoken(payment_id, "")
        if data.get("status") == "approved":
            try:
                publi_id = data["additional_info"]["items"][0]["id"]
                publicacion = Publicacion.obtenerPorId(publi_id) 
                nuevo_propietario = data["additional_info"]["items"][0]["description"]
                
                ticket = publicacion.ticket

                # Guardar el precio de venta en el ticket
                ticket.precioInicial = publicacion.precio
                ticket.save()

                Ticket.transferir(ticket.id_Ticket, nuevo_propietario)
                Publicacion.modificarPublicado(publi_id)
                return JsonResponse({"mensaje": "Ticket comprado con exito!"}, status=200)
            except Exception as e:
                print(f"Error en compra: {e}")
                return JsonResponse({"error": "Error al comprar ticket"}, status=500)
        else:
            return JsonResponse({"error": "Pago no aprobado aun"}, status=400)
    else:
        return JsonResponse({"error": "Notificacion no valida"}, status=400)

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
    expiration_time = timezone.now() + timedelta(minutes=5)
    hilo=threading.Thread(target=timer_desreservar,args=(data_ticket_id_list,), daemon=False)
    hilo.start()

    return JsonResponse({
        "ticket_id_list": data_ticket_id_list,
        "expires_at": expiration_time.isoformat()
    })

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

