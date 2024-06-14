from django.contrib import admin
from .models import Usuario, Cliente, Administrador,Productora
from django.contrib import admin
from .models import Usuario, Cliente, Administrador, Productora

# Define custom admin classes
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'nickname', 'nombre', 'apellido', 'correo', 'creacion','Public_Key','Access_Token')
    search_fields = ('nickname', 'nombre', 'apellido', 'correo')
    readonly_fields = ('creacion',)

class ClienteAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'nickname', 'nombre', 'apellido', 'correo', 'creacion',  'dni')
    search_fields = ('nickname', 'nombre', 'apellido', 'correo', 'dni')
    readonly_fields = ('creacion',)

class AdministradorAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'nickname', 'nombre', 'apellido', 'correo', 'creacion',  'dni')
    search_fields = ('nickname', 'nombre', 'apellido', 'correo', 'dni')
    readonly_fields = ('creacion',)

class ProductoraAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'nickname', 'nombre', 'apellido', 'correo', 'creacion')
    search_fields = ('nickname', 'nombre', 'apellido', 'correo')
    readonly_fields = ('creacion',)

# Register your models with the custom admin classes
admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Cliente, ClienteAdmin)
admin.site.register(Administrador, AdministradorAdmin)
admin.site.register(Productora, ProductoraAdmin)

""" # Register your models here.
admin.site.register(Usuario)
admin.site.register(Cliente)
admin.site.register(Administrador)
admin.site.register(Productora) """