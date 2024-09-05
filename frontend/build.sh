echo -e 'terraform {backend "s3" {region = "us-east-1"\n    bucket = "$TERRAFORM_BACKEND_BUCKET_NAME"\n    key    = "$TERRAFORM_BACKEND_BUCKET_KEY"\n  }}' > main.tf

echo "VITE_APP_RAG_ENABLED=true" > .env
echo "VITE_APP_RAG_KNOWLEDGE_BASE_ENABLED=true" >> .env
echo "VITE_APP_AGENT_ENABLED=false" >> .env
echo "VITE_APP_AGENT_NAMES=[]" >> .env
echo "VITE_APP_RECOGNIZE_FILE_ENABLED=true" >> .env
echo "VITE_APP_API_ENDPOINT=$(terraform output -raw api_endpoint)" >> .env
echo "VITE_APP_ENDPOINT_NAMES=[]" >> .env
echo "VITE_APP_REGION=$(terraform output -raw region)" >> .env
echo "VITE_APP_USER_POOL_ID=$(terraform output -raw user_pool_id)" >> .env
echo "VITE_APP_USER_POOL_CLIENT_ID=$(terraform output -raw user_pool_client_id)" >> .env
echo "VITE_APP_IDENTITY_POOL_ID=$(terraform output -raw identity_pool_id)" >> .env
echo "VITE_APP_PREDICT_STREAM_FUNCTION_ARN=arn:aws:lambda:ap-northeast-1:334678299258:function:GenerativeAiUseCasesStack-APIPredictStream44DDBC25-K1mpEn6IMehR" >> .env
echo "VITE_APP_SELF_SIGN_UP_ENABLED=false" >> .env
echo "VITE_APP_VERSION=1.0.0" >> .env
echo "VITE_APP_MODEL_REGION=us-west-2" >> .env
echo "VITE_APP_MODEL_IDS='[\"anthropic.claude-3-sonnet-20240229-v1:0\",\"anthropic.claude-3-haiku-20240307-v1:0\"]'" >> .env
echo "VITE_APP_MULTI_MODAL_MODEL_IDS='[\"anthropic.claude-3-5-sonnet-20240620-v1:0\",\"anthropic.claude-3-opus-20240229-v1:0\",\"anthropic.claude-3-sonnet-20240229-v1:0\",\"anthropic.claude-3-haiku-20240307-v1:0\"]'" >> .env
echo "VITE_APP_IMAGE_MODEL_IDS='[\"stability.stable-diffusion-xl-v1\"]'" >> .env
echo "VITE_APP_SAMLAUTH_ENABLED=false" >> .env
echo "VITE_APP_SAML_COGNITO_DOMAIN_NAME=" >> .env
echo "VITE_APP_SAML_COGNITO_FEDERATED_IDENTITY_PROVIDER_NAME=" >> .env
