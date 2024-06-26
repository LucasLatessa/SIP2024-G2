# Generated by Django 5.0.4 on 2024-05-04 03:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eventos', '0009_evento_canttickets'),
        ('tickets', '0018_alter_ticket_precioinicial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticket',
            name='evento',
            field=models.ForeignKey(db_column='evento', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='eventos.evento'),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='precioInicial',
            field=models.FloatField(),
        ),
    ]
