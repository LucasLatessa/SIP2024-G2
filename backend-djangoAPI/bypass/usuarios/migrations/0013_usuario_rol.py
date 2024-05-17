# Generated by Django 5.0.4 on 2024-05-16 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0012_remove_usuario_rol'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuario',
            name='rol',
            field=models.CharField(choices=[('CLIENTE', 'Cliente'), ('ADMINISTRADOR', 'Administrador'), ('PRODUCTORA', 'Productora')], default='CLIENTE', max_length=20),
        ),
    ]