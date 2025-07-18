from rest_framework import serializers
from .models import Evento, EstadoEvento, Lugar

class LugarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lugar
        fields = '__all__'

class EventoSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField(required=False)
    estado = serializers.StringRelatedField(read_only=True)
    lugar = serializers.PrimaryKeyRelatedField(
        queryset=Lugar.objects.all(),
        allow_null=True
    )

    class Meta:
        model = Evento
        fields = '__all__'

class EstadoEventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoEvento
        fields = '__all__'