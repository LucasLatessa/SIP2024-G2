# Generated by Django 5.0.4 on 2024-05-16 18:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0013_usuario_rol'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='apellido',
            field=models.TextField(blank=True, null=True),
        ),
    ]