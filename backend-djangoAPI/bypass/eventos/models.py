from django.db import models

from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.apps import apps

# Create your models here.

class EstadoEvento(models.Model):
    id_Estado = models.AutoField(primary_key=True)
    estado = models.TextField()

    def __str__(self):
        return self.estado

class Lugar(models.Model):
    id_Lugar = models.AutoField(primary_key=True)
    nombre = models.TextField()
    direccion = models.TextField()

    def __str__(self):
        return self.nombre

class Evento(models.Model):
    id_Evento = models.AutoField(primary_key=True)
    nombre = models.TextField()
    cantTickets = models.IntegerField(default=0)
    fecha = models.DateField(blank=True, null=True)
    hora = models.TimeField(blank=True, null=True)
    lugar = models.ForeignKey(Lugar, models.DO_NOTHING, db_column='lugar', blank=True, null=True)
    estado= models.ForeignKey(EstadoEvento, models.DO_NOTHING, db_column='estadoEvento',blank=True, null=True)
    imagen = models.ImageField(upload_to="eventos",null=True)

    def __str__(self):
        return self.nombre

#Trigger para asignar estado Pendiente al evento cuando se crea
@receiver(post_save, sender=Evento)
def asignar_estado_pendiente(sender, instance, created, **kwargs):
    if created:
        estado_pendiente = EstadoEvento.objects.get(estado='PENDIENTE')
        instance.estado = estado_pendiente
        instance.save()

#Trigger para desvincular relaciones
# @receiver(pre_delete, sender=Evento)
# def eliminar_tickets(sender, instance, **kwargs):
#     tickets = Ticket.object.filter(evento=instance)
#     tickets.delete()
#Trigger para crear X cantidad de tickets en base a lo que se envio en el post
# @receiver(post_save, sender=Evento)
# def crear_tickets(sender,instance,created, **kwargs):
#     if created:
#         #Obtengo el modelo Ticket
#         Ticket = apps.get_model('tickets','Ticket') 
#         cantidad_tickets = instance.cantTickets
#         for _ in range(cantidad_tickets):
#             Ticket.objects.create(evento=instance)
