# website/views.py
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from website.models import PageView


def get_client_ip(request: HttpRequest):
    # Respect App Runner/Envoy forwarded chain
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        # First in the list is original client
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def track(request: HttpRequest):
    if request.method != "POST":
        return JsonResponse({"ok": False, "error": "POST only"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"ok": False, "error": "invalid JSON"}, status=400)

    # Required
    event_type = data.get("type")
    path = data.get("path")
    visitor_id = data.get("visitorId")

    if event_type != "pageview" or not path or not visitor_id:
        return JsonResponse({"ok": False, "error": "missing fields"}, status=400)

    # Optional
    title = data.get("title") or ""
    ref = data.get("referrer") or ""
    tz = data.get("tz") or ""
    screen = data.get("screen") or {}
    user_id = data.get("userId")

    user = None
    if user_id:
        # If your API authenticates requests, you could also use request.user
        # For now we accept a numeric id if you pass it from frontend
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            user = None

    PageView.objects.create(
        created_at=timezone.now(),
        path=path,
        title=title[:512],
        referrer=ref[:1024],
        visitor_id=str(visitor_id)[:64],
        user=user,
        user_agent=(request.META.get("HTTP_USER_AGENT") or "")[:1024],
        ip=get_client_ip(request),
        screen_w=screen.get("w"),
        screen_h=screen.get("h"),
        tz=tz[:128],
    )

    return JsonResponse({"ok": True})
