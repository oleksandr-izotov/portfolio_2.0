#!/usr/bin/env bash
# Issues a Let's Encrypt cert for izotov.dev via certbot's nginx plugin
# (HTTP-01 challenge). The bootstrap nginx config must already be deployed
# AND the Cloudflare A record must point at the server with proxy DISABLED
# (grey cloud) so the LE challenge reaches us directly.
#
# Usage:  ./deploy/issue-cert.sh

set -euo pipefail

KEY="/c/Users/Admin/Downloads/id_rsa(1)"
HOST="admin-binom@95.174.92.126"

echo "==> Pre-flight: izotov.dev should resolve to 95.174.92.126 (grey cloud, no CF proxy)"
RESOLVED=$(dig +short izotov.dev @1.1.1.1 | tail -1)
echo "    Currently resolves to: $RESOLVED"
if [ "$RESOLVED" != "95.174.92.126" ]; then
  echo "WARNING: izotov.dev does not resolve to the server yet."
  echo "  - Make sure the A record in Cloudflare points to 95.174.92.126"
  echo "  - And that the proxy is DISABLED (grey cloud) for the cert issuance"
  echo "  - Then re-run this script."
  read -r -p "Continue anyway? [y/N] " ans
  [ "$ans" = "y" ] || exit 1
fi

echo "==> Issuing cert via certbot on the server"
ssh -i "$KEY" -o StrictHostKeyChecking=no "$HOST" bash -s <<'REMOTE'
set -euo pipefail
sudo certbot certonly --nginx \
  -d izotov.dev -d www.izotov.dev \
  --non-interactive --agree-tos -m izotovoleksandr05@gmail.com \
  --no-eff-email
sudo ls -la /etc/letsencrypt/live/izotov.dev/ | head -10
REMOTE

echo "==> Cert issued. Now run: ./deploy/deploy-nginx.sh   (final HTTPS config)"
