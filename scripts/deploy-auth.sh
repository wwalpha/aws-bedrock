#!/usr/bin/env bash
set -euo pipefail

# Deploy backend/auth to ECS by building and pushing the :latest image to ECR
# and forcing a new deployment of the AuthService.

# Config (override via env)
REGION=${AWS_REGION:-${AWS_DEFAULT_REGION:-ap-northeast-1}}
PROJECT_NAME=${PROJECT_NAME:-bedrock}
CLUSTER_NAME=${CLUSTER_NAME:-${PROJECT_NAME}-cluster}
SERVICE_NAME=${SERVICE_NAME:-AuthService}
DESIRED_COUNT=${DESIRED_COUNT:-}

echo "[deploy-auth] REGION=${REGION} PROJECT_NAME=${PROJECT_NAME} CLUSTER=${CLUSTER_NAME} SERVICE=${SERVICE_NAME} DESIRED_COUNT=${DESIRED_COUNT:-(unchanged)}"

command -v aws >/dev/null 2>&1 || { echo "aws CLI is required" >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "docker is required" >&2; exit 1; }

# Resolve ECR repo URI
REPO_NAME="${PROJECT_NAME}/auth"
REPO_URI=$(aws ecr describe-repositories \
  --repository-names "${REPO_NAME}" \
  --query 'repositories[0].repositoryUri' \
  --output text 2>/dev/null || true)

if [[ -z "${REPO_URI}" || "${REPO_URI}" == "None" ]]; then
  echo "ECR repository '${REPO_NAME}' not found. Make sure terraform has created it." >&2
  exit 1
fi

ACCOUNT_ID=$(echo "${REPO_URI}" | cut -d'.' -f1)
echo "[deploy-auth] Using ECR ${REPO_URI} (account ${ACCOUNT_ID})"

echo "[deploy-auth] Logging into ECR..."
aws ecr get-login-password --region "${REGION}" | docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

echo "[deploy-auth] Building Docker image..."
docker build -t "${REPO_URI}:latest" "$(dirname "$0")/../backend/auth" >/dev/null

echo "[deploy-auth] Pushing image to ${REPO_URI}:latest"
docker push "${REPO_URI}:latest" >/dev/null

echo "[deploy-auth] Forcing new ECS deployment..."
if [[ -n "${DESIRED_COUNT}" ]]; then
  aws ecs update-service \
    --region "${REGION}" \
    --cluster "${CLUSTER_NAME}" \
    --service "${SERVICE_NAME}" \
    --desired-count "${DESIRED_COUNT}" \
    --force-new-deployment >/dev/null
else
  aws ecs update-service \
    --region "${REGION}" \
    --cluster "${CLUSTER_NAME}" \
    --service "${SERVICE_NAME}" \
    --force-new-deployment >/dev/null
fi

echo "[deploy-auth] Waiting for service to stabilize..."
aws ecs wait services-stable \
  --region "${REGION}" \
  --cluster "${CLUSTER_NAME}" \
  --services "${SERVICE_NAME}"

echo "[deploy-auth] Done."
