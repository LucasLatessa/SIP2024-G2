from rest_framework import serializers
from .models import Ticket, Precio, Publicacion, TipoTickets

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

class PrecioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Precio
        fields = '__all__'

class PublicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publicacion
        fields = '__all__'

class TipoTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoTickets
        fields = '__all__'