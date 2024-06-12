# Generated by Django 5.0.4 on 2024-06-11 03:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('beneficios', '0003_beneficio_imagen'),
        ('eventos', '0012_alter_evento_imagen'),
    ]

    operations = [
        migrations.AddField(
            model_name='beneficio',
            name='evento',
            field=models.ForeignKey(db_column='evento', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='eventos.evento'),
        ),
    ]
