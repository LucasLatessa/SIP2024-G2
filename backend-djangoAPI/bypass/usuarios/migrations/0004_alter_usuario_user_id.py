# Generated by Django 4.2.11 on 2024-04-28 03:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0003_administrador_cliente_productora'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='user_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]