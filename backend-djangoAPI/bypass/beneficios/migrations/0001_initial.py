# Generated by Django 5.0.4 on 2025-02-02 17:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('eventos', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Beneficio',
            fields=[
                ('id_beneficio', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.TextField()),
                ('descripcion', models.TextField()),
                ('porcentajeDescuento', models.IntegerField(blank=True, default=None, null=True)),
                ('codigoDescuento', models.IntegerField()),
                ('usado', models.BooleanField()),
                ('imagen', models.ImageField(null=True, upload_to='beneficios')),
                ('vigente', models.BooleanField(default=True)),
                ('evento', models.ForeignKey(db_column='evento', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='eventos.evento')),
            ],
        ),
    ]
