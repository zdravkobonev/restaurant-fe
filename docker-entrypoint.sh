#!/usr/bin/env bash
set -e
: "${VITE_API_BASE_URL:=http://localhost:8000}"
# генерираме /config.js от шаблона с env стойността
envsubst < /usr/share/nginx/html/config.template.js > /usr/share/nginx/html/config.js
exec nginx -g 'daemon off;'
