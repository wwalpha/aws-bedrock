export interface ChatMeta {
  id: string; // session_id
  title?: string;
  createdAt: number; // epoch millis
}

export interface ChatListItem extends ChatMeta {}

export interface CreateChatRequest {
  id?: string;
  title?: string;
  userId?: string; // 所有ユーザーID（認証から取得するのが理想、暫定で受け取り）
}

export interface UpdateTitleRequest {
  title: string;
}

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessageItem {
  id: string; // `${session_id}:${timestamp}` or timestamp string
  chatId: string;
  timestamp: number;
  role: ChatRole;
  content: string;
}

export interface AddMessageRequest {
  role: ChatRole;
  content: string;
  userId?: string; // 暫定: メタがない場合の補助
}
