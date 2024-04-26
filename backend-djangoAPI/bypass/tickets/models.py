import datetime
from django.db import models

from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.

class Ticket(models.Model):
    id_Ticket = models.AutoField(primary_key=True)
    precioInicial = models.FloatField()
#    precios = models.ForeignKey(Precio, models.DO_NOTHING, db_column='precio', blank=True, null=True)
#    publicaciones=models.ForeignKey(Publicacion, models.DO_NOTHING, db_column='publicacion', blank=True, null=True)
#PUBLICACION Y PRECIO ARRAY DE ESAS CLASES(abajo)
    def __str__(self):
        return "TicketID:" + str(self.id_Ticket)

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
    fecha= models.DateTimeField(blank=True, null=True)
    publica = models.BooleanField(default=True)
    ticket = models.ForeignKey(Ticket, models.DO_NOTHING, db_column='ticket', blank=True, null=True)
    def __str__(self):
        return "Publicacion " + str(self.id_Publicacion)
    
#class TipoEntrada(models.Model):


#Trigger para vincular precio con el ticket una vez que se crea
@receiver(post_save, sender=Ticket)
def crear_precio(sender, instance, created, **kwargs):
    if created:
        Precio.objects.create(
                precio=instance.precioInicial,
                ticket=instance,
                fechaInicial = datetime.datetime.now()
        )
