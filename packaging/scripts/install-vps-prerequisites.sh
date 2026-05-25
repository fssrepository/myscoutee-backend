#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Please run as root, for example: sudo $0" >&2
  exit 1
fi

if ! command -v apt-get >/dev/null 2>&1; then
  echo "This installer currently supports Debian/Ubuntu apt-based systems." >&2
  exit 1
fi

packages=()

add_package_if_command_missing() {
  local command_name="$1"
  local package_name="$2"
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    packages+=("${package_name}")
  fi
}

add_package_if_command_missing curl curl
add_package_if_command_missing jq jq
add_package_if_command_missing gpg gnupg
add_package_if_command_missing openssl openssl
add_package_if_command_missing ufw ufw
add_package_if_command_missing ncdu ncdu
add_package_if_command_missing iotop iotop
add_package_if_command_missing redis-cli redis-tools

if ! command -v docker >/dev/null 2>&1; then
  packages+=(docker.io)
fi

if ! docker compose version >/dev/null 2>&1; then
  packages+=(docker-compose-plugin)
fi

if [[ "${#packages[@]}" -gt 0 ]]; then
  apt-get update
  apt-get install -y --no-install-recommends "${packages[@]}"
fi

if ! command -v mongosh >/dev/null 2>&1; then
  if apt-cache show mongodb-mongosh >/dev/null 2>&1; then
    apt-get install -y --no-install-recommends mongodb-mongosh
  else
    echo "mongosh is still missing. Install MongoDB Shell from the MongoDB package repository if host-side Mongo inspection is needed." >&2
  fi
fi

systemctl enable --now docker >/dev/null 2>&1 || true

echo "VPS prerequisite check complete."
