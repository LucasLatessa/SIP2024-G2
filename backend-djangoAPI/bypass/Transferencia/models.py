from django.db import models
from usuarios.models import Usuario
from tickets.models import Ticket

# Create your models here.
class Transferencia(models.Model):
    id_Transferencia = models.AutoField(primary_key=True)
    Fecha_Hora = models.DateTimeField()
    Precio = models.FloatField()
    Comprador = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='Comprador', related_name='Comprador')
    Vendedor = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='Vendedor', related_name='Vendedor')
    Ticket = models.ForeignKey(Ticket, models.DO_NOTHING)

    def __str__(self):
        return "Transferencia: " + str(self.id_Transferencia)
