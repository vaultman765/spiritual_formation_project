import json
from rest_framework import serializers
from website.models import Arc


class ArcSerializer(serializers.ModelSerializer):
    card_tags = serializers.SerializerMethodField()  # ✅ explicitly declare it

    class Meta:
        model = Arc
        fields = [
            "arc_id",
            "arc_title",
            "arc_number",
            "day_count",
            "master_day_start",
            "master_day_end",
            "anchor_image",
            "arc_summary",
            "primary_reading",
            "card_tags",  # ✅ this now matches the method below
        ]

    def get_card_tags(self, obj):
        try:
            if isinstance(obj.card_tags, list):
                return obj.card_tags
            return json.loads(obj.card_tags)
        except Exception:
            return []
