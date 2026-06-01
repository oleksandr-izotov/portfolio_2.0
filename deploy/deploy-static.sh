#!/usr/bin/env bash
# Builds the portfolio and uploads dist/ to the VPS via tar-over-ssh.
# Atomic swap: extracts to dist.new/, then mv over dist/ on success.
#
# Usage:  ./deploy/deploy-static.sh [--no-build]

set -euo pipefail

KEY="/c/Users/Admin/Downloads/id_rsa(1)"
HOST="admin-binom@95.174.92.126"
REMOTE_BASE="/home/admin-binom/izotov.dev"
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
ssh -i "$KEY" -o StrictHostKeyChecking=no "$HOST" \
  "mkdir -p '$REMOTE_BASE' && rm -rf '$REMOTE_BASE/dist.new' && mkdir -p '$REMOTE_BASE/dist.new'"

echo "==> Streaming dist/ via tar over ssh"
tar czf - -C "$LOCAL_DIST" . \
  | ssh -i "$KEY" -o StrictHostKeyChecking=no "$HOST" \
      "tar xzf - -C '$REMOTE_BASE/dist.new'"

echo "==> Atomic swap (dist <- dist.new), keeping previous as dist.bak.prev"
ssh -i "$KEY" -o StrictHostKeyChecking=no "$HOST" bash -s <<REMOTE
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
