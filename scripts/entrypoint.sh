#!/usr/bin/env bash
set -euo pipefail


# Only collect static when this container is used as the web app (App Runner)
. /app/.venv/bin/activate
if [[ "${APP_ROLE:-}" = "web" || "${COLLECT_STATIC:-}" = "1" ]]; then
  echo "[entrypoint] Running Django collectstatic and migrate..."
  ENV=env('ENV', default='prod') S3_BUCKET_NAME=env('S3_BUCKET_NAME', default='sprititual-formation-prod') AWS_REGION=us-east-1 python manage.py collectstatic --noinput
  python manage.py migrate --noinput
  echo "[entrypoint] collectstatic and migrate completed."
fi

# Hand off to the container's main process/command
exec "$@"
