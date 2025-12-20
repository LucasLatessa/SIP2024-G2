from datetime import datetime
from django.db import models

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps
from usuarios.models import Productora
from tickets.models import Precio
from django.utils import timezone


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
    razon = models.TextField(blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)
    hora = models.TimeField(blank=True, null=True)
    lugar = models.ForeignKey(Lugar, models.DO_NOTHING, db_column='lugar', blank=True, null=True)
    estado= models.ForeignKey(EstadoEvento, models.DO_NOTHING, db_column='estadoEvento',blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    imagen = models.ImageField(upload_to="eventos",blank=True, null=True)
    productora = models.ForeignKey(Productora, models.DO_NOTHING, db_column='nickname',blank=True, null=True)
    revalorizacion = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre
    
    def cant_tickets_total(self) -> int:
        from tickets.models import Ticket
        return Ticket.objects.filter(evento=self).count()

    def cant_tickets_disponibles(self) -> int:
        from tickets.models import Ticket
        return Ticket.objects.filter(evento=self, propietario__isnull=True).count()
    
    def save(self, *args, **kwargs):
        if not self.pk and self.estado is None:
          self.estado = EstadoEvento.objects.get(estado='PENDIENTE')
          print("self.estado", self.estado)
        super().save(*args, **kwargs)

        disponibles = self.cant_tickets_disponibles()
        if disponibles == 0:
            estado_agotado = EstadoEvento.objects.get(estado="AGOTADO")
            if self.estado_id != estado_agotado.id_Estado:
                self.estado = estado_agotado
                super().save(update_fields=["estado"])

        if self.revalorizacion:
            self.revalorizar_ticket()
            self.revalorizar_por_temporalidad()

        #EVENTO DE REVALORIZACION POR DISPONIBILIDAD
    def revalorizar_ticket(self):
        from tickets.models import Ticket 

        total = self.cant_tickets_total()
        if total <= 0:
            return
        # Umbrales y porcentaje de aumento
        disponibles = self.cant_tickets_disponibles()

        umbral_bajo = total * 25 / 100  # 25% del total
        porcentaje_aumento = 0.10       # 10%

        # Si disponibles <= 25% del total, sube el precio a los no vendidos
        if disponibles <= umbral_bajo:
            tickets = Ticket.objects.filter(evento=self, propietario__isnull=True)
            for ticket in tickets:
                if ticket.precioInicial:
                    nuevo_precio = ticket.precioInicial * (1 + porcentaje_aumento)

                    Precio.objects.create(
                        ticket=ticket,
                        precio=ticket.precioInicial,
                        fechaInicial=timezone.now(),
                        razon= 'disponibilidad'
                    )

                    ticket.precioInicial = nuevo_precio
                    ticket.save()

    #EVENTO DE REVALORIZACION POR TEMPORALIDAD

    def revalorizar_por_temporalidad(self):
        from tickets.models import Ticket

        if not self.fecha:
            return

        hoy = datetime.now().date()
        dias_faltantes = (self.fecha - hoy).days

        # Evento ya ocurriÃ³ o es hoy
        if dias_faltantes <= 0:
            return

        semana_para_evento = dias_faltantes / 7
        if semana_para_evento <= 0:
            return

        porcentaje_aumento = 0.25 * (1 / semana_para_evento)

        tickets = Ticket.objects.filter(evento=self, propietario__isnull=True)
        for ticket in tickets:
            if ticket.precioInicial:
                nuevo_precio = ticket.precioInicial * (1 + porcentaje_aumento)

                Precio.objects.create(
                    ticket=ticket,
                    precio=ticket.precioInicial,
                    fechaInicial=timezone.now(),
                    razon= 'temporalidad'
                )

                ticket.precioInicial = nuevo_precio
                ticket.save()

#Trigger para asignar estado Pendiente al evento cuando se crea
# @receiver(post_save, sender=Evento)
# def asignar_estado_pendiente(sender, instance, created, **kwargs):
#     print(instance.estado)
#     if (created and instance.estado is None) :
#         print("dentro if",instance.estado)
#         estado_pendiente = EstadoEvento.objects.get(estado='PENDIENTE')
#         instance.estado = estado_pendiente
#         instance.save(update_fields=["estado"])

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
