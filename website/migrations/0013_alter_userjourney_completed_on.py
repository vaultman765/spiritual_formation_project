# Generated by Django 4.2.23 on 2025-07-13 19:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("website", "0012_userjourney_completed_on_userjourney_is_active"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userjourney",
            name="completed_on",
            field=models.DateField(blank=True, null=True),
        ),
    ]
