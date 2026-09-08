#!/usr/bin/env bash
# Syncs the host-nginx config for izotov.dev to the VPS, runs nginx -t,
# and reloads nginx if the test passes. Safe to re-run.
#
# Usage:
#   ./deploy/deploy-nginx.sh             # final HTTPS config (requires cert)
#   ./deploy/deploy-nginx.sh bootstrap   # HTTP-only config (for cert bootstrap)

set -euo pipefail

MODE="${1:-final}"

# SSH target is configurable so this runs both from a workstation (key file,
# direct login) and from a server that already has a host alias with ProxyJump
# in ~/.ssh/config. Override with:
#   IZOTOV_SSH_TARGET=admin-binom@95.174.92.126 IZOTOV_SSH_KEY=~/.ssh/id_rsa ./script.sh
SSH_TARGET="${IZOTOV_SSH_TARGET:-cp-binom}"
SSH_KEY="${IZOTOV_SSH_KEY:-}"
SSH_OPTS=(-o StrictHostKeyChecking=accept-new)
if [ -n "$SSH_KEY" ]; then SSH_OPTS+=(-i "$SSH_KEY"); fi

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

LOCAL_SNIPPET="$(cd "$(dirname "$0")" && pwd)/nginx-host/izotov.dev.security-headers.conf"
REMOTE_SNIPPET="/etc/nginx/snippets/izotov.dev.security-headers.conf"
REMOTE_CONF="/etc/nginx/sites-available/izotov.dev"
ENABLED_LINK="/etc/nginx/sites-enabled/izotov.dev"
STAGING_CONF="/tmp/izotov.dev.conf.new"

if [ ! -f "$LOCAL_CONF" ]; then
  echo "ERROR: $LOCAL_CONF not found" >&2
  exit 1
fi

echo "==> Mode: $MODE"
echo "==> Uploading $LOCAL_CONF to $SSH_TARGET:$STAGING_CONF"
scp "${SSH_OPTS[@]}" "$LOCAL_CONF" "$SSH_TARGET:$STAGING_CONF"

# The final config includes this snippet in every location block; it has to be
# in place before nginx -t runs, or the test fails on a missing include.
if [ "$MODE" = "final" ]; then
  echo "==> Uploading security-headers snippet"
  scp "${SSH_OPTS[@]}" "$LOCAL_SNIPPET" "$SSH_TARGET:/tmp/izotov.security-headers.conf"
  ssh "${SSH_OPTS[@]}" "$SSH_TARGET" \
    "sudo mkdir -p /etc/nginx/snippets && sudo cp /tmp/izotov.security-headers.conf $REMOTE_SNIPPET && rm -f /tmp/izotov.security-headers.conf"
fi

echo "==> Validating and reloading nginx on the server"
ssh "${SSH_OPTS[@]}" "$SSH_TARGET" bash -s <<REMOTE
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
