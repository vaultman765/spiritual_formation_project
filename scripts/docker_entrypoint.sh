#!/usr/bin/env bash
set -e

. /app/.venv/bin/activate
python manage.py collectstatic --noinput
python manage.py migrate --noinput
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3