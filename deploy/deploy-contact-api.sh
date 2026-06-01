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

KEY="/c/Users/Admin/Downloads/id_rsa(1)"
HOST="admin-binom@95.174.92.126"
REMOTE_DIR="/home/admin-binom/izotov.dev/contact-api"
PORT=3002
LOCAL_DIR="$(cd "$(dirname "$0")/contact-api" && pwd)"

# This VPS's upstream network filters MOST of Telegram's IP range: the default
# DNS answer for api.telegram.org (149.154.166.110) and several other DC IPs
# time out (ETIMEDOUT). But this DC IP IS reachable and serves the real Bot API
# (verified: getMe returns the correct bot identity, sendMessage succeeds).
# We pin it via --add-host so the container can deliver. If sends start failing
# because Telegram rotated DCs, re-scan for an OPEN IP and update this value:
#   for ip in 149.154.167.220 149.154.167.222 149.154.167.91 91.108.56.130; do \
#     timeout 5 bash -c "</dev/tcp/$ip/443" 2>/dev/null && echo "$ip OPEN"; done
TELEGRAM_API_IP="149.154.167.220"

if [ ! -f "$LOCAL_DIR/.env" ]; then
  echo "ERROR: $LOCAL_DIR/.env not found (needs TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)" >&2
  exit 1
fi

echo "==> Streaming contact-api source to $HOST:$REMOTE_DIR"
ssh -i "$KEY" -o StrictHostKeyChecking=no "$HOST" "mkdir -p '$REMOTE_DIR'"
tar czf - -C "$LOCAL_DIR" server.js Dockerfile .env \
  | ssh -i "$KEY" -o StrictHostKeyChecking=no "$HOST" "tar xzf - -C '$REMOTE_DIR'"

echo "==> Building image and (re)starting container on the server"
ssh -i "$KEY" -o StrictHostKeyChecking=no "$HOST" \
  "cd '$REMOTE_DIR' && \
   docker build -t izotov-contact-api:latest . && \
   docker rm -f izotov-contact-api 2>/dev/null || true && \
   docker run -d --name izotov-contact-api --restart unless-stopped \
     --env-file .env -p 127.0.0.1:${PORT}:${PORT} \
     --add-host api.telegram.org:${TELEGRAM_API_IP} izotov-contact-api:latest && \
   sleep 1 && docker ps --filter name=izotov-contact-api --format '{{.Names}} {{.Status}} {{.Ports}}'"

echo "==> Smoke test (/healthz)"
ssh -i "$KEY" -o StrictHostKeyChecking=no "$HOST" \
  "curl -fsS http://127.0.0.1:${PORT}/healthz && echo"

echo "==> Done."
