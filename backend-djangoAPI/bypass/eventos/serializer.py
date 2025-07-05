from rest_framework import serializers
from .models import Evento, EstadoEvento, Lugar

class EventoSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    estado = serializers.StringRelatedField()
    lugar = serializers.PrimaryKeyRelatedField(queryset=Lugar.objects.all())
    class Meta:
        model = Evento
        fields = '__all__'

class LugarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lugar
        fields = '__all__'

class EstadoEventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoEvento
        fields = '__all__'