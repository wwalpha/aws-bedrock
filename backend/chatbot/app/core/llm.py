from langchain_aws import ChatBedrock
# from langchain.chat_models import ChatAnthropic  # or ChatOpenAI
# from dotenv import load_dotenv

# load_dotenv()

# chat_model = ChatAnthropic(
#     model="claude-3.5-sonnet",
#     temperature=0.7,
#     streaming=False,
#     api_key=os.getenv("ANTHROPIC_API_KEY")
# )

# ChatBedrockを生成
chat_model = ChatBedrock(
    model_id="anthropic.claude-3-5-sonnet-20240620-v1:0",
    model_kwargs={"max_tokens": 1000},
    streaming=True,
)
