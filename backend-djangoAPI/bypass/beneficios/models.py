from django.db import models
from eventos.models import Evento

class Beneficio(models.Model):
    id_beneficio = models.AutoField(primary_key=True)
    evento = models.ForeignKey(Evento, models.DO_NOTHING, db_column="evento", null=True)
    nombre = models.TextField()
    descripcion = models.TextField()
    porcentajeDescuento = models.IntegerField(null=True, default=None, blank=True)
    codigoDescuento =models.IntegerField()
    usado = models.BooleanField()
    imagen = models.ImageField(upload_to="beneficios",null=True)
    
    def __str__(self):
        return self.nombre