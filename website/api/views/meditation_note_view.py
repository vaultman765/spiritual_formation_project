from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from website.models import MeditationNote
from website.api.serializers.meditation_note_serializer import MeditationNoteSerializer

class MeditationNoteView(viewsets.ModelViewSet):
    serializer_class = MeditationNoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'delete', 'head', 'options']

    def get_queryset(self):
        queryset = MeditationNote.objects.filter(user=self.request.user)

        day = self.request.query_params.get('day')
        if day is not None:
            queryset = queryset.filter(meditation_day=day)

        return queryset
    
    def perform_list(self, serializer):
        day = self.request.query_params.get('day')

        if day is not None:
            note = MeditationNote.objects.filter(user=self.request.user, meditation_day=day).first()
            if note:
                serializer = self.get_serializer(note)
                return Response(serializer.data)
            return Response({"detail": "No note found for this day."}, status=status.HTTP_404_NOT_FOUND)

        raise ValidationError("Meditation day ID is required.")

    def perform_create(self, serializer):
        # Prevent duplicate notes for the same day/user
        meditation_day = serializer.validated_data.get('meditation_day')
        if MeditationNote.objects.filter(user=self.request.user, meditation_day=meditation_day).exists():
            raise ValidationError("Note already exists for this day.")

        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        # Ensure note being updated still belongs to the user
        instance = serializer.instance
        if instance.user != self.request.user:
            raise ValidationError("You cannot edit a note that isn't yours.")
        serializer.save()

    @action(detail=False, methods=['delete'], url_path='by-day')
    def delete_by_day(self, request):
        day = request.query_params.get('day')
        if not day:
            return Response({"error": "Day is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            note = MeditationNote.objects.get(meditation_day=day, user=request.user)
            note.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except MeditationNote.DoesNotExist:
            return Response({"error": "Note not found."}, status=status.HTTP_404_NOT_FOUND)