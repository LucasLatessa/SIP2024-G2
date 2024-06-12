from django.db import models

# Create your models here.

class Usuario(models.Model):
    ROL_CHOICES = [
            ('CLIENTE', 'Cliente'),
            ('ADMINISTRADOR', 'Administrador'),
            ('PRODUCTORA', 'Productora'),
        ]

    user_id = models.AutoField(primary_key=True) #Provee AUTH0
    nickname = models.TextField() #Provee AUTH0
    nombre = models.TextField(blank=True, null=True) #Provee AUTH0
    apellido = models.TextField(blank=True, null=True)
    correo = models.TextField() #Provee AUTH0
    creacion = models.DateTimeField(blank=True, null=True,auto_now_add=True) 
    Public_Key = models.TextField(blank=True, null=True)
    Access_Token = models.TextField(blank=True, null=True)  
    rol = models.CharField(max_length=20, choices=ROL_CHOICES, default='CLIENTE')
    
    def __str__(self):
        return self.nombre + " " + self.apellido

class Cliente(Usuario):#especializacion
    dni = models.CharField(max_length=10, unique=True, blank=True, null=True)

class Administrador(Usuario):#especializacion
    dni = models.CharField(max_length=10, unique=True,blank=True, null=True)

class Productora(Usuario):#especializacion
    pass  