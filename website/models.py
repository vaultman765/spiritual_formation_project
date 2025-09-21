from django.contrib.auth.models import User
from django.db import models
from django.conf import settings


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
    anchor_image = models.JSONField(default=list, blank=True, null=True)
    arc_summary = models.TextField()

    primary_reading = models.JSONField(default=list, blank=True, null=True)

    card_tags = models.JSONField(default=list, blank=True, null=True)

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
    meditative_point_2 = models.TextField(blank=True)
    meditative_point_3 = models.TextField(blank=True)

    ejaculatory_prayer = models.TextField()
    colloquy = models.TextField()
    resolution = models.TextField(blank=True)

    class Meta:
        unique_together = ("arc", "arc_day_number")
        ordering = ["master_day_number"]

    def __str__(self):
        return f"Day {self.master_day_number} (Arc: {self.arc_title} #{self.arc_number})"


# --- Secondary Readings ---
class SecondaryReading(models.Model):
    meditation_day = models.ForeignKey("MeditationDay", on_delete=models.CASCADE, related_name="secondary_readings")

    title = models.TextField()  # Required
    reference = models.TextField(blank=True)  # Optional
    url = models.URLField(blank=True)  # Optional – PDF or web

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


class UserJourney(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="journeys")
    title = models.CharField(max_length=255, default="My Journey with Ignation Mental Prayer")
    is_active = models.BooleanField(default=True)
    is_custom = models.BooleanField(default=False)
    completed_on = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Journey of {self.user.username}"


class UserJourneyArcProgress(models.Model):
    user_journey = models.ForeignKey('UserJourney', on_delete=models.CASCADE, related_name='arc_progress_items')
    arc_id = models.CharField(max_length=100)
    arc_title = models.CharField(max_length=255)
    day_count = models.PositiveIntegerField(default=1)
    current_day = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=[
        ('in_progress', 'In Progress'),
        ('upcoming', 'Upcoming'),
        ('completed', 'Completed'),
        ('skipped', 'Skipped'),
    ])
    skipped = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        unique_together = ['user_journey', 'arc_id']

    def __str__(self):
        return f"{self.arc_title} ({self.status})"


class MeditationNote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    meditation_day = models.ForeignKey('MeditationDay', on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'meditation_day']
        ordering = ['-updated_at']

    def __str__(self):
        return f"Note for {self.user.username} – Day {self.meditation_day.master_day_number}"


# --- User Statistics ---
class PageView(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    path = models.CharField(max_length=1024)
    title = models.CharField(max_length=512, blank=True)
    referrer = models.CharField(max_length=1024, blank=True)
    visitor_id = models.CharField(max_length=64, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="pageviews"
    )
    user_agent = models.TextField(blank=True)
    ip = models.GenericIPAddressField(null=True, blank=True)
    screen_w = models.IntegerField(null=True, blank=True)
    screen_h = models.IntegerField(null=True, blank=True)
    tz = models.CharField(max_length=128, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["created_at"]),
            models.Index(fields=["path"]),
            models.Index(fields=["visitor_id", "created_at"]),
        ]

    def __str__(self):
        return f"{self.created_at:%Y-%m-%d %H:%M:%S} {self.path} ({self.visitor_id})"
