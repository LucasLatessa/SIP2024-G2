# Generated by Django 5.0.4 on 2024-05-01 20:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eventos', '0008_evento_hora_alter_evento_fecha'),
        ('tickets', '0002_remove_ticket_precios_remove_ticket_publicaciones_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='ticket',
            name='evento',
            field=models.ForeignKey(blank=True, db_column='evento', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='eventos.evento'),
        ),
    ]
