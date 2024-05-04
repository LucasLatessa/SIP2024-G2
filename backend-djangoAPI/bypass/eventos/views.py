from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets
from .serializer import EventoSerializer, EstadoEventoSerializer, LugarSerializer
from .models import Evento, EstadoEvento, Lugar
from tickets.models import Ticket, TipoTickets
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view


class EventoView(viewsets.ModelViewSet):
    serializer_class = EventoSerializer
    queryset = Evento.objects.all()


class EstadoEventoView(viewsets.ModelViewSet):
    serializer_class = EstadoEventoSerializer
    queryset = EstadoEvento.objects.all()


class LugarView(viewsets.ModelViewSet):
    serializer_class = LugarSerializer
    queryset = Lugar.objects.all()


def get_all_events(request):
    # Recupera todos los usuarios de la base de datos
    events = Evento.objects.all()

    # Convierte los usuarios a un formato JSON
    event_data = [
        {"id_Evento": event.id_Evento, "nombre": event.nombre, "fecha": event.fecha}
        for event in events
    ]

    # Devuelve los usuarios como una respuesta JSON
    return JsonResponse({"eventos": event_data})


# Creacion de eventos juntos con tickets de diferente tipo
@csrf_exempt
@api_view(["POST"])
def crear_evento(request):
    try:
        # Serializo el evento con los datos del POST
        serializer = EventoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Creo el evento
            # Obtengo la cantidad de tickets y el precio
            cantTickets = request.data.get("cantTickets", "")
            precio = request.data.get("precio", "")

            # Creado el evento, creo los tickets
            tipo_ticket_vip = get_object_or_404(TipoTickets, id_tipo_ticket=1)
            print(tipo_ticket_vip)
            cantEntradas = request.data.get("cantidadEntradasVIP", "")
            precioEntrada = request.data.get("precioVIP", "")
            #print(cantEntradas)
            #print(precioEntrada)

            #Creacio de las entradas del evento, segun el tipo
            crearTicketConTipo(int(cantEntradas), tipo_ticket_vip, serializer.instance,precioEntrada)

        return JsonResponse({"mensaje": "Evento creado"}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


# Funcion que crea tickets dada la cantidad el tipo
def crearTicketConTipo(cantidad, tipo, evento, precio):
    for _ in range(cantidad):
        Ticket.objects.create(evento=evento, precioInicial=precio, tipo_ticket=tipo)
