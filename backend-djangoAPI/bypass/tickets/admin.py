from django.contrib import admin
from .models import Ticket, Precio, Publicacion

# Register your models here.
admin.site.register(Ticket)
admin.site.register(Precio)
admin.site.register(Publicacion)