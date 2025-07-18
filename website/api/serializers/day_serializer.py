from rest_framework import serializers
from website.models import MeditationDay


class DaySerializer(serializers.ModelSerializer):
    class Meta:
        model = MeditationDay
        fields = '__all__'
