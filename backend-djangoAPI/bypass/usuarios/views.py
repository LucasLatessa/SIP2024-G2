from django.shortcuts import render
from rest_framework import viewsets
from .serializer import UsuarioSerializer
from .models import Usuario

class UsuarioView(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all()
