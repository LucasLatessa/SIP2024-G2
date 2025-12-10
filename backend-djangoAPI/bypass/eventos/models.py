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
    cantTickets = models.IntegerField(default=0)
    cantTicketsTotal = models.IntegerField(default=0)
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
        # Asigna cantTickets a cantTicketsTotal si es una nueva instancia
        if not self.pk:  # Si el objeto es nuevo y no tiene primary key (id_Evento) asignado aún
            self.cantTicketsTotal = self.cantTickets
        # Asigna el estado "AGOTADO" si no hay más tickets disponibles
        if self.cantTickets == 0:
            estado_agotado = EstadoEvento.objects.get(estado='AGOTADO')
            self.estado = estado_agotado
        super(Evento, self).save(*args, **kwargs)
        # Revaloriza tickets según la demanda y temporalidad
        self.revalorizar_ticket()
        self.revalorizar_por_temporalidad()

    #EVENTO DE REVALORIZACION POR DISPONIBILIDAD
    def revalorizar_ticket(self):
        from tickets.models import Ticket  # Importación diferida
        # Umbrales y porcentaje de aumento
        umbral_bajo = self.cantTicketsTotal * 25 / 100 #Umbral, a partir del 25%
        porcentaje_aumento = 0.10  # 10%
        print(umbral_bajo)
        print(self.cantTicketsTotal)

        #Si supera el umbral aumento los precios
        if self.cantTickets <= umbral_bajo:
            tickets = Ticket.objects.filter(evento=self)
            for ticket in tickets:
                if ticket.precioInicial and ticket.propietario is None: 
                    #Aumento del porcentaje dado
                    print("EVENTO DE REVALORIZACION - Ticket: ", ticket.id_Ticket)
                    nuevo_precio = ticket.precioInicial * (1 + porcentaje_aumento)
                    print("precio viejo",ticket.precioInicial)
                    print("nuevo viejo",nuevo_precio)

                    Precio.objects.create(
                      ticket=ticket,
                      precio=ticket.precioInicial,
                      fechaInicial=timezone.now()
                    )

                    ticket.precioInicial = nuevo_precio
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
                print("nuevo viejo",nuevo_precio)

                Precio.objects.create(
                      ticket=ticket,
                      precio=ticket.precioInicial,
                      fechaInicial=timezone.now()
                    )
                
                ticket.precioInicial = nuevo_precio
                ticket.save()

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
