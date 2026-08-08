#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/ai-github-assistant}"
REPO_URL="${REPO_URL:-https://github.com/your-org/ai-github-assistant.git}"
BRANCH="${BRANCH:-main}"

echo "==> Deploying AI GitHub Assistant to EC2"

sudo apt-get update -y
sudo apt-get install -y docker.io docker-compose-plugin git

sudo systemctl enable docker
sudo systemctl start docker

if [ ! -d "$APP_DIR" ]; then
  sudo git clone "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"
sudo git fetch origin
sudo git checkout "$BRANCH"
sudo git pull origin "$BRANCH"

if [ ! -f .env ]; then
  echo "ERROR: Create $APP_DIR/.env before deploying"
  exit 1
fi

sudo docker compose build --no-cache
sudo docker compose up -d

echo "==> Deployment complete. Health check:"
curl -sf "http://localhost:3000/api/v1/health" | head -c 200
echo
