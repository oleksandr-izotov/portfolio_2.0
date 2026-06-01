# Tiny zero-dependency contact-form relay for izotov.dev.
FROM node:20-alpine

WORKDIR /app
COPY server.js ./

ENV NODE_ENV=production
ENV PORT=3002
# This VPS has broken IPv6 egress; api.telegram.org resolves to IPv6 first and
# would time out. Force IPv4-first DNS resolution so Telegram is reachable.
ENV NODE_OPTIONS=--dns-result-order=ipv4first

# Run as the built-in non-root user.
USER node

EXPOSE 3002
CMD ["node", "server.js"]
