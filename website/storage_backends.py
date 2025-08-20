from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage


class StaticRootS3Boto3Storage(S3Boto3Storage):
    location = "django/static"
    # Serve via CloudFront, no querystring auth
    custom_domain = getattr(settings, "STATIC_CDN_DOMAIN", None)
    querystring_auth = False


class MediaRootS3Boto3Storage(S3Boto3Storage):
    location = "django/media"
    # Media can also use CloudFront if you set MEDIA_CDN_DOMAIN; keep signed if you prefer
    custom_domain = getattr(settings, "MEDIA_CDN_DOMAIN", None)
    querystring_auth = True
    file_overwrite = False
