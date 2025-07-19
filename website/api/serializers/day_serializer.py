from rest_framework import serializers
from website.models import MeditationDay


class MeditationDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = MeditationDay
        fields = '__all__'
