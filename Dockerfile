# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# копираме само package файловете, за да кешираме npm install
COPY package*.json ./
RUN npm ci

# копираме целия код и билдваме
COPY . .
RUN npm run build

# ---------- serve stage ----------
FROM nginx:alpine
# копираме build-а от предната стъпка
COPY --from=build /app/dist /usr/share/nginx/html

# по желание: custom nginx.conf (пример: /etc/nginx/conf.d/default.conf)

# healthcheck
HEALTHCHECK --interval=10s --timeout=3s --retries=6 \
  CMD wget -qO- http://localhost:80/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
