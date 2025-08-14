from pathlib import Path
import environ
import os
from socket import gethostname, gethostbyname_ex
from .hostpatch import _patched_get_host  # noqa


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Initialize environment variables
env = environ.Env()
env_file = os.path.join(BASE_DIR, ".env")
if os.path.exists(env_file):
    environ.Env.read_env(env_file)


SECRET_KEY = env('SECRET_KEY')

DEBUG = env.bool('DEBUG', default=False)

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['localhost', '127.0.0.1', '192.168.1.209'])
ALLOWED_HOSTS += [gethostname(),] + list(set(gethostbyname_ex(gethostname())[2]))

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

CSRF_COOKIE_HTTPONLY = False

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
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

ENV = env('ENV', default='local').lower()

if ENV in ('prod', 'staging'):
    INSTALLED_APPS += ["storages"]

    AWS_STORAGE_BUCKET_NAME = env('S3_BUCKET_NAME')
    AWS_S3_REGION_NAME      = env('AWS_REGION', default='us-east-1')
    AWS_S3_CUSTOM_DOMAIN    = f"{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com"

    # Make admin assets publicly fetchable (simplest path). Alternatively use a bucket policy.
    AWS_DEFAULT_ACL         = None
    AWS_QUERYSTRING_AUTH    = True
    AWS_S3_OBJECT_PARAMETERS = { "CacheControl": "max-age=86400" }

    # Your custom storages (or use storages.backends.s3boto3.S3StaticStorage)
    STATICFILES_STORAGE     = "website.storage_backends.StaticRootS3Boto3Storage"
    DEFAULT_FILE_STORAGE    = "website.storage_backends.MediaRootS3Boto3Storage"

    STATIC_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/django/static/"
    MEDIA_URL  = f"https://{AWS_S3_CUSTOM_DOMAIN}/django/media/"
else:
    # Local dev: keep using filesystem
    STATIC_URL = "static/"
    MEDIA_URL = "/media/"
    STATIC_ROOT = BASE_DIR / "staticfiles"
    MEDIA_ROOT = BASE_DIR / "media"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
