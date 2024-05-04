from rest_framework import serializers
from .models import Beneficio

class BeneficioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficio
        fields = '__all__'
