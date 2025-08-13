// Global DynamoDB type declarations for chat-related tables
// Declaration file (.d.ts) so it does not emit JS.

export interface ChatHistoryBaseItem {
  conversation_id: string; // PK
  timestamp: number; // SK
  user_id?: string;
  type: 'meta' | 'message';
}

export interface ChatHistoryMetaItem extends ChatHistoryBaseItem {
  type: 'meta';
  title?: string;
  createdAt: number;
}

export interface ChatHistoryMessageItem extends ChatHistoryBaseItem {
  type: 'message';
  role?: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ConversationItem {
  user_id: string; // PK
  conversation_id: string; // SK
  title?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface UserItem {
  user_id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  createdAt?: number;
}

export interface KnowledgeItem {
  user_id: string;
  knowledge_id: string;
  filename?: string;
  status?: string;
  createdAt?: number;
}

export type AnyChatHistoryItem = ChatHistoryMetaItem | ChatHistoryMessageItem;
