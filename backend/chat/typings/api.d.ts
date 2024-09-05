import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { Chat, SystemContext, ShareId, UserIdAndChatId } from '../../types/index';

export namespace APIs {
  type Callback = (req: Request<any>) => Promise<any>;

  // ------------------------------------------------------------
  // Chat List
  // ------------------------------------------------------------
  type ListChatRequest = void;
  type ListChatResponse = Chat[];

  // ------------------------------------------------------------
  // Chat Regist
  // ------------------------------------------------------------
  type RegistChatRequest = void;
  type RegistChatResponse = Chat;

  // ------------------------------------------------------------
  // Chat Delete
  // ------------------------------------------------------------
  type DeleteChatRequest = void;
  type DeleteChatParams = {
    chatId: string;
  };
  type ChatDeleteResponse = void;

  // ------------------------------------------------------------
  // Chat Get
  // ------------------------------------------------------------
  type ChatGetRequest = void;
  type ChatGetParams = {
    chatId: string;
  };
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
  // Message List
  // ------------------------------------------------------------
  interface ListMessagesRequest {}
  interface ListMessagesParams {
    chatId: string;
  }
  interface ListMessagesResponse {
    messages: RecordedMessage[];
  }

  // ------------------------------------------------------------
  // Message Regist
  // ------------------------------------------------------------
  interface RegistMessageRequest {
    messages: ToBeRecordedMessage[];
  }
  interface RegistMessageParams {
    chatId: string;
  }
  interface RegistMessageResponse {
    messages: RecordedMessage[];
  }

  // ------------------------------------------------------------
  // Chat Title Update
  // ------------------------------------------------------------
  interface UpdateChatTitleRequest {
    title: string;
  }
  interface UpdateChatTitleParams {
    chatId: string;
  }
  interface UpdateChatTitleResponse {
    chat: Chat;
  }

  // ------------------------------------------------------------
  // SystemContext List
  // ------------------------------------------------------------
  interface ListSystemContextRequest {}
  type ListSystemContextResponse = SystemContext[];

  // ------------------------------------------------------------
  // SystemContext Regist
  // ------------------------------------------------------------
  interface RegistSystemContextRequest extends SystemContext {}
  type RegistSystemContextResponse = SystemContext;

  // ------------------------------------------------------------
  // SystemContext Delete
  // ------------------------------------------------------------
  interface DeleteSystemContextRequest {}
  interface DeleteSystemContextParams {
    systemContextId: string;
  }
  type DeleteSystemContextResponse = void;

  // ------------------------------------------------------------
  // SystemContext Title Update
  // ------------------------------------------------------------
  interface UpdateSystemContextTitleRequest {
    title: string;
  }
  interface UpdateSystemContextTitleParams {
    systemContextId: string;
  }
  interface UpdateSystemContextTitleResponse {
    systemContext: SystemContext;
  }

  // ------------------------------------------------------------
  // Find Share Id
  // ------------------------------------------------------------
  type FindShareIdRequest = void;
  type FindShareIdParams = {
    chatId: string;
  };
  type FindShareIdResponse = Chat | null;

  // ------------------------------------------------------------
  // Regist Share Id
  // ------------------------------------------------------------
  type RegistShareIdRequest = void;
  type RegistShareIdParams = {
    chatId: string;
  };
  type RegistShareIdResponse = {
    shareId: ShareId;
    userIdAndChatId: UserIdAndChatId;
  };

  // ------------------------------------------------------------
  // Get Shared Chat
  // ------------------------------------------------------------
  type GetSharedChatRequest = void;
  type GetSharedChatParams = {
    shareId: string;
  };
  type GetSharedChatResponse = {
    chat: Chat | null;
    messages: RecordedMessage[];
  };

  // ------------------------------------------------------------
  // Delete Shared Id
  // ------------------------------------------------------------
  type DeleteShareIdRequest = void;
  type DeleteShareIdParams = {
    shareId: string;
  };
  type DeleteShareIdResponse = void;
}
