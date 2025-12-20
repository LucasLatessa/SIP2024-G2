import os
from urllib.parse import urlencode
from django.shortcuts import render
from django.http import HttpResponseBadRequest, JsonResponse, HttpRequest
from rest_framework import viewsets
from .serializer import (
    TicketSerializer,
    PublicacionSerializer,
    PrecioSerializer,
    TipoTicketSerializer,
)
from .models import Ticket, Publicacion, Precio, TipoTickets
from usuarios.models import Cliente, Productora, Usuario
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import mercadopago
import json
from dotenv import load_dotenv
import requests
from datetime import datetime, timedelta, timezone
from utils.authorization import RequestToken, authorized, can, getRequestToken
from utils.mercadopago import entregartokenPayment, preferencia
import sys
from django.db.models import Exists, OuterRef
from django.utils.crypto import get_random_string


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


def get_all_publication(request, l):
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

    # Buscamos si existe una Publicacion asociada a este ticket Y que tenga publica=True
    publicacion_activa = Publicacion.objects.filter(
        ticket=OuterRef(
            "pk"
        ),  # 'pk' hace referencia al ID del Ticket en la consulta principal
        publica=True,
    )

    # Filtra los tickets pertenecientes al cliente especificado
    # .annotate() crea un campo virtual temporal llamado 'es_publicado' en cada objeto ticket
    tickets = Ticket.objects.filter(propietario_id=cliente_id).annotate(
        es_publicado=Exists(publicacion_activa)
    )

    # Convierte los tickets a un formato JSON
    ticket_data = [
        {
            "id_Ticket": ticket.id_Ticket,
            "precioInicial": ticket.precioInicial,
            "evento": ticket.evento.id_Evento if ticket.evento else None,
            "tipo_ticket": ticket.tipo_ticket.tipo if ticket.tipo_ticket else None,
            "qr": request.build_absolute_uri(ticket.qr.url) if ticket.qr else None,
            "usada": ticket.usada,
            # Aquí agregamos el nuevo campo basado en la anotación
            "en_publicacion": ticket.es_publicado,
        }
        for ticket in tickets
    ]

    # Devuelve los tickets como una respuesta JSON
    return JsonResponse({"tickets": ticket_data})


@api_view(["POST"])
def crearPublicacion(request):
    publicacion = json.loads(request.body)
    ticketRequest = publicacion.get("ticket")
    precioRequest = publicacion.get("precio")
    ticket = Ticket.objects.get(id_Ticket=ticketRequest)
    publicado = Publicacion.objects.filter(ticket=ticket, publica=True)
    if not publicado:
        Publicacion.objects.create(ticket=ticket, precio=precioRequest)
        return JsonResponse({"mensaje": "Publicacion creada con éxito"}, status=200)
    else:
        return JsonResponse({"error": "Publicacion existente"}, status=404)


@api_view(["POST"])
def comprarPublicacion(request):
    body = json.loads(request.body)
    data_ticket_publi_id = body.get("ticket_publi_id")
    data_unit_price = body.get("unit_price")
    data_description = body.get("description")
    data_vendedor_nickname = body.get("vendedor_nickname")
    data_ticket_publi_id.append(-1)

    usuario = Usuario.objects.get(nickname=data_vendedor_nickname)
    access_token = usuario.Access_Token
    print("ComprarPublicacion - print usuario", usuario.user_id)

    respuesta = preferencia(
        1,
        data_ticket_publi_id,
        data_unit_price,
        data_description,
        "tickets/Publicacion/entregarTicketTpublicacion",
        usuario.user_id,
        access_token,
    )
    return JsonResponse({"id": respuesta})


@api_view(["POST"])
def entregarTicketTpublicacion(request):
    vendedor_id = request.GET.get("vendedor_id")
    payment_id = request.query_params.get("data.id")
    merchant_order = request.query_params.get("topic")
    if (merchant_order != "merchant_order" and payment_id != None):
        
        usuario = Usuario.objects.get(user_id=vendedor_id)
        data = entregartokenPayment(payment_id, "vendedor", usuario.Access_Token)
        ticket_publi_id = data["additional_info"]["items"][0]["id"]
        ticket_publi_id_split = ticket_publi_id.split(",")
        
        nick_name = data["additional_info"]["items"][0]["description"]

        Ticket.modificarPropietario(ticket_publi_id_split[0], nick_name, "publicacion")
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
    tickets = Ticket.objects.filter(evento_id=evento_id, usada=False)

    valorMax = 10000000000
    min = valorMax
    max = 0
    for ticket_no_usados in tickets:
        if ticket_no_usados.precioInicial >= max:
            max = ticket_no_usados.precioInicial
        elif ticket_no_usados.precioInicial <= min:
            min = ticket_no_usados.precioInicial

    if valorMax == min:
        min = 0

    # Creo el JSON
    precios_data = [{"precioMaximo": max, "precioMinimo": min}]

    # Devuelve los tickets como una respuesta JSON
    return JsonResponse({"precios": precios_data})


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

    respuesta = preferencia(
        data_quantity,
        data_ticket_id_list,
        data_unit_price,
        data_unit_description,
        "tickets/entregar",
        "",
        ""
    )
    return JsonResponse({"id": respuesta})


@csrf_exempt
@api_view(["POST"])
def entregarToken(request):
    payment_id = request.query_params.get("data.id")
    merchant_order = request.query_params.get("topic")
    if merchant_order != "merchant_order" and payment_id != None:
        data = entregartokenPayment(payment_id, "evento", "")
        Ticket.modificarPropietario(
            data["additional_info"]["items"][0]["id"],
            data["additional_info"]["items"][0]["description"],
            "evento",
        )
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
    print(id_ticket)
    print(nuevoPropietario)
    Ticket.modificarPropietario(str(id_ticket), nuevoPropietario, "regalo")
    return JsonResponse({"mensaje": "Ticket transferido con exito!"}, status=200)


# Integracion prueba_mercadopago
@csrf_exempt
@api_view(["GET"])
def OauthCallback(request):
    # MP vuelve por GET: /callback?code=...&state=...
    code = request.GET.get("code")
    mp_state = request.GET.get("mp_state")
    error = request.GET.get("error")
    error_desc = request.GET.get("error_description")

    if error:
        return HttpResponseBadRequest(f"MP OAuth error: {error} - {error_desc}")

    if not code or not mp_state:
        return HttpResponseBadRequest("Missing code/state in query params")

    # 1) Buscar dueño del state por prefijo
    owner = None
    owner_type = None

    if mp_state.startswith("p_"):
        owner = Productora.objects.filter(mp_state=mp_state).first()
        owner_type = "productora"
    elif mp_state.startswith("c_"):
        owner = Cliente.objects.filter(mp_state=mp_state).first()
        owner_type = "cliente"
    else:
        return HttpResponseBadRequest("Invalid state prefix")

    if not owner:
        return HttpResponseBadRequest("Invalid or expired state")

    # 2) Intercambiar code por tokens
    # IMPORTANTE: redirect_uri debe ser EXACTAMENTE igual al que usaste al crear la authorize_url
    redirect_uri = f"https://{os.environ.get('NGROK_URL')}/api/mp/oauth/callback"
    # Si NGROK_URL ya viene con https://, usa:
    # redirect_uri = f"{os.environ.get('NGROK_URL').rstrip('/')}/api/mp/oauth/callback"

    payload = {
        "client_id": os.environ.get("CLIENT_ID"),
        "client_secret": os.environ.get("CLIENT_SECRET"),
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
    }

    r = requests.post(
        "https://api.mercadopago.com/oauth/token", data=payload, timeout=30
    )
    if r.status_code != 200:
        return HttpResponseBadRequest(f"Token exchange failed: {r.text}")

    data = r.json()

    access_token = data["access_token"]
    refresh_token = data["refresh_token"]
    expires_in = int(data.get("expires_in", 0))
    expires_at = timezone.now() + timedelta(seconds=expires_in) if expires_in else None
    mp_user_id = data.get("user_id") or data.get("collector_id")

    # 3) Guardar tokens en el dueño
    owner.mp_access_token = access_token
    owner.mp_refresh_token = refresh_token
    owner.mp_expires_at = expires_at
    owner.mp_user_id = mp_user_id

    # 4) Invalidar state (evita replay)
    owner.state = None

    owner.save(
        update_fields=[
            "mp_access_token",
            "mp_refresh_token",
            "mp_expires_at",
            "mp_user_id",
            "mp_state",
        ]
    )

    return JsonResponse(
        {"ok": True, "type": owner_type, "owner_id": owner.pk, "mp_user_id": mp_user_id}
    )


ngrok_url = os.environ.get("NGROK_URL")


@api_view(["POST"])
def mp_oauth_authorize_url(request) -> str:
    body = json.loads(request.body)
    vendedor_id = body.get("vendedor_id")
    tipo = body.get("tipo")
    mp_state = get_random_string(32)

    if tipo == "cliente":
        obj = Cliente.objects.get(pk=vendedor_id)
        state = "c_" + mp_state
        obj.mp_state = mp_state
        # opcional recomendado:
        # obj.state_created_at = timezone.now()
        # obj.state_used_at = None
        obj.save(update_fields=["mp_state"])
    elif tipo == "productora":
        obj = Productora.objects.get(pk=vendedor_id)
        mp_state = "p_" + mp_state
        obj.mp_state = mp_state
        # opcional recomendado:
        # obj.state_created_at = timezone.now()
        # obj.state_used_at = None
        obj.save(update_fields=["mp_state"])
    else:
        raise ValueError("tipo debe ser 'cliente' o 'productora'")

    params = {
        "client_id": os.environ.get("CLIENT_ID"),
        "response_type": "code",
        "redirect_uri": f"https://{ngrok_url}/api/mp/Oauth/callback",
        "mp_state": mp_state,
    }
    return JsonResponse(
        {"url": "https://auth.mercadopago.com/authorization?" + urlencode(params)}
    )
