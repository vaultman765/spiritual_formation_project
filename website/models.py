from django.db import models


# --- Core Arc Model ---
class Arc(models.Model):
    arc_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=255)
    day_count = models.PositiveIntegerField()
    liturgical_fit = models.CharField(max_length=255, blank=True)
    journey_stage = models.CharField(max_length=255, blank=True)
    anchor_image = models.TextField(blank=True)
    primary_reading_title = models.CharField(max_length=255, blank=True)
    primary_reading_reference = models.CharField(max_length=255, blank=True)
    primary_reading_url = models.URLField(blank=True)

    def __str__(self):
        debug_str = f"Arc __str__ called: {self.arc_id} – {self.title}"
        print(debug_str)
        return f"{self.arc_id} – {self.title}"


# --- Tag Model ---
class Tag(models.Model):
    CATEGORY_CHOICES = [
        ("doctrinal", "Doctrinal"),
        ("virtue", "Virtue"),
        ("mystical", "Mystical"),
        ("liturgical", "Liturgical"),
        ("typological", "Typological"),
        ("thematic", "Thematic"),
        ("structural", "Structural"),
    ]
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)

    def __str__(self):
        print(f"Tag __str__ called: {self.name} ({self.category})")
        return self.name


# --- Arc Tags Many-to-Many ---
class ArcTag(models.Model):
    arc = models.ForeignKey(Arc, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    def __str__(self):
        debug_str = f"ArcTag __str__ called: Arc={self.arc.arc_id}, Tag={self.tag.name}"
        print(debug_str)
        return debug_str


# --- Meditation Day Model ---
class MeditationDay(models.Model):
    day_number = models.PositiveIntegerField(unique=True)
    arc = models.ForeignKey(Arc, on_delete=models.CASCADE)
    arc_day = models.PositiveIntegerField()
    anchor_image = models.TextField(blank=True)
    primary_reading_title = models.CharField(max_length=255, blank=True)
    primary_reading_reference = models.CharField(max_length=255, blank=True)
    primary_reading_url = models.URLField(blank=True)
    meditative_point_1 = models.TextField()
    meditative_point_2 = models.TextField(blank=True)
    meditative_point_3 = models.TextField(blank=True)
    ejaculatory_prayer = models.TextField()
    colloquy = models.TextField()
    resolution = models.TextField(blank=True)

    def __str__(self):
        debug_str = f"MeditationDay __str__ called: Day {self.day_number} (Arc {self.arc.arc_id} – Day {self.arc_day})"
        print(debug_str)
        return f"Day {self.day_number} (Arc {self.arc.arc_id} – Day {self.arc_day})"


# --- Day Tags Many-to-Many ---
class DayTag(models.Model):
    day = models.ForeignKey(MeditationDay, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    def __str__(self):
        debug_str = (
            f"DayTag __str__ called: Day={self.day.day_number}, Tag={self.tag.name}"
        )
        print(debug_str)
        return debug_str


# --- Secondary Readings ---
class SecondaryReading(models.Model):
    day = models.ForeignKey(
        MeditationDay, on_delete=models.CASCADE, related_name="secondary_readings"
    )
    title = models.CharField(max_length=255)
    reference = models.CharField(max_length=255, blank=True)
    url = models.URLField(blank=True)

    def __str__(self):
        debug_str = f"SecondaryReading __str__ called: {self.title}"
        print(debug_str)
        return self.title
