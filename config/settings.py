from pathlib import Path
import environ
import os
from socket import gethostname, gethostbyname_ex
from corsheaders.defaults import default_headers
from .hostpatch import _patched_get_host  # noqa


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Initialize environment variables
env = environ.Env()
env_file = os.path.join(BASE_DIR, ".env")
if os.path.exists(env_file):
    environ.Env.read_env(env_file)

ENV = env('ENV', default='local').lower()
SECRET_KEY = env('SECRET_KEY')

STATIC_CDN_DOMAIN = env("STATIC_CDN_DOMAIN", default=None)
MEDIA_CDN_DOMAIN = env("MEDIA_CDN_DOMAIN",  default=None)

DEBUG = env.bool('DEBUG', default=False)

# Django is behind App Runner/Envoy. Tell Django when the original request was HTTPS.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
SECURE_SSL_REDIRECT = env.bool("SECURE_SSL_REDIRECT", default=False)
SECURE_REDIRECT_EXEMPT = [r"^/health/?$"]

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['localhost', '127.0.0.1'])

# Only add hostname and IPs in development mode
if DEBUG:
    ALLOWED_HOSTS += [gethostname(),] + list(set(gethostbyname_ex(gethostname())[2]))

# For production, rely on explicit ALLOWED_HOSTS environment variable

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        "PORT": env("DB_PORT", default="5432"),
        'OPTIONS': {
            'sslmode': 'require' if env.bool('DB_SSL', default=True) else 'disable',
        },
    }
}


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "website",  # Your custom app
    "corsheaders",  # CORS headers for API
    'rest_framework',  # Django REST Framework
]

CORS_ALLOW_ALL_ORIGINS = env.bool('CORS_ALLOW_ALL_ORIGINS', default=False)
CORS_ALLOW_CREDENTIALS = env.bool('CORS_ALLOW_CREDENTIALS', default=True)
CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS', default=['http://localhost:5173'])
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=['http://localhost:5173'])

if ENV in ('prod', 'staging'):
    # If you use Django session auth (cookies) from a different subdomain:
    SESSION_COOKIE_DOMAIN = ".catholicmentalprayer.com"
    CSRF_COOKIE_DOMAIN = ".catholicmentalprayer.com"
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = "None"
    CSRF_COOKIE_SAMESITE = "None"
    CSRF_COOKIE_HTTPONLY = False  # Must be False for cross-origin CSRF token access
    CORS_ALLOW_HEADERS = list(default_headers) + [
        "authorization",
        "x-csrftoken",
    ]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # CORS middleware must come first
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SECURE = env.bool("CSRF_COOKIE_SECURE", default=not DEBUG)
CSRF_COOKIE_SAMESITE = "Lax"

# Security Headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Additional security settings for production
if ENV in ('prod', 'staging'):
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

    # Content Security Policy
    # Allow self, inline styles, and trusted external domains
    CSP_DEFAULT_SRC = ("'self'",)
    CSP_STYLE_SRC = ("'self'", "'unsafe-inline'", "fonts.googleapis.com")
    CSP_FONT_SRC = ("'self'", "fonts.gstatic.com")
    CSP_IMG_SRC = ("'self'", "data:", "*.amazonaws.com")
    CSP_SCRIPT_SRC = ("'self'", "'unsafe-inline'")  # Note: Consider removing unsafe-inline in future

    # Disable potentially dangerous features
    SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug" if DEBUG else None,
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# Remove None entries from context processors
TEMPLATES[0]["OPTIONS"]["context_processors"] = [
    cp for cp in TEMPLATES[0]["OPTIONS"]["context_processors"] if cp is not None
]

WSGI_APPLICATION = "config.wsgi.application"


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# === S3 STATIC & MEDIA STORAGE ===
if ENV in ("prod", "staging"):
    INSTALLED_APPS += ["storages"]
    AWS_STORAGE_BUCKET_NAME = env("S3_BUCKET_NAME", default=None)

    # Only configure S3 if bucket name is provided
    if AWS_STORAGE_BUCKET_NAME:
        AWS_S3_REGION_NAME = env("AWS_REGION", default="us-east-1")
        AWS_DEFAULT_ACL = None
        AWS_QUERYSTRING_AUTH = True
        AWS_S3_SIGNATURE_VERSION = "s3v4"
        AWS_S3_OBJECT_PARAMETERS = {"CacheControl": "max-age=86400"}

        AWS_LOCATION_STATIC = "django/static"
        AWS_LOCATION_MEDIA = "django/media"

        # NEW in Django 5 – use STORAGES
        STORAGES = {
            "default": {
                "BACKEND": "website.storage_backends.MediaRootS3Boto3Storage",
                "OPTIONS": {
                    "bucket_name": AWS_STORAGE_BUCKET_NAME,
                    "region_name": AWS_S3_REGION_NAME,
                    "location": AWS_LOCATION_MEDIA,
                    "file_overwrite": False,
                },
            },
            "staticfiles": {
                "BACKEND": "website.storage_backends.StaticRootS3Boto3Storage",
                "OPTIONS": {
                    "bucket_name": AWS_STORAGE_BUCKET_NAME,
                    "region_name": AWS_S3_REGION_NAME,
                    "location": AWS_LOCATION_STATIC,
                    # S3StaticStorage sets file_overwrite=True by default (fine for static)
                },
            },
        }

        # Public URLs used by templates (prefer CloudFront if provided)
        STATIC_URL = (
            f"https://{STATIC_CDN_DOMAIN}/django/static/"
            if STATIC_CDN_DOMAIN
            else f"https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{AWS_LOCATION_STATIC}/"
        )
        MEDIA_URL = (
            f"https://{MEDIA_CDN_DOMAIN}/django/media/"
            if MEDIA_CDN_DOMAIN
            else f"https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{AWS_LOCATION_MEDIA}/"
        )

        # These are harmless here; not used by S3 storages but kept for manage.py checks
        STATIC_ROOT = "/app/staticfiles"
        MEDIA_ROOT = "/app/mediafiles"
    else:
        # Fallback to filesystem if S3 is not configured
        STATIC_URL = "static/"
        MEDIA_URL = "/media/"
        STATIC_ROOT = BASE_DIR / "staticfiles"
        MEDIA_ROOT = BASE_DIR / "media"

else:
    # Local dev: keep using filesystem
    STATIC_URL = "static/"
    MEDIA_URL = "/media/"
    STATIC_ROOT = BASE_DIR / "staticfiles"
    MEDIA_ROOT = BASE_DIR / "media"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
