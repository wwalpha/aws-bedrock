# Pyhton外部モジュールのインポート
from langchain_aws import ChatBedrock
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

import streamlit as st

# set_debug(True)  # デバッグモードを有効に

st.title("LangChain AWS Chat Example")

# ChatBedrockを生成
chat = ChatBedrock(
    model_id="anthropic.claude-3-5-sonnet-20240620-v1:0",
    model_kwargs={"max_tokens": 1000},
    streaming=True,
)

# メッセージを定義
messages = [
    SystemMessage(content="あなたのタスクはユーザーの質問に明確に答えることです。"),
    # HumanMessage(content="空が青いのはなぜですか？"),
]

# セッションにメッセージを定義
if "messages" not in st.session_state:
  st.session_state.messages = [
      SystemMessage(content="あなたのタスクはユーザーの質問に明確に答えることです。"),
  ]

# メッセージを画面表示
for message in st.session_state.messages:
  if message.type != "system":
    with st.chat_message(message.type):
      st.markdown(message.content)


# チャット入力欄を定義
if prompt := st.chat_input("何でも聞いてください。"):
    # ユーザーの入力をメッセージに追加
  st.session_state.messages.append(HumanMessage(content=prompt))

  # ユーザーの入力を画面表示
  with st.chat_message("user"):
    st.markdown(prompt)

  # モデルの呼び出しと結果の画面表示
  with st.chat_message("assistant"):
    response = st.write_stream(chat.stream(st.session_state.messages))

  # モデル呼び出し結果をメッセージに追加
  st.session_state.messages.append(AIMessage(content=response))
