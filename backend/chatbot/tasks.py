from invoke import task


@task
def start(c):
  c.run("uvicorn app.main:app --reload")


@task
def dockerbuild(c):
  c.run("docker build -t chatbot-app .")


@task
def dockerrun(c):
  c.run("docker run -v ~/.aws:/root/.aws -e AWS_REGION=ap-northeast-1 -p 8000:8000 chatbot-app")
