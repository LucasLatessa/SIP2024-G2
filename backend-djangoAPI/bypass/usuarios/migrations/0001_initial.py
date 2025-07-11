# Generated by Django 5.0.4 on 2025-02-02 17:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('user_id', models.AutoField(primary_key=True, serialize=False)),
                ('nickname', models.TextField()),
                ('nombre', models.TextField(blank=True, null=True)),
                ('apellido', models.TextField(blank=True, null=True)),
                ('correo', models.TextField()),
                ('creacion', models.DateTimeField(auto_now_add=True, null=True)),
                ('Public_Key', models.TextField(blank=True, null=True)),
                ('Access_Token', models.TextField(blank=True, null=True)),
                ('rol', models.CharField(choices=[('CLIENTE', 'Cliente'), ('ADMINISTRADOR', 'Administrador'), ('PRODUCTORA', 'Productora')], default='CLIENTE', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Administrador',
            fields=[
                ('usuario_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='usuarios.usuario')),
                ('dni', models.CharField(blank=True, max_length=10, null=True, unique=True)),
            ],
            bases=('usuarios.usuario',),
        ),
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('usuario_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='usuarios.usuario')),
                ('dni', models.CharField(blank=True, max_length=10, null=True, unique=True)),
            ],
            bases=('usuarios.usuario',),
        ),
        migrations.CreateModel(
            name='Productora',
            fields=[
                ('usuario_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='usuarios.usuario')),
            ],
            bases=('usuarios.usuario',),
        ),
    ]
