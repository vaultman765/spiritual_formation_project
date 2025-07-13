from rest_framework import serializers
from website.models import UserJourney


class UserJourneySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserJourney
        fields = ['id', 'title', 'arc_progress']
