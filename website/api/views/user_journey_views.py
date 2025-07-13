from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from website.models import UserJourney, UserJourneyArcProgress
from website.api.serializers.user_journey_serializer import UserJourneySerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_journey_view(request):
    user = request.user

    if request.method == 'GET':
        try:
            journey = user.journey
            serializer = UserJourneySerializer(journey)
            return Response(serializer.data)
        except UserJourney.DoesNotExist:
            return Response({"detail": "No journey found."}, status=404)

    elif request.method == 'POST':
        # Delete old journey if exists
        UserJourney.objects.filter(user=user).delete()

        title = request.data.get('title', 'My Journey')
        arc_progress_data = request.data.get('arc_progress', [])

        if not arc_progress_data:
            return Response({'error': 'No arc progress data provided.'}, status=400)

        journey = UserJourney.objects.create(user=user, title=title)

        for i, arc in enumerate(arc_progress_data):
            UserJourneyArcProgress.objects.create(
                user_journey=journey,
                arc_id=arc.get('arcId'),
                arc_title=arc.get('arcTitle', ''),
                day_count=arc.get('dayCount', 1),
                current_day=arc.get('currentDay', 1),
                status=arc.get('status', 'upcoming'),
                order=i
            )

        return Response({'detail': 'Journey created successfully.'}, status=201)
