from django.db import models


# --- Core Arc Model ---

class Arc(models.Model):
    arc_id = models.CharField(max_length=100, unique=True)
    arc_title = models.TextField()
    arc_number = models.PositiveIntegerField()
    day_count = models.PositiveIntegerField()
    # from master_day_range: {start, end}
    master_day_start = models.PositiveIntegerField()
    master_day_end = models.PositiveIntegerField()

    # from arc_metadata.yaml (can be multiline string)
    anchor_image = models.TextField()
    primary_reading = models.TextField()

    class Meta:
        ordering = ["arc_number"]

    # note: arc-level tags are handled via ArcTag below
    def __str__(self):
        return f"{self.arc_number}\n{self.arc_title}\n({self.arc_id})"


# --- Meditation Day Model ---
class MeditationDay(models.Model):
    master_day_number = models.PositiveIntegerField(unique=True)
    arc = models.ForeignKey("Arc", on_delete=models.CASCADE)
    arc_day_number = models.PositiveIntegerField()

    arc_title = models.TextField()
    arc_number = models.PositiveIntegerField()
    day_title = models.TextField()

    anchor_image = models.TextField()

    # From nested primary_reading
    primary_reading_title = models.TextField()
    primary_reading_reference = models.TextField(null=True, blank=True)
    primary_reading_url = models.URLField(null=True, blank=True)

    # 1–3 meditative points
    meditative_point_1 = models.TextField()
    meditative_point_2 = models.TextField(null=True, blank=True)
    meditative_point_3 = models.TextField(null=True, blank=True)

    ejaculatory_prayer = models.TextField()
    colloquy = models.TextField()
    resolution = models.TextField(blank=True)

    class Meta:
        ordering = ["master_day_number"]

    def __str__(self):
        return f"Day {self.master_day_number} (Arc: {self.arc_title} #{self.arc_number})"


# --- Secondary Readings ---
class SecondaryReading(models.Model):
    meditation_day = models.ForeignKey("MeditationDay", on_delete=models.CASCADE, related_name="secondary_readings")

    title = models.TextField()  # Required
    reference = models.TextField(blank=True, null=True)  # Optional
    url = models.URLField(blank=True, null=True)  # Optional – PDF or web

    def __str__(self):
        return f"{self.title} ({self.reference or 'no reference'})"


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

    def __str__(self):
        return f"{self.name} ({self.category})"


# --- Arc Tags Many-to-Many ---
class ArcTag(models.Model):
    arc = models.ForeignKey("Arc", on_delete=models.CASCADE)
    tag = models.ForeignKey("Tag", on_delete=models.CASCADE)

    class Meta:
        unique_together = ("arc", "tag")

    def __str__(self):
        return f"Arc {self.arc.arc_id}: {self.tag.name} [{self.tag.category}]"


# --- Day Tags Many-to-Many ---
class DayTag(models.Model):
    meditation_day = models.ForeignKey("MeditationDay", on_delete=models.CASCADE)
    tag = models.ForeignKey("Tag", on_delete=models.CASCADE)

    class Meta:
        unique_together = ("meditation_day", "tag")

    def __str__(self):
        return f"Day {self.meditation_day.master_day_number}: {self.tag.name} [{self.tag.category}]"
