import pytest
from datetime import datetime, timedelta
from eventos.models import Evento, Lugar, EstadoEvento
from tickets.models import Ticket, TipoTickets

@pytest.mark.django_db
def test_revalorizacion_por_temporalidad():
    # Paso 1: Crear los datos de prueba
    lugar = Lugar.objects.create(nombre="Lugar de Prueba")
    estado_pendiente = EstadoEvento.objects.create(estado="PENDIENTE")
    tipo_ticket = TipoTickets.objects.create(tipo="General")

    evento = Evento.objects.create(
        nombre='Evento de Prueba',
        cantTickets=100,
        cantTicketsTotal=100,
        fecha=(datetime.now() + timedelta(days=7)).date(),  # Fecha en el futuro (30 días a partir de hoy)
        hora='20:00:00',
        lugar=lugar,
        estado=estado_pendiente,
        descripcion='Descripción del evento de prueba'
    )

    # Crear algunos tickets asociados al evento
    for i in range(100):
        Ticket.objects.create(
            precioInicial=6000,  # Precio inicial de ejemplo
            evento=evento,
            tipo_ticket=tipo_ticket
        )

    # Paso 2: Imprimir precios antes de la revalorización
    print("Precios antes de la revalorización:")
    tickets = Ticket.objects.filter(evento=evento)
    for ticket in tickets:
        print(f'Ticket ID: {ticket.id_Ticket}, Precio: {ticket.precioInicial}')

    # Paso 3: Activar la revalorización
    evento.revalorizar_por_temporalidad()

    # Paso 4: Imprimir precios después de la revalorización
    print("Precios después de la revalorización:")
    tickets = Ticket.objects.filter(evento=evento)
    for ticket in tickets:
        print(f'Ticket ID: {ticket.id_Ticket}, Precio: {ticket.precioInicial}')

    # Paso 5: Verificar los precios de los tickets
    for ticket in tickets:
        assert ticket.precioInicial > 100, f'Ticket ID: {ticket.id_Ticket}, Precio: {ticket.precioInicial}'
