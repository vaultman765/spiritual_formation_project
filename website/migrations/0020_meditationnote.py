# Generated by Django 4.2.23 on 2025-07-16 02:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("website", "0019_userjourney_is_custom"),
    ]

    operations = [
        migrations.CreateModel(
            name="MeditationNote",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("content", models.TextField(blank=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "meditation_day",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="website.meditationday",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-updated_at"],
                "unique_together": {("user", "meditation_day")},
            },
        ),
    ]
