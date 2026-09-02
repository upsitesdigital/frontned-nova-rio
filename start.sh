#!/bin/bash
set -e

cd /app/html/ppu.novario.com.br

# Recover automatically when a deployment has no complete Next.js build.
if [ ! -f .next/BUILD_ID ] || [ ! -f .next/standalone/server.js ]; then
  mise exec node@22 -- npm run build
fi

exec mise exec node@22 -- npm run start:prod
