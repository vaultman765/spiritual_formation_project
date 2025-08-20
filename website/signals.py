from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.utils import timezone


@receiver(user_logged_in)
def update_last_login(sender, user, request, **kwargs):
    # Defensive: ensure we persist any custom flows that might bypass the built-in update
    user.last_login = timezone.now()
    user.save(update_fields=["last_login"])
