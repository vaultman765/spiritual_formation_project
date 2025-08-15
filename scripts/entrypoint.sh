#!/usr/bin/env bash
set -euo pipefail


# Only collect static when this container is used as the web app (App Runner)
. /app/.venv/bin/activate
if [[ "${APP_ROLE:-}" = "web" || "${COLLECT_STATIC:-}" = "1" ]]; then
  echo "[entrypoint] Running Django collectstatic and migrate..."
  python manage.py collectstatic --noinput
  python manage.py migrate --noinput
  python manage.py shell -c "import django; from django.conf import settings; print('SECURE_PROXY_SSL_HEADER=', settings.SECURE_PROXY_SSL_HEADER); print('USE_X_FORWARDED_HOST=', settings.USE_X_FORWARDED_HOST); print('CSRF_TRUSTED_ORIGINS=', settings.CSRF_TRUSTED_ORIGINS); print('ALLOWED_HOSTS=', settings.ALLOWED_HOSTS)"
  echo "[entrypoint] collectstatic and migrate completed."
fi

# Hand off to the container's main process/command
exec "$@"
