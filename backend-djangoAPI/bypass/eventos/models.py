from datetime import datetime
from django.db import models

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps
from usuarios.models import Productora
from tickets.models import Precio, Ticket
from django.utils import timezone
from django.db import transaction

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

    fecha = models.DateField(blank=True, null=True)
    hora = models.TimeField(blank=True, null=True)
    lugar = models.ForeignKey(
        Lugar, models.DO_NOTHING, db_column="lugar", blank=True, null=True
    )
    estado = models.ForeignKey(
        EstadoEvento, models.DO_NOTHING, db_column="estadoEvento", blank=True, null=True
    )
    descripcion = models.TextField(blank=True, null=True)
    imagen = models.ImageField(upload_to="eventos", blank=True, null=True)
    productora = models.ForeignKey(
        Productora, models.DO_NOTHING, db_column="nickname", blank=True, null=True
    )
    revalorizacion = models.BooleanField(default=True)
    ultima_revalorizacion = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.nombre

    def cant_tickets_total(self) -> int:
        from tickets.models import Ticket

        return Ticket.objects.filter(evento=self).count()

    def cant_tickets_disponibles(self) -> int:
        from tickets.models import Ticket

        return Ticket.objects.filter(evento=self, propietario__isnull=True).count()

    def save(self, *args, **kwargs):
        print("save evento", self)
        if not self.pk and self.estado is None:
            self.estado = EstadoEvento.objects.get(estado="PENDIENTE")
            print("self.estado", self.estado)
        super().save(*args, **kwargs)

        disponibles = self.cant_tickets_disponibles()
        if disponibles == 0:
            estado_agotado = EstadoEvento.objects.get(estado="AGOTADO")
            if self.estado_id != estado_agotado.id_Estado:
                self.estado = estado_agotado
                super().save(update_fields=["estado"])
                
        self.revalorizar_tickets()


    def revalorizar_tickets(self):
        hoy = timezone.localdate()  # fecha local

        # =========================
        # SOLO 1 VEZ AL DÍA
        # =========================
        if self.ultima_revalorizacion == hoy:
            return

        total = self.cant_tickets_total()
        if total <= 0:
            return

        disponibles = self.cant_tickets_disponibles()
        porcentaje_total = 0.0
        razones = []

        # =========================
        # REVALORIZACIÓN POR DISPONIBILIDAD
        # (umbral bajo 25% => +10%)
        # =========================
        umbral_bajo = total * 25 / 100
        if disponibles <= umbral_bajo:
            porcentaje_total += 0.10
            razones.append("disponibilidad")

        # =========================
        # REVALORIZACIÓN POR TEMPORALIDAD (SUAVE)
        # +5% por cada día, desde el día 7 antes del evento
        # 7 días -> +5%, 6 días -> +10%, ..., 1 día -> +35%
        # =========================
        if self.fecha:
            dias_faltantes = (self.fecha - hoy).days

            if 1 <= dias_faltantes <= 7:
                dias_en_ventana = 8 - dias_faltantes  # 7->1, 6->2, ..., 1->7
                porcentaje_temporalidad = 0.05 * dias_en_ventana
                porcentaje_total += porcentaje_temporalidad
                razones.append("temporalidad")

        # Marcamos que hoy ya se evaluó (aunque no suba nada), para que no se reintente.
        if porcentaje_total <= 0:
            self.ultima_revalorizacion = hoy
            self.save(update_fields=["ultima_revalorizacion"])
            return

        razon_final = " + ".join(razones)

        # =========================
        # APLICAR REVALORIZACIÓN
        # =========================
        with transaction.atomic():
            # Re-chequeo dentro de la transacción (evita doble ejecución por concurrencia)
            self.refresh_from_db(fields=["ultima_revalorizacion"])
            if self.ultima_revalorizacion == hoy:
                return

            tickets = Ticket.objects.filter(evento=self, propietario__isnull=True)

            for ticket in tickets:
                if not ticket.precioInicial:
                    continue

                precio_anterior = ticket.precioInicial
                nuevo_precio = precio_anterior * (1 + porcentaje_total)

                Precio.objects.create(
                    ticket=ticket,
                    precio=precio_anterior,
                    fechaInicial=timezone.now(),
                    razon=razon_final,
                )

                ticket.precioInicial = nuevo_precio
                ticket.save(update_fields=["precioInicial"])

            self.ultima_revalorizacion = hoy
            self.save(update_fields=["ultima_revalorizacion"])

            # EVENTO DE REVALORIZACION POR DISPONIBILIDAD

    def revalorizar_ticket(self):
        from tickets.models import Ticket

        total = self.cant_tickets_total()
        if total <= 0:
            return
        # Umbrales y porcentaje de aumento
        disponibles = self.cant_tickets_disponibles()

        umbral_bajo = total * 25 / 100  # 25% del total
        porcentaje_aumento = 0.10  # 10%

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
                        razon="disponibilidad",
                    )

                    ticket.precioInicial = nuevo_precio
                    ticket.save()

    # EVENTO DE REVALORIZACION POR TEMPORALIDAD

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
                    razon="temporalidad",
                )

                ticket.precioInicial = nuevo_precio
                ticket.save()


# Trigger para asignar estado Pendiente al evento cuando se crea
# @receiver(post_save, sender=Evento)
# def asignar_estado_pendiente(sender, instance, created, **kwargs):
#     print(instance.estado)
#     if (created and instance.estado is None) :
#         print("dentro if",instance.estado)
#         estado_pendiente = EstadoEvento.objects.get(estado='PENDIENTE')
#         instance.estado = estado_pendiente
#         instance.save(update_fields=["estado"])

# Trigger para desvincular relaciones
# @receiver(pre_delete, sender=Evento)
# def eliminar_tickets(sender, instance, **kwargs):
#     tickets = Ticket.object.filter(evento=instance)
#     tickets.delete()
# Trigger para crear X cantidad de tickets en base a lo que se envio en el post
# @receiver(post_save, sender=Evento)
# def crear_tickets(sender,instance,created, **kwargs):
#     if created:
#         #Obtengo el modelo Ticket
#         Ticket = apps.get_model('tickets','Ticket')
#         cantidad_tickets = instance.cantTickets
#         for _ in range(cantidad_tickets):
#             Ticket.objects.create(evento=instance)
