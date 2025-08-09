from invoke import task


@task
def start(c):
  c.run("uvicorn app.main:app --reload")


@task
def dockerbuild(c):
  c.run("docker build -t bedrock/chat .")


@task
def dockerrun(c):
  c.run("docker run -v ~/.aws:/root/.aws -e AWS_REGION=ap-northeast-1 -p 8000:8000 chatbot-app")


@task
def deploy(c):
  # ECRにログイン
  c.run("aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 334678299258.dkr.ecr.ap-northeast-1.amazonaws.com ")
  # ECRにイメージをビルド、タグ付け、プッシュ
  c.run("docker build -t bedrock/chat .")
  c.run("docker tag bedrock/chat:latest 334678299258.dkr.ecr.ap-northeast-1.amazonaws.com/bedrock/chat:latest")
  c.run("docker push 334678299258.dkr.ecr.ap-northeast-1.amazonaws.com/bedrock/chat:latest")
  # ECSにデプロイ
  c.run("aws ecs update-service --cluster bedrock-cluster --service ChatService --force-new-deployment")
  # Desired tasks to 1
  c.run("aws ecs update-service --cluster bedrock-cluster --service ChatService --desired-count 1")
  # c.run("aws ecs wait services-stable --cluster bedrock-cluster --services ChatService")
