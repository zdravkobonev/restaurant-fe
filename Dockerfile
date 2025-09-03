# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# копираме само package файловете, за да кешираме npm install
COPY package*.json ./
RUN npm ci

# копираме целия код и билдваме
COPY . .
RUN npm run build

# --- runtime stage ---
FROM nginx:alpine
RUN apk add --no-cache bash gettext
# статичните файлове на Vite
COPY --from=build /app/dist/ /usr/share/nginx/html/
# гарантираме шаблона (ако public/ не е в dist)
COPY public/config.template.js /usr/share/nginx/html/config.template.js
# entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
