#!/usr/bin/env bash
set -euo pipefail
set -x  # DEBUG: echo commands

export HOME=/home/app
echo "Using HOME=$HOME"

echo "[import-job] starting…"

mkdir -p /home/app
CHECKSUM_KEY="checksum/.mental_prayer_checksums.json"
CHECKSUM_LOCAL="/home/app/.mental_prayer_checksums.json"

echo "[import-job] pulling checksum → $CHECKSUM_LOCAL"
aws s3 cp "s3://${S3_BUCKET_NAME}/${CHECKSUM_KEY}" "$CHECKSUM_LOCAL" --region "$AWS_REGION" || echo "{}" > "$CHECKSUM_LOCAL"

echo "[import-job] syncing S3 metadata → /app/metadata"
mkdir -p /app/metadata
aws s3 sync "s3://${S3_BUCKET_NAME}/metadata" "/app/metadata" --delete --region "$AWS_REGION" --exact-timestamps

# DEBUG + guardrails
echo "[import-job] contents of /app/metadata:"
ls -la /app/metadata | sed 's/^/[import-job] /'
if [ ! -f /app/metadata/_index_by_arc.yaml ]; then
  echo "[import-job][FATAL] /app/metadata/_index_by_arc.yaml not found after sync. Check S3 bucket and path." >&2
  exit 42
fi

echo "[import-job] running import_arc (skip unchanged)"
cd /app
python manage.py import_arc --arc-id all --skip-unchanged

echo "[import-job] pushing updated YAML back to S3"
aws s3 sync "/app/metadata" "s3://${S3_BUCKET_NAME}/metadata" --delete --region "$AWS_REGION"

echo "[import-job] pushing updated checksum back to S3"
aws s3 cp "$CHECKSUM_LOCAL" "s3://${S3_BUCKET_NAME}/${CHECKSUM_KEY}" --region "$AWS_REGION"

echo "[import-job] done."
