# Generated by Django 5.0.4 on 2024-05-18 02:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0014_alter_usuario_apellido'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='nombre',
            field=models.TextField(blank=True, null=True),
        ),
    ]
