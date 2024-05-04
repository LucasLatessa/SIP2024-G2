# Generated by Django 5.0.4 on 2024-05-04 01:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0012_alter_tipotickets_tipo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticket',
            name='tipo_ticket',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tickets.tipotickets'),
        ),
        migrations.AlterField(
            model_name='tipotickets',
            name='tipo',
            field=models.TextField(),
        ),
    ]
