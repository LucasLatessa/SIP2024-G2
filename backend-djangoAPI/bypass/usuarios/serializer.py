from rest_framework import serializers
from .models import Usuario,Cliente,Administrador,Productora

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'
class AdministradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrador
        fields = '__all__'
class ProductoraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Productora
        fields = '__all__'