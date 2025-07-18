from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from website.models import UserJourney, UserJourneyArcProgress
from website.api.serializers.user_journey_serializer import UserJourneySerializer


class UserJourneyViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        try:
            journey = UserJourney.objects.get(user=request.user, is_active=True)
        except UserJourney.DoesNotExist:
            return Response(None)

        serializer = UserJourneySerializer(journey)
        return Response(serializer.data)

    def create(self, request):
        # Archive existing journey if one exists
        UserJourney.objects.filter(user=request.user, is_active=True).update(is_active=False)

        serializer = UserJourneySerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"], url_path="archive")
    def archive(self, request):
        try:
            journey = UserJourney.objects.get(user=request.user, is_active=True)
            journey.is_active = False
            journey.completed_on = timezone.now()
            journey.save()
            return Response({'detail': 'Journey archived successfully.'})
        except UserJourney.DoesNotExist:
            return Response({'error': 'No active journey found.'}, status=404)

    @action(detail=True, methods=["post"], url_path="restore")
    def restore(self, request, pk=None):
        try:
            past_journey = UserJourney.objects.get(pk=pk, user=request.user, is_active=False)
        except UserJourney.DoesNotExist:
            return Response({'error': 'Past journey not found.'}, status=404)

        try:
            current = UserJourney.objects.get(user=request.user, is_active=True)
            current.is_active = False
            current.completed_on = None
            current.save()
        except UserJourney.DoesNotExist:
            pass

        past_journey.is_active = True
        past_journey.completed_on = None
        past_journey.save()

        return Response(UserJourneySerializer(past_journey).data)

    @action(detail=False, methods=["post"], url_path="restart")
    def restart(self, request):
        try:
            journey = UserJourney.objects.get(user=request.user, is_active=True)
        except UserJourney.DoesNotExist:
            return Response({'error': 'No active journey found.'}, status=404)

        arc_items = journey.arc_progress_items.all().order_by('order')
        for index, arc in enumerate(arc_items):
            arc.current_day = 1
            arc.status = 'in_progress' if index == 0 else 'upcoming'
            arc.save()

        return Response({'detail': 'Journey restarted from the beginning.'})

    @action(detail=False, methods=["post"], url_path="skip-day")
    def skip_day(self, request):
        try:
            journey = UserJourney.objects.get(user=request.user, is_active=True)
            current_arc = journey.arc_progress_items.filter(status='in_progress').first()
            if not current_arc:
                return Response({'error': 'No arc currently in progress.'}, status=400)

            if current_arc.current_day < current_arc.day_count:
                current_arc.current_day += 1
                current_arc.save()
                return Response({'detail':
                                 f"Skipped to day {current_arc.current_day} of arc '{current_arc.arc_title}'."})
            elif current_arc.current_day == current_arc.day_count:
                # If at the last day, mark as completed and move to next arc if exists
                current_arc.status = 'completed'
                current_arc.save()

                if current_arc.order == journey.arc_progress_items.count() - 1:
                    return Response({'detail': "Completed all arcs in this journey."})

                # Move to next arc
                next_arc = journey.arc_progress_items.filter(order=current_arc.order + 1).first()
                if next_arc:
                    next_arc.status = 'in_progress'
                    next_arc.current_day = 1
                    next_arc.save()
                    return Response({'detail':
                                     f"Completed arc '{current_arc.arc_title}', now starting '{next_arc.arc_title}'."})
            else:
                return Response({'detail':
                                 "Already at final day and final arc. Consider skipping the arc instead."}, status=400)

        except UserJourney.DoesNotExist:
            return Response({'error': 'No active journey found.'}, status=404)

    @action(detail=False, methods=["post"], url_path="skip-arc")
    def skip_arc(self, request):
        try:
            journey = UserJourney.objects.get(user=request.user, is_active=True)
            arc_items = journey.arc_progress_items.all().order_by('order')

            for index, arc in enumerate(arc_items):
                if arc.status == 'in_progress':
                    arc.status = 'skipped'
                    arc.save()

                    # Advance to next arc if exists
                    if index + 1 < len(arc_items):
                        next_arc = arc_items[index + 1]
                        next_arc.status = 'in_progress'
                        next_arc.save()
                        return Response({'detail':
                                         f"Skipped arc '{arc.arc_title}', now starting '{next_arc.arc_title}'."})
                    else:
                        return Response({'detail': f"Skipped final arc '{arc.arc_title}'. No more arcs left."})

            return Response({'error': 'No arc currently in progress.'}, status=400)

        except UserJourney.DoesNotExist:
            return Response({'error': 'No active journey found.'}, status=404)

    @action(detail=False, methods=["post"], url_path="complete")
    def complete_journey(self, request):
        try:
            journey = UserJourney.objects.get(user=request.user, is_active=True)
        except UserJourney.DoesNotExist:
            return Response({'error': 'No active journey found.'}, status=404)

        arcs = journey.arc_progress_items.all()
        for arc in arcs:
            if arc.status in ['in_progress', 'upcoming']:
                arc.status = 'completed'
                arc.current_day = arc.day_count
                arc.save()

        journey.is_active = False
        journey.completed_on = timezone.now()
        journey.save()

        return Response({'detail': 'Journey completed and archived.'})

    def partial_update(self, request, pk=None):
        try:
            journey = UserJourney.objects.get(pk=pk, user=request.user)
        except UserJourney.DoesNotExist:
            return Response({'error': 'Journey not found.'}, status=status.HTTP_404_NOT_FOUND)

        arc_progress_data = request.data.get('arc_progress', [])

        if arc_progress_data:
            # Delete old arc progress items
            journey.arc_progress_items.all().delete()

            # Create new ones from provided arc_progress
            for arc in arc_progress_data:
                UserJourneyArcProgress.objects.create(
                    user_journey=journey,
                    arc_id=arc['arc_id'],
                    arc_title=arc['arc_title'],
                    order=arc['order'],
                    day_count=arc['day_count'],
                    current_day=1,  # Reset all to Day 1
                    status='in_progress' if arc['order'] == 0 else 'upcoming',
                )

        # Update title if provided
        if 'title' in request.data:
            journey.title = request.data['title']
            journey.save()

        return Response(UserJourneySerializer(journey).data)

    @action(detail=False, methods=["post"], url_path="complete-day")
    def complete_day(self, request):
        try:
            journey = UserJourney.objects.get(user=request.user, is_active=True)
            arc = journey.arc_progress_items.get(status="in_progress")
        except UserJourney.DoesNotExist:
            return Response({"error": "No active journey found."}, status=404)
        except UserJourneyArcProgress.DoesNotExist:
            return Response({"error": "No in-progress arc found."}, status=404)

        # Advance within arc
        if arc.current_day < arc.day_count:
            arc.current_day += 1
            arc.save()
            return Response({
                "detail": f"Day {arc.current_day - 1} marked complete. Now on Day {arc.current_day}.",
                "arc_complete": False,
                "journey_complete": False,
                "arc_title": arc.arc_title,
                "journey_title": journey.title,
            })

        elif arc.current_day == arc.day_count:
            # If at the last day, mark arc as completed
            arc.status = "completed"
            arc.save()

            # Check if there is a next arc to start
            next_arc = journey.arc_progress_items.filter(order=arc.order + 1).first()
            if next_arc:
                next_arc.status = "in_progress"
                next_arc.current_day = 1
                next_arc.save()
                return Response({
                    "detail": f"Day {arc.current_day - 1} marked complete. Now on Day {arc.current_day}.",
                    "arc_complete": True,
                    "journey_complete": False,
                    "arc_title": arc.arc_title,
                    "journey_title": journey.title,
                })
            else:
                # No next arc — journey complete
                journey.is_active = False
                journey.completed_on = timezone.now()
                journey.save()
                return Response({
                    "detail": f"Day {arc.current_day - 1} marked complete. Now on Day {arc.current_day}.",
                    "arc_complete": True,
                    "journey_complete": True,
                    "arc_title": arc.arc_title,
                    "journey_title": journey.title,
                })

    def destroy(self, request, pk=None):
        try:
            journey = UserJourney.objects.get(pk=pk, user=request.user)
            journey.delete()
            return Response({'detail': 'Journey deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except UserJourney.DoesNotExist:
            return Response({'error': 'Journey not found.'}, status=status.HTTP_404_NOT_FOUND)


class UserJourneyListAllView(ListAPIView):
    serializer_class = UserJourneySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserJourney.objects.filter(user=self.request.user).order_by('-created_at')
