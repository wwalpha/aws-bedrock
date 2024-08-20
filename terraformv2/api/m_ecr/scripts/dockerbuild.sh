#!/bin/bash
# Docker login
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

docker pull nginx:latest
docker tag nginx:latest $REPO_URL:latest
docker push $REPO_URL:latest