from rest_framework import serializers
from website.models import MeditationNote


class MeditationNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeditationNote
        fields = ['id', 'meditation_day', 'content', 'updated_at']
        read_only_fields = ['id', 'updated_at']
