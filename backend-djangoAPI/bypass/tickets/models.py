import datetime
from django.db import models
import qrcode
from io import BytesIO
from django.core.files import File
from django.db.models.signals import post_save
from django.dispatch import receiver
from eventos.models import Evento
from usuarios.models import Cliente
from PIL import Image, ImageOps
from datetime import date
import os
# Create your models here.


class TipoTickets(models.Model):
    id_tipo_ticket = models.AutoField(primary_key=True)
    tipo = models.TextField()

    def __str__(self):
        return self.tipo


class Ticket(models.Model):
    id_Ticket = models.AutoField(primary_key=True)
    precioInicial = models.IntegerField(blank=True, null=True)
    evento = models.ForeignKey(Evento, models.DO_NOTHING, db_column="evento", null=True)
    propietario = models.ForeignKey(
        Cliente, on_delete=models.CASCADE, blank=True, null=True, default=None
    )  # Relación con Cliente
    tipo_ticket = models.ForeignKey(
        TipoTickets, on_delete=models.CASCADE, blank=True, null=True
    )
    qr = models.ImageField(upload_to="qr_tickets", blank=True, null=True, default=None)
    usada = models.BooleanField(default=False)
    reservado = models.BooleanField(default=False)
    #    precios = models.ForeignKey(Precio, models.DO_NOTHING, db_column='precio', blank=True, null=True)
    #    publicaciones=models.ForeignKey(Publicacion, models.DO_NOTHING, db_column='publicacion', blank=True, null=True)
    # PUBLICACION Y PRECIO ARRAY DE ESAS CLASES(abajo)

    def save(self, *args, **kwargs):
        # Cada vez que hay update
        #super().save(*args, **kwargs)
        super().save(*args, **kwargs)

    def modificarPropietario(ticket_id_str, propietario, tipo):
        try:
            ticket_id_list = ticket_id_str.split(",")
            for ticket_id in ticket_id_list:
                ticket = Ticket.objects.get(id_Ticket=ticket_id)
                nuevo_propietario = Cliente.objects.get(nickname=propietario)
                evento = Evento.objects.get(id_Evento = ticket.evento.id_Evento)

                #Otorgo el ticket al propietario y disminuyo la cantida de tickets disponibles
                ticket.propietario = nuevo_propietario
                # Generar QR
                ticket.save()
                ticket.generar_qr()
                ticket.save()
                
                if (tipo == "evento"):
                    evento = Evento.objects.get(id_Evento = ticket.evento.id_Evento)
                    Evento.guardar(evento)

        except Exception as e:
            print(e)
            print("No se pudo cargar el ticket")

    def transferir(ticket_id, propietario):
        try:
           ticket = Ticket.objects.get(id_Ticket=ticket_id)
           nuevo_propietario = Cliente.objects.get(nickname=propietario)
           #Otorgo el ticket al propietario
           ticket.propietario = nuevo_propietario
           ticket.save()
        except Exception as e:
            print(e)
            print("No se pudo transferir el ticket")


    def obtener_ticket_precio(tipo_ticket, evento):
        tipo_ticket = TipoTickets.objects.get(tipo=tipo_ticket)

        ticket = Ticket.objects.filter(tipo_ticket=tipo_ticket, evento=evento).last()
        precio = ticket.precioInicial

        return precio

    # Genero el QR del ticket
    def generar_qr(self):
        evento = self.evento
        propietario = self.propietario

        # Creo el QR
        qr_input = f"{evento.id_Evento}-{self.id_Ticket}-"
        if propietario:
            qr_input += f"{propietario.dni}"
        else:
            qr_input += "NULL"

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_input)
        qr.make(fit=True)
        img = qr.make_image(fill="black", back_color="white").convert("RGB")

        # Invertir colores del QR (negro a blanco y blanco a negro)
        img = ImageOps.invert(img)

        # Convertir la imagen a modo RGBA para agregar transparencia
        img = img.convert("RGBA")
        datas = img.getdata()

        # Reemplazar el color negro con transparencia
        new_data = []
        for item in datas:
            # Encontrar todos los píxeles negros
            if item[:3] == (0, 0, 0):
                # Reemplazarlos por transparente
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)  # Dejar los píxeles blancos intactos

        img.putdata(new_data)
        filename = f"ticket_{self.id_Ticket}.png"
        # Eliminar el archivo existente si ya está guardado
        if self.qr:
            if os.path.isfile(self.qr.path):
                os.remove(self.qr.path)

        # Guardo en el modelo
        buffer = BytesIO()
        img.save(buffer, format="PNG")

        self.qr.save(filename, File(buffer), save=False)

    def __str__(self):
        return f"TicketID: {self.id_Ticket}"


class Precio(models.Model):
    id_Precio = models.AutoField(primary_key=True)
    precio = models.FloatField()
    fechaInicial = models.DateTimeField(blank=True, null=True)
    ticket = models.ForeignKey(
        Ticket, models.DO_NOTHING, db_column="ticket", blank=True, null=True
    )

    def __str__(self):
        return "Precio: " + str(self.precio)


class Publicacion(models.Model):
    id_Publicacion = models.AutoField(primary_key=True)
    precio = models.FloatField()
    fecha = models.DateField(default=date.today, blank=True, null=True)
    publica = models.BooleanField(default=True)
    ticket = models.ForeignKey(
        Ticket, models.DO_NOTHING, db_column="ticket", blank=True, null=True
    )

    def __str__(self):
        return "Publicacion " + str(self.id_Publicacion)


    def modificarPublicado(publi_id):
        try:
            publicacion = Publicacion.objects.get(id_Publicacion=publi_id)
            publicacion.publica = False

            publicacion.save()
        except:
            print("No se pudo eliminar publicacion")

# class TipoEntrada(models.Model):


# Trigger para vincular precio con el ticket una vez que se crea
# @receiver(post_save, sender=Ticket)
# def crear_precio(sender, instance, created, **kwargs):
#     if created:
#         Precio.objects.create(
#                 precio=instance.precioInicial,
#                 ticket=instance,
#                 fechaInicial = datetime.datetime.now()
#         )
