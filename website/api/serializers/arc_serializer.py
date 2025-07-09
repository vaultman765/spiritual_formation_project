from rest_framework import serializers
from website.models import Arc

class ArcSerializer(serializers.ModelSerializer):
    class Meta:
        model = Arc
        fields = '__all__'
