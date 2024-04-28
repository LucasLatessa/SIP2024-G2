from django.contrib import admin
from .models import Usuario, Cliente, Administrador,Productora

# Register your models here.
admin.site.register(Usuario)
admin.site.register(Cliente)
admin.site.register(Administrador)
admin.site.register(Productora)