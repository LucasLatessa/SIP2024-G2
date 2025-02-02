# Generated by Django 5.0.4 on 2025-02-02 17:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('usuarios', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EstadoEvento',
            fields=[
                ('id_Estado', models.AutoField(primary_key=True, serialize=False)),
                ('estado', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Lugar',
            fields=[
                ('id_Lugar', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.TextField()),
                ('direccion', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Evento',
            fields=[
                ('id_Evento', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.TextField()),
                ('cantTickets', models.IntegerField(default=0)),
                ('cantTicketsTotal', models.IntegerField(default=0)),
                ('fecha', models.DateField(blank=True, null=True)),
                ('hora', models.TimeField(blank=True, null=True)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('imagen', models.ImageField(blank=True, null=True, upload_to='eventos')),
                ('estado', models.ForeignKey(blank=True, db_column='estadoEvento', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='eventos.estadoevento')),
                ('productora', models.ForeignKey(blank=True, db_column='nickname', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='usuarios.productora')),
                ('lugar', models.ForeignKey(blank=True, db_column='lugar', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='eventos.lugar')),
            ],
        ),
    ]
