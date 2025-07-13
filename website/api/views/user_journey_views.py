from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from website.models import UserJourney
from website.api.serializers.user_journey_serializer import UserJourneySerializer
from django.views.decorators.csrf import csrf_exempt


class UserJourneyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            journey = request.user.journey
            serializer = UserJourneySerializer(journey)
            return Response(serializer.data)
        except UserJourney.DoesNotExist:
            return Response({"detail": "No journey found."}, status=404)

    def post(self, request):
        journey = UserJourney.objects.create(
            user=request.user,
            title=request.data.get("title", "My Journey with Ignation Mental Prayer"),
            arc_progress=request.data.get("arc_progress", []),
        )
        serializer = UserJourneySerializer(journey)
        return Response(serializer.data)

    @csrf_exempt
    def delete(self, request):
        request.user.journey.delete()
        return Response({"detail": "Journey deleted."})
