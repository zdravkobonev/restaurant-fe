# React + TypeScript + Vite

TAG=$(cat VERSION)
IMAGE="ghcr.io/zdravkobonev/restaurant-fe:$TAG"

# билд на новия образ
docker build -t "$IMAGE" .

# push към GHCR
docker push "$IMAGE"