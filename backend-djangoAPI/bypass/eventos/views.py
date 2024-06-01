from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets
from .serializer import EventoSerializer, EstadoEventoSerializer, LugarSerializer
from .models import Evento, EstadoEvento, Lugar
from tickets.models import Ticket, TipoTickets, Ticket, TipoTickets
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


def get_eventos_aprobados(request):
    # Recupera todos los usuarios de la base de datos
    events = Evento.objects.filter(estado=EstadoEvento.objects.get(estado="APROBADO"))

    # Convierte los usuarios a un formato JSON
    event_data = [
        {
            "id_Evento": event.id_Evento,
            "nombre": event.nombre,
            "fecha": event.fecha,
            "hora": event.hora,
            "imagen": request.build_absolute_uri(event.imagen.url) if event.imagen else None
        }
        for event in events
    ]

    # Devuelve los usuarios como una respuesta JSON
    return JsonResponse(event_data, safe=False)

def get_eventos_productora(request, productora_nickname):
    # Recupera todos los usuarios de la base de datos
    events = Evento.objects.filter(productora=productora_nickname)

    # Convierte los usuarios a un formato JSON
    event_data = [
        {
            "id_Evento": event.id_Evento,
            "nombre": event.nombre,
            "fecha": event.fecha,
            "hora": event.hora,
            "imagen": request.build_absolute_uri(event.imagen.url) if event.imagen else None
        }
        for event in events
    ]

    # Devuelve los usuarios como una respuesta JSON
    return JsonResponse(event_data, safe=False)


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

            # Creado el evento, creo los tickets por tipo
            for tipo_ticket in TipoTickets.objects.all():
                print(tipo_ticket)
                cantEntradas = request.data.get(
                    "cantidadEntradas" + tipo_ticket.tipo, ""
                )
                precioEntrada = request.data.get("precio" + tipo_ticket.tipo, "")

                print(cantEntradas)
                print(precioEntrada)

                # Creacio de las entradas del evento, segun el tipo
                crearTicketConTipo(
                    int(cantEntradas), tipo_ticket, serializer.instance, precioEntrada
                )

        return JsonResponse({"mensaje": "Evento creado"}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


# Funcion que crea tickets dada la cantidad el tipo
def crearTicketConTipo(cantidad, tipo, evento, precio):
    for _ in range(cantidad):
        Ticket.objects.create(evento=evento, precioInicial=precio, tipo_ticket=tipo)


# Verificar si el usuario autenticado tiene permisos de Administrador
@api_view(["PUT"])
def update_event_state(request, pk):
    try:
        event = Evento.objects.get(pk=pk)
        # Obtiene el nuevo estedo del cuerpo de la solicitud
        new_state = request.data.get("state")
        # Vamos a buscar el estado a los objetos que tenemos
        state = EstadoEvento.objects.get(estado=new_state)
        event.estado = state
        event.save()
        return JsonResponse(
            {"mensaje": "Estado de evento actualizado con éxito"}, status=200
        )
    except Evento.DoesNotExist:
        return JsonResponse({"error": "Evento no encontrado"}, status=404)

def event_report(request, pk):
    # Obtener el evento
    try:
        evento = Evento.objects.get(pk=pk)
    except Evento.DoesNotExist:
        return JsonResponse({'error': 'El evento no existe'}, status=404)
    
    # Obtener todos los tickets del evento
    tickets = Ticket.objects.filter(evento=evento, propietario__isnull=False)
    
    # Calcular entradas vendidas por tipo
    tipos_de_tickets = TipoTickets.objects.all()
    entradas_por_tipo = {
        tipo.tipo: tickets.filter(tipo_ticket=tipo).count()
        for tipo in tipos_de_tickets
    }
    
    # Entradas totales
    entradas_totales = tickets.count()
    
    # Calcular ganancia total
    ganancia_total = sum(ticket.precioInicial for ticket in tickets)
    
    # Calcular asistencia total (tickets usados)
    asistencia_total = tickets.filter(usada=True).count()
    
    # Crear el reporte
    reporte = {
        'evento': evento.nombre,
        'imagen': request.build_absolute_uri(evento.imagen.url) if evento.imagen else None,
        'entradas_totales': entradas_totales,
        'entradas_por_tipo': entradas_por_tipo,
        'ganancia_total': ganancia_total,
        'asistencia_total': asistencia_total,
    }
    
    return JsonResponse(reporte)