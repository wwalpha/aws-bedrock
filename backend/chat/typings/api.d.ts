import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { Chat } from '../../types/chat';
import { RecordedMessage, ToBeRecordedMessage } from '../../types/message';

export namespace APIs {
  type Callback = (req: Request<any>) => Promise<any>;

  // ------------------------------------------------------------
  // List Chats
  // ------------------------------------------------------------
  interface ChatListRequest {}
  type ChatListResponse = Chat[];

  // ------------------------------------------------------------
  // Regist Chat
  // ------------------------------------------------------------
  interface ChatRegistRequest {}
  type ChatRegistResponse = Chat;

  // ------------------------------------------------------------
  // Delete Chat
  // ------------------------------------------------------------
  interface ChatDeleteRequest {}
  interface ChatDeleteParams {
    chatId: string;
  }
  type ChatDeleteResponse = void;

  // ------------------------------------------------------------
  // Get Chat
  // ------------------------------------------------------------
  interface ChatGetRequest {}
  interface ChatGetParams {
    chatId: string;
  }
  type ChatGetResponse = Chat | null;

  // ------------------------------------------------------------
  // Feedback
  // ------------------------------------------------------------
  interface FeedbackRequest {
    createdDate: string;
    feedback: string;
  }
  interface FeedbackParams {
    chatId: string;
  }
  interface FeedbackResponse {
    message: RecordedMessage;
  }

  // ------------------------------------------------------------
  // List Messages
  // ------------------------------------------------------------
  interface MessageListRequest {}
  interface MessageListParams {
    chatId: string;
  }
  interface MessageListResponse {
    messages: RecordedMessage[];
  }

  // ------------------------------------------------------------
  // Regist Messages
  // ------------------------------------------------------------
  interface MessageRegistRequest {
    messages: ToBeRecordedMessage[];
  }
  interface MessageRegistParams {
    chatId: string;
  }
  interface MessageRegistResponse {
    messages: RecordedMessage[];
  }

  // ------------------------------------------------------------
  // Update Title
  // ------------------------------------------------------------
  interface TitleUpdateRequest {
    title: string;
  }
  interface TitleUpdateParams {
    chatId: string;
  }
  interface TitleUpdateResponse {
    chat: Chat;
  }
}
