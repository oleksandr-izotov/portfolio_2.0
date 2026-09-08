#!/usr/bin/env bash
# Builds and (re)deploys the contact-api Docker container on the VPS.
# The container listens on 127.0.0.1:3002; nginx reverse-proxies /api/contact to it.
#
# Secrets are read from deploy/contact-api/.env (NOT committed). It must contain:
#   TELEGRAM_BOT_TOKEN=...
#   TELEGRAM_CHAT_ID=...
#
# Usage:  ./deploy/deploy-contact-api.sh
set -euo pipefail

# SSH target is configurable so this runs both from a workstation (key file,
# direct login) and from a server that already has a host alias with ProxyJump
# in ~/.ssh/config. Override with:
#   IZOTOV_SSH_TARGET=admin-binom@95.174.92.126 IZOTOV_SSH_KEY=~/.ssh/id_rsa ./script.sh
SSH_TARGET="${IZOTOV_SSH_TARGET:-cp-binom}"
SSH_KEY="${IZOTOV_SSH_KEY:-}"
SSH_OPTS=(-o StrictHostKeyChecking=accept-new)
if [ -n "$SSH_KEY" ]; then SSH_OPTS+=(-i "$SSH_KEY"); fi
REMOTE_DIR="${IZOTOV_REMOTE_BASE:-/srv/izotov.dev}/contact-api"
PORT=3002
LOCAL_DIR="$(cd "$(dirname "$0")/contact-api" && pwd)"

# Some networks filter most of Telegram's IP range, and then the default DNS
# answer for api.telegram.org times out. On such a host, pin a reachable DC IP:
#   IZOTOV_TELEGRAM_API_IP=149.154.167.220 ./deploy/deploy-contact-api.sh
# Scan for an open one with:
#   for ip in 149.154.167.220 149.154.167.222 149.154.167.91 91.108.56.130; do \
#     timeout 5 bash -c "</dev/tcp/$ip/443" 2>/dev/null && echo "$ip OPEN"; done
# Left empty by default: on a host with working egress the pin is worse than
# nothing, because it freezes one datacentre address that Telegram may rotate.
TELEGRAM_API_IP="${IZOTOV_TELEGRAM_API_IP:-}"

# The secrets file is optional here: on a redeploy the server already holds a
# working .env, and re-uploading the token only widens the number of places it
# travels through. It is required only when the remote copy is missing.
FILES=(server.js Dockerfile)
if [ -f "$LOCAL_DIR/.env" ]; then
  FILES+=(.env)
  echo "==> Local .env found; it will be uploaded"
elif ssh "${SSH_OPTS[@]}" "$SSH_TARGET" "test -f '$REMOTE_DIR/.env'"; then
  echo "==> No local .env; keeping the one already on the server"
else
  echo "ERROR: no local $LOCAL_DIR/.env and none on the server" >&2
  echo "       (needs TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)" >&2
  exit 1
fi

echo "==> Streaming contact-api source to $SSH_TARGET:$REMOTE_DIR"
ssh "${SSH_OPTS[@]}" "$SSH_TARGET" "mkdir -p '$REMOTE_DIR'"
tar czf - -C "$LOCAL_DIR" "${FILES[@]}" \
  | ssh "${SSH_OPTS[@]}" "$SSH_TARGET" "tar xzf - -C '$REMOTE_DIR'"

if [ -n "$TELEGRAM_API_IP" ]; then
  ADD_HOST="--add-host api.telegram.org:${TELEGRAM_API_IP}"
  echo "==> Pinning api.telegram.org to $TELEGRAM_API_IP"
else
  ADD_HOST=""
  echo "==> No Telegram IP pin (host resolves api.telegram.org normally)"
fi

echo "==> Building image and (re)starting container on the server"
ssh "${SSH_OPTS[@]}" "$SSH_TARGET" \
  "cd '$REMOTE_DIR' && \
   docker build -t izotov-contact-api:latest . && \
   docker rm -f izotov-contact-api 2>/dev/null || true && \
   docker run -d --name izotov-contact-api --restart unless-stopped \
     --env-file .env -p 127.0.0.1:${PORT}:${PORT} \
     ${ADD_HOST} izotov-contact-api:latest && \
   sleep 1 && docker ps --filter name=izotov-contact-api --format '{{.Names}} {{.Status}} {{.Ports}}'"

echo "==> Smoke test (/healthz)"
ssh "${SSH_OPTS[@]}" "$SSH_TARGET" \
  "curl -fsS http://127.0.0.1:${PORT}/healthz && echo"

echo "==> Done."
