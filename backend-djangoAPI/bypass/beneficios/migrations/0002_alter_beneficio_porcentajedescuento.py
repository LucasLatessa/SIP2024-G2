# Generated by Django 5.0.4 on 2024-05-03 19:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('beneficios', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='beneficio',
            name='porcentajeDescuento',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
    ]
