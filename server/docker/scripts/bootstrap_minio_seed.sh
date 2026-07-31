#!/bin/sh
set -eu

seed_root="${MINIO_SEED_ROOT:-/seed/media}"
endpoint="${MINIO_ENDPOINT:-http://127.0.0.1:9000}"
bucket="${MEDIA_BUCKET:-myscoutee-media}"
alias_name="${MINIO_SEED_ALIAS:-myscoutee}"
access_key="${MINIO_ROOT_USER:-minioadmin}"
secret_key="${MINIO_ROOT_PASSWORD:-minioadmin}"
wait_attempts="${MINIO_SEED_WAIT_ATTEMPTS:-120}"
wait_attempt=1

until mc alias set "${alias_name}" "${endpoint}" "${access_key}" "${secret_key}" >/dev/null 2>&1; do
  if [ "${wait_attempts}" != "0" ] && [ "${wait_attempt}" -ge "${wait_attempts}" ]; then
    echo "MinIO did not become reachable at ${endpoint} after ${wait_attempts} attempts." >&2
    exit 1
  fi
  echo "Waiting for MinIO at ${endpoint}..."
  wait_attempt=$((wait_attempt + 1))
  sleep 2
done

mc mb --ignore-existing "${alias_name}/${bucket}" >/dev/null

if [ ! -d "${seed_root}" ]; then
  echo "No MinIO seed directory found at ${seed_root}."
  exit 0
fi

seed_object() {
  seed_file="$1"
  object_key="$2"
  case "${seed_file}" in
    *.svg) content_type="image/svg+xml" ;;
    *.webp) content_type="image/webp" ;;
    *.png) content_type="image/png" ;;
    *.jpg|*.jpeg) content_type="image/jpeg" ;;
    *) content_type="application/octet-stream" ;;
  esac
  mc cp --attr "Content-Type=${content_type}" "${seed_file}" "${alias_name}/${bucket}/${object_key}" >/dev/null
  echo "Seeded MinIO object ${bucket}/${object_key}"
}

seed_directory() {
  current_dir="$1"
  key_prefix="$2"

  for child in "${current_dir}"/* "${current_dir}"/.[!.]* "${current_dir}"/..?*; do
    if [ ! -e "${child}" ] && [ ! -L "${child}" ]; then
      continue
    fi

    child_name="${child##*/}"
    case "${child_name}" in
      .|..)
        continue
        ;;
    esac

    object_key="${key_prefix}${child_name}"
    if [ -d "${child}" ]; then
      (
        seed_directory "${child}" "${object_key}/"
      )
    elif [ -f "${child}" ]; then
      seed_object "${child}" "${object_key}"
    fi
  done
}

seed_directory "${seed_root}" ""
