from django.db import models

# Create your models here.

class Usuario(models.Model):
    user_id = models.TextField(primary_key=True) #Provee AUTH0
    nickname = models.TextField() #Provee AUTH0
    nombre = models.TextField()
    apellido = models.TextField()
    correo = models.TextField() #Provee AUTH0
    creacion = models.TextField() #Provee AUTH0
    rol = models.TextField() #Provee AUTH0
    
    def __str__(self):
        return self.nombre + " " + self.apellido
    
    