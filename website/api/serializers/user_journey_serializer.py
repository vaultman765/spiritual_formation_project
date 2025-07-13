from rest_framework import serializers
from website.models import UserJourney, UserJourneyArcProgress


class UserJourneyArcProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserJourneyArcProgress
        fields = ['arc_id', 'arc_title', 'day_count', 'current_day', 'status', 'order']


class UserJourneySerializer(serializers.ModelSerializer):
    arc_progress = UserJourneyArcProgressSerializer(many=True, source='arc_progress_items', read_only=True)

    class Meta:
        model = UserJourney
        fields = ['id', 'title', 'arc_progress']
