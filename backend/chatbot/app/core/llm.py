import os
import json
from functools import lru_cache
from typing import Iterable
import boto3
from botocore.exceptions import ClientError
from langchain_aws import ChatBedrock
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import BaseMessage

# Environment variable names
GPT5_SECRET_NAME_ENV = "GLOBAL_GPT5_SECRET_NAME"  # Name of secret storing GPT-5 API key (string or JSON)

BEDROCK_MODEL_ID = "anthropic.claude-3-sonnet-20240229-v1:0"  # Claude 3 Sonnet 4 equivalent id placeholder
GPT5_MODEL_ID = "external:gpt-5"  # logical id (not actual provider id)


def build_bedrock_client():
    return ChatBedrock(
        model_id=BEDROCK_MODEL_ID,
        model_kwargs={"max_tokens": 1000},
        streaming=True,
    )


def build_gpt5_client(api_key: str):
    # Placeholder using Anthropic client or other; adjust when real GPT-5 SDK available
    return ChatAnthropic(
        model="claude-3-opus-20240229",  # temporary stand-in
        temperature=0.5,
        streaming=True,
        api_key=api_key,
    )


@lru_cache(maxsize=1)
def get_bedrock_model():
    return build_bedrock_client()


def _resolve_region():
    return os.getenv("AWS_REGION") or os.getenv("AWS_DEFAULT_REGION") or "us-east-1"


@lru_cache(maxsize=1)
def _fetch_gpt5_api_key() -> str:
    secret_name = os.getenv(GPT5_SECRET_NAME_ENV)
    if not secret_name:
        raise RuntimeError("GLOBAL_GPT5_SECRET_NAME not set")
    client = boto3.client("secretsmanager", region_name=_resolve_region())
    try:
        resp = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        raise RuntimeError(f"Failed to get GPT-5 secret: {e.response.get('Error', {}).get('Message', str(e))}")
    secret_str = resp.get("SecretString")
    if not secret_str:
        raise RuntimeError("GPT-5 secret has no SecretString")
    # Accept raw key or JSON wrapper {"apiKey": "..."} / {"value": "..."}
    key = secret_str
    try:
        parsed = json.loads(secret_str)
        if isinstance(parsed, dict):
            key = parsed.get("apiKey") or parsed.get("value") or next(iter(parsed.values()))
    except json.JSONDecodeError:
        pass
    if not key:
        raise RuntimeError("GPT-5 API key not found in secret content")
    return key


@lru_cache(maxsize=1)
def get_gpt5_model():
    api_key = _fetch_gpt5_api_key()
    return build_gpt5_client(api_key)


def select_model(model_id: str):
    if model_id == GPT5_MODEL_ID:
        return get_gpt5_model()
    return get_bedrock_model()


async def ainvoke_with_model(model_id: str, messages: Iterable[BaseMessage]):
    model = select_model(model_id)
    return await model.ainvoke(messages)


def stream_with_model(model_id: str, messages: Iterable[BaseMessage]):
    model = select_model(model_id)
    return model.stream(messages)
