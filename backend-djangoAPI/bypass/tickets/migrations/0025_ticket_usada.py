# Generated by Django 5.0.4 on 2024-05-27 21:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0024_alter_publicacion_fecha'),
    ]

    operations = [
        migrations.AddField(
            model_name='ticket',
            name='usada',
            field=models.BooleanField(default=False),
        ),
    ]
