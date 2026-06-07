#!/bin/sh
set -eu

seed_root="${MINIO_SEED_ROOT:-/seed/media}"
endpoint="${MINIO_ENDPOINT:-http://minio:9000}"
bucket="${MEDIA_BUCKET:-myscoutee-media}"
alias_name="${MINIO_SEED_ALIAS:-myscoutee}"
access_key="${MINIO_ROOT_USER:-minioadmin}"
secret_key="${MINIO_ROOT_PASSWORD:-minioadmin}"

until mc alias set "${alias_name}" "${endpoint}" "${access_key}" "${secret_key}" >/dev/null 2>&1; do
  echo "Waiting for MinIO at ${endpoint}..."
  sleep 2
done

mc mb --ignore-existing "${alias_name}/${bucket}" >/dev/null

if [ ! -d "${seed_root}" ]; then
  echo "No MinIO seed directory found at ${seed_root}."
  exit 0
fi

find "${seed_root}" -type f | sort | while IFS= read -r seed_file; do
  object_key="${seed_file#${seed_root}/}"
  case "${seed_file}" in
    *.svg) content_type="image/svg+xml" ;;
    *.webp) content_type="image/webp" ;;
    *.png) content_type="image/png" ;;
    *.jpg|*.jpeg) content_type="image/jpeg" ;;
    *) content_type="application/octet-stream" ;;
  esac
  mc cp --attr "Content-Type=${content_type}" "${seed_file}" "${alias_name}/${bucket}/${object_key}" >/dev/null
  echo "Seeded MinIO object ${bucket}/${object_key}"
done
