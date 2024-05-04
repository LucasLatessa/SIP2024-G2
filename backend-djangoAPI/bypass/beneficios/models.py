from django.db import models

class Beneficio(models.Model):
    id_beneficio = models.AutoField(primary_key=True)
    nombre = models.TextField()
    descripcion = models.TextField()
    porcentajeDescuento = models.IntegerField(null=True, default=None, blank=True)
    codigoDescuento =models.IntegerField()
    usado = models.BooleanField()
    imagen = models.ImageField(upload_to="beneficios",null=True)
    
    def __str__(self):
        return self.nombre