from django.db import models

# Create your models here.

class Usuario(models.Model):
    user_id = models.AutoField(primary_key=True) #Provee AUTH0
    nickname = models.TextField() #Provee AUTH0
    nombre = models.TextField() #Provee AUTH0
    apellido = models.TextField()
    correo = models.TextField() #Provee AUTH0
    creacion = models.DateTimeField(blank=True, null=True)
    rol = models.TextField()
    
    def __str__(self):
        return self.nombre + " " + self.apellido

class Cliente(Usuario):#especializacion
    dni = models.CharField(max_length=10)

class Administrador(Usuario):#especializacion
    dni = models.CharField(max_length=10)

class Productora(Usuario):#especializacion
    pass  