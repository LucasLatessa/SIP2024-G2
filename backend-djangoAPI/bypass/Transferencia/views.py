from django.shortcuts import render
from rest_framework import viewsets
from .serializer import TransferenciaSerializer
from .models import Transferencia
from utils.permissions import IsAuthenticatedCustom, HasScopePermission


# Create your views here.
class TransferenciaView(viewsets.ModelViewSet):
    serializer_class = TransferenciaSerializer
    queryset = Transferencia.objects.all()
    permission_classes = [IsAuthenticatedCustom]
