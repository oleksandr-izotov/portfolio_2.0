#!/usr/bin/env bash
# Syncs the host-nginx config for izotov.dev to the VPS, runs nginx -t,
# and reloads nginx if the test passes. Safe to re-run.
#
# Usage:
#   ./deploy/deploy-nginx.sh             # final HTTPS config (requires cert)
#   ./deploy/deploy-nginx.sh bootstrap   # HTTP-only config (for cert bootstrap)

set -euo pipefail

MODE="${1:-final}"

KEY="/c/Users/Admin/Downloads/id_rsa(1)"
HOST="admin-binom@95.174.92.126"

case "$MODE" in
  bootstrap)
    LOCAL_CONF="$(cd "$(dirname "$0")" && pwd)/nginx-host/izotov.dev.bootstrap.conf"
    ;;
  final)
    LOCAL_CONF="$(cd "$(dirname "$0")" && pwd)/nginx-host/izotov.dev.conf"
    ;;
  *)
    echo "Usage: $0 [bootstrap|final]" >&2
    exit 1
    ;;
esac

REMOTE_CONF="/etc/nginx/sites-available/izotov.dev"
ENABLED_LINK="/etc/nginx/sites-enabled/izotov.dev"
STAGING_CONF="/tmp/izotov.dev.conf.new"

if [ ! -f "$LOCAL_CONF" ]; then
  echo "ERROR: $LOCAL_CONF not found" >&2
  exit 1
fi

echo "==> Mode: $MODE"
echo "==> Uploading $LOCAL_CONF to $HOST:$STAGING_CONF"
scp -i "$KEY" -o StrictHostKeyChecking=no "$LOCAL_CONF" "$HOST:$STAGING_CONF"

echo "==> Validating and reloading nginx on the server"
ssh -i "$KEY" -o StrictHostKeyChecking=no "$HOST" bash -s <<REMOTE
set -euo pipefail

STAGING=$STAGING_CONF
TARGET=$REMOTE_CONF
ENABLED=$ENABLED_LINK
BACKUP=\${TARGET}.bak-\$(date +%s)

if [ ! -f "\$STAGING" ]; then
  echo "ERROR: staging file \$STAGING missing" >&2
  exit 1
fi

if [ -f "\$TARGET" ] && cmp -s "\$STAGING" "\$TARGET"; then
  echo "No change — config is already up to date."
  rm -f "\$STAGING"
  exit 0
fi

if [ -f "\$TARGET" ]; then
  echo "Backing up current config to \$BACKUP"
  sudo cp "\$TARGET" "\$BACKUP"
fi

echo "Installing new config"
sudo cp "\$STAGING" "\$TARGET"
rm -f "\$STAGING"

if [ ! -L "\$ENABLED" ]; then
  echo "Symlinking sites-enabled/izotov.dev"
  sudo ln -sf "\$TARGET" "\$ENABLED"
fi

echo "Testing nginx config"
if ! sudo nginx -t; then
  echo "nginx -t FAILED — rolling back"
  if [ -f "\$BACKUP" ]; then
    sudo cp "\$BACKUP" "\$TARGET"
  else
    sudo rm -f "\$TARGET" "\$ENABLED"
  fi
  sudo nginx -t
  exit 1
fi

echo "Reloading nginx"
sudo systemctl reload nginx

echo "Done."
REMOTE
