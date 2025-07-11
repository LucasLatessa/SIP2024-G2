from datetime import datetime
from django.db import models

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps
from usuarios.models import Productora
import math

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
    descripcion = models.TextField(blank=True, null=True)
    imagen = models.ImageField(upload_to="eventos",blank=True, null=True)
    productora = models.ForeignKey(Productora, models.DO_NOTHING, db_column='nickname',blank=True, null=True)

    def __str__(self):
        return self.nombre
    
    def save(self, *args, **kwargs):
        super(Evento, self).save(*args, **kwargs)
        from tickets.models import Ticket
        disponibles = Ticket.objects.filter(evento=self, propietario__isnull=True).count()
        # Asigna el estado "AGOTADO" si no hay más tickets disponibles
        if disponibles == 0:
            estado_agotado = EstadoEvento.objects.get(estado='AGOTADO')
            self.estado = estado_agotado
        # Revaloriza tickets según la demanda y temporalidad
        #self.revalorizar_ticket()
        #self.revalorizar_por_temporalidad()

    
    """Metodo que aumenta el precio de los tickets restantes de un evento a medida que disminuye la disponibilidad de entradas"""
    def revalorizar_tickets_restantes(self):
        from tickets.models import Ticket

        max_aumento = 0.35  # porcentaje maximo de aumento (35%)

        # Obtener todos los tickets del evento que aun no tienen propietario
        disponibles = Ticket.objects.filter(evento=self, propietario__isnull=True)
        total = self.cantTickets
        disponibles_count = disponibles.count()

        # Si no quedan disponibles, no hacer nada
        if disponibles_count == 0:
            return

        # Calcular el aumento dinamico segun la proporcion de entradas vendidas
        # Cuanto menos disponibles, mayor el aumento
        porcentaje_aumento = (1 - (disponibles_count / total)) * max_aumento
        porcentaje_aumento = round(porcentaje_aumento, 2)  # redondear 

        print(f"Aumento aplicado: {porcentaje_aumento*100}%")

        # Aplicar el aumento a cada ticket sin propietario
        for ticket in disponibles:
            if ticket.precioInicial:
                ticket.precioInicial *= (1 + porcentaje_aumento)
                ticket.save()



    #EVENTO DE REVALORIZACION POR TEMPORALIDAD
    def guardar(evento):
        evento.save()

    def revalorizar_por_temporalidad(self):
        from tickets.models import Ticket  # Importación diferida

        hoy = datetime.now().date()
        dias_faltantes = (self.fecha - hoy).days

        #El evento ya ocurrio o es hoy
        if dias_faltantes <= 0:
            return 
        
        #Aumenta un 25% por cada semana de proximidad 
        semana_para_evento = dias_faltantes / 7
        porcentaje_aumento = 0.25 * (1/ semana_para_evento)

        #Aplico aumento a los tickets que no tienen dueño
        tickets = Ticket.objects.filter(evento=self)
        for ticket in tickets:
            if ticket.precioInicial and ticket.propietario is None:
                print("EVENTO DE REVALORIZACION POR TEMPORALIDAD - Ticket: ", ticket.id_Ticket)
                nuevo_precio = ticket.precioInicial * (1 + porcentaje_aumento)
                print("precio viejo",ticket.precioInicial)
                print("precio nuevo",nuevo_precio)
                ticket.precioInicial = nuevo_precio
                ticket.save()

#Trigger para asignar estado Pendiente al evento cuando se crea
@receiver(post_save, sender=Evento)
def asignar_estado_pendiente(sender, instance, created, **kwargs):
    if created and instance.estado is None:
        estado_pendiente = EstadoEvento.objects.get(estado='PENDIENTE')
        Evento.objects.filter(pk=instance.pk).update(estado=estado_pendiente)

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
