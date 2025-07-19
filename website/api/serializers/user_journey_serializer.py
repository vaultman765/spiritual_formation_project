from rest_framework import serializers
from website.models import UserJourney, UserJourneyArcProgress


class UserJourneyArcProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserJourneyArcProgress
        fields = ['arc_id', 'arc_title', 'current_day', 'status', 'order', 'day_count']


class UserJourneySerializer(serializers.ModelSerializer):
    arc_progress = UserJourneyArcProgressSerializer(many=True, source='arc_progress_items')

    class Meta:
        model = UserJourney
        fields = [
            'id', 'title', 'is_active', 'completed_on',
            'created_at', 'updated_at', 'arc_progress',
            'is_custom'
        ]
        read_only_fields = ['is_active', 'completed_on', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Pop nested arc_progress_items safely
        arc_progress_data = validated_data.pop('arc_progress_items', [])

        # Prevent double-passing user
        validated_data.pop('user', None)

        # Create the journey with the authenticated user
        journey = UserJourney.objects.create(
            user=self.context['request'].user,
            is_custom=True,  # Default to True for custom journeys
            **validated_data
        )

        # Create nested arc progress entries
        for arc in arc_progress_data:
            UserJourneyArcProgress.objects.create(user_journey=journey, **arc)

        return journey
