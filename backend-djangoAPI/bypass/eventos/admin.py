from django.contrib import admin
from .models import Evento, EstadoEvento, Lugar

# Register your models here.
admin.site.register(Evento)
admin.site.register(EstadoEvento)
admin.site.register(Lugar)