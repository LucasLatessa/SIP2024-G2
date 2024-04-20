from django.db import models

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
    fecha= models.DateTimeField()
    lugar = models.ForeignKey(Lugar, models.DO_NOTHING)
    estado= models.ForeignKey(EstadoEvento, models.DO_NOTHING)

    def __init__(self, nombre, fecha, lugar, estado, *args, **kwargs):
        super(Evento, self).__init__(*args, **kwargs)
        self.nombre = nombre
        self.fecha = fecha
        self.lugar = lugar
        self.estado = estado

    def __str__(self):
        return self.nombre



