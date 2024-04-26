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
    fecha= models.DateTimeField(blank=True, null=True)
    lugar = models.ForeignKey(Lugar, models.DO_NOTHING, db_column='lugar', blank=True, null=True)
    estado= models.ForeignKey(EstadoEvento, models.DO_NOTHING, db_column='estadoEvento',blank=True, null=True)

    def __str__(self):
        return self.nombre



