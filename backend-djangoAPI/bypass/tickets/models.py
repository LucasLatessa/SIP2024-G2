import datetime
from django.db import models

from django.db.models.signals import post_save
from django.dispatch import receiver
from eventos.models import Evento
from usuarios.models import Cliente
# Create your models here.

class TipoTickets(models.Model):
    id_tipo_ticket = models.AutoField(primary_key=True)
    tipo = models.TextField()

    def __str__ (self):
        return self.tipo 
    
class Ticket(models.Model):
    id_Ticket = models.AutoField(primary_key=True)
    precioInicial = models.IntegerField(blank=True, null=True)
    evento = models.ForeignKey(Evento, models.DO_NOTHING, db_column='evento', null=True)
    propietario = models.ForeignKey(Cliente, on_delete=models.CASCADE, blank=True, null=True, default=None)# Relación con Cliente
    tipo_ticket = models.ForeignKey(TipoTickets, on_delete=models.CASCADE, blank=True, null=True)
#    precios = models.ForeignKey(Precio, models.DO_NOTHING, db_column='precio', blank=True, null=True)
#    publicaciones=models.ForeignKey(Publicacion, models.DO_NOTHING, db_column='publicacion', blank=True, null=True)
#PUBLICACION Y PRECIO ARRAY DE ESAS CLASES(abajo)

    
    def modificarPropietario(ticket_id_str, propietario):
        try:
            ticket_id_list = ticket_id_str.split(",")
            for ticket_id in ticket_id_list:
                
                ticket = Ticket.objects.get(id_Ticket = ticket_id, propietario = None)
                nuevo_propietario = Cliente.objects.get(nickname = propietario)

                ticket.propietario = nuevo_propietario
                ticket.save()
        except:
            print("No se pudo cargar el ticket")


    def __str__(self):
        return f"TicketID: {self.id_Ticket}"
    

class Precio(models.Model):
    id_Precio = models.AutoField(primary_key=True)
    precio = models.FloatField()
    fechaInicial= models.DateTimeField(blank=True, null=True)
    ticket = models.ForeignKey(Ticket, models.DO_NOTHING, db_column='ticket', blank=True, null=True)





    def __str__(self):
        return "Precio: " + str(self.precio)


class Publicacion(models.Model):
    id_Publicacion = models.AutoField(primary_key=True)
    precio = models.FloatField()
    fecha= models.DateField(blank=True, null=True)
    publica = models.BooleanField(default=True)
    ticket = models.ForeignKey(Ticket, models.DO_NOTHING, db_column='ticket', blank=True, null=True)
    def __str__(self):
        return "Publicacion " + str(self.id_Publicacion)
    
#class TipoEntrada(models.Model):


#Trigger para vincular precio con el ticket una vez que se crea
# @receiver(post_save, sender=Ticket)
# def crear_precio(sender, instance, created, **kwargs):
#     if created:
#         Precio.objects.create(
#                 precio=instance.precioInicial,
#                 ticket=instance,
#                 fechaInicial = datetime.datetime.now()
#         )
