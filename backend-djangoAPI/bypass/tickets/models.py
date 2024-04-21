from django.db import models

# Create your models here.

class Publicacion(models.Model):
    id_Publicacion = models.AutoField(primary_key=True)
    precio = models.FloatField()
    fecha= models.DateTimeField(blank=True, null=True)
    publica = models.BooleanField(default=True)
    def __str__(self):
        return self.id_Publicacion

class Precio(models.Model):
    id_Precio = models.AutoField(primary_key=True)
    precio = models.FloatField()
    fechaInicial= models.DateTimeField(blank=True, null=True)
    def __str__(self):
        return self.precio

class Ticket(models.Model):
    id_Ticket = models.AutoField(primary_key=True)
    precioInicial = models.FloatField()
#    precios = models.ForeignKey(Precio, models.DO_NOTHING, db_column='precio', blank=True, null=True)
#    publicaciones=models.ForeignKey(Publicacion, models.DO_NOTHING, db_column='publicacion', blank=True, null=True)
#PUBLICACION Y PRECIO ARRAY DE ESAS CLASES(abajo)
    precios = models.ManyToManyField(Precio, blank=True)
    publicaciones = models.ManyToManyField(Publicacion, blank=True)
    def __str__(self):
        return self.id_Ticket



