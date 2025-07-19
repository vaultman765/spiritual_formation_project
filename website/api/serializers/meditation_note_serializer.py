from rest_framework import serializers
from website.models import MeditationNote, MeditationDay
from website.api.serializers.day_serializer import MeditationDaySerializer


class MeditationNoteSerializer(serializers.ModelSerializer):
    # Accept FK on write
    meditation_day = serializers.PrimaryKeyRelatedField(
        queryset=MeditationDay.objects.all(),
        write_only=True
    )

    # Return full nested object on read
    meditation_day_full = MeditationDaySerializer(source='meditation_day', read_only=True)

    class Meta:
        model = MeditationNote
        fields = ['id', 'content', 'meditation_day', 'meditation_day_full', 'updated_at']
        read_only_fields = ['id', 'updated_at']
