# Generated by Django 5.0.4 on 2024-05-04 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0004_alter_usuario_user_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='rol',
            field=models.TextField(blank=True, null=True),
        ),
    ]
