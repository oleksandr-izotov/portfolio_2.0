#!/usr/bin/env bash
# Builds the portfolio and uploads dist/ to the VPS via tar-over-ssh.
# Atomic swap: extracts to dist.new/, then mv over dist/ on success.
#
# Usage:  ./deploy/deploy-static.sh [--no-build]

set -euo pipefail

# SSH target is configurable so this runs both from a workstation (key file,
# direct login) and from a server that already has a host alias with ProxyJump
# in ~/.ssh/config. Override with:
#   IZOTOV_SSH_TARGET=admin-binom@95.174.92.126 IZOTOV_SSH_KEY=~/.ssh/id_rsa ./script.sh
SSH_TARGET="${IZOTOV_SSH_TARGET:-cp-binom}"
SSH_KEY="${IZOTOV_SSH_KEY:-}"
SSH_OPTS=(-o StrictHostKeyChecking=accept-new)
if [ -n "$SSH_KEY" ]; then SSH_OPTS+=(-i "$SSH_KEY"); fi
# Remote layout is configurable for the same reason the SSH target is.
REMOTE_BASE="${IZOTOV_REMOTE_BASE:-/srv/izotov.dev}"
LOCAL_DIST="$(cd "$(dirname "$0")/.." && pwd)/dist"

if [ "${1:-}" != "--no-build" ]; then
  echo "==> Building portfolio"
  ( cd "$(dirname "$0")/.." && npm run build )
fi

if [ ! -d "$LOCAL_DIST" ]; then
  echo "ERROR: $LOCAL_DIST not found — run npm run build first" >&2
  exit 1
fi

echo "==> Preparing remote staging dir"
ssh "${SSH_OPTS[@]}" "$SSH_TARGET" \
  "mkdir -p '$REMOTE_BASE' && rm -rf '$REMOTE_BASE/dist.new' && mkdir -p '$REMOTE_BASE/dist.new'"

echo "==> Streaming dist/ via tar over ssh"
tar czf - -C "$LOCAL_DIST" . \
  | ssh "${SSH_OPTS[@]}" "$SSH_TARGET" \
      "tar xzf - -C '$REMOTE_BASE/dist.new'"

echo "==> Atomic swap (dist <- dist.new), keeping previous as dist.bak.prev"
ssh "${SSH_OPTS[@]}" "$SSH_TARGET" bash -s <<REMOTE
set -euo pipefail
cd "$REMOTE_BASE"
if [ -d dist ]; then
  rm -rf dist.bak.prev 2>/dev/null || true
  mv dist dist.bak.prev
fi
mv dist.new dist
echo "Swap done. Previous build preserved as dist.bak.prev."
ls -la dist | head -5
REMOTE

echo "==> Done."
