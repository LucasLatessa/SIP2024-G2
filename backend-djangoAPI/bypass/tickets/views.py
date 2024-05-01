from django.shortcuts import render
from rest_framework import viewsets
from .serializer import TicketSerializer, PublicacionSerializer, PrecioSerializer
from .models import Ticket, Publicacion, Precio
import mercadopago


class TicketView(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    queryset = Ticket.objects.all()

class PublicacionView(viewsets.ModelViewSet):
    serializer_class = PublicacionSerializer
    queryset = Publicacion.objects.all()

class PrecioView(viewsets.ModelViewSet):
    serializer_class = PrecioSerializer
    queryset = Precio.objects.all()


def comprarTicket(request):
    request
