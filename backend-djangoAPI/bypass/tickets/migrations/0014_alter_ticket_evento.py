# Generated by Django 5.0.4 on 2024-05-04 03:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eventos', '0009_evento_canttickets'),
        ('tickets', '0013_alter_ticket_tipo_ticket_alter_tipotickets_tipo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticket',
            name='evento',
            field=models.ForeignKey(blank=True, db_column='evento', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='eventos.evento'),
        ),
    ]