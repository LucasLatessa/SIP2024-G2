# Generated by Django 5.0.4 on 2024-04-20 05:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eventos', '0003_remove_evento_fecha'),
    ]

    operations = [
        migrations.AlterField(
            model_name='evento',
            name='estado',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='eventos.estadoevento'),
        ),
        migrations.AlterField(
            model_name='evento',
            name='lugar',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='eventos.lugar'),
        ),
    ]