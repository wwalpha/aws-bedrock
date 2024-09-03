import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import {
  Chat,
  SystemContext,
  PredictRequest as APIPredictRequest,
  PredictTitleRequest as APIPredictTitleRequest,
} from '../../types/index';

export namespace APIs {
  type Callback = (req: Request<any>) => Promise<any>;

  // ------------------------------------------------------------
  // Predict
  // ------------------------------------------------------------
  interface PredictRequest extends APIPredictRequest {}
  type PredictResponse = string;

  // ------------------------------------------------------------
  // Predict Title
  // ------------------------------------------------------------
  interface PredictTitleRequest extends APIPredictTitleRequest {}
  type PredictTitleResponse = string;

  // // ------------------------------------------------------------
  // // Chat Delete
  // // ------------------------------------------------------------
  // interface ChatDeleteRequest {}
  // interface ChatDeleteParams {
  //   chatId: string;
  // }
  // type ChatDeleteResponse = void;

  // // ------------------------------------------------------------
  // // Chat Get
  // // ------------------------------------------------------------
  // interface ChatGetRequest {}
  // interface ChatGetParams {
  //   chatId: string;
  // }
  // type ChatGetResponse = Chat | null;

  // // ------------------------------------------------------------
  // // Feedback
  // // ------------------------------------------------------------
  // interface FeedbackRequest {
  //   createdDate: string;
  //   feedback: string;
  // }
  // interface FeedbackParams {
  //   chatId: string;
  // }
  // interface FeedbackResponse {
  //   message: RecordedMessage;
  // }

  // // ------------------------------------------------------------
  // // Message List
  // // ------------------------------------------------------------
  // interface MessageListRequest {}
  // interface MessageListParams {
  //   chatId: string;
  // }
  // interface MessageListResponse {
  //   messages: RecordedMessage[];
  // }

  // // ------------------------------------------------------------
  // // Message Regist
  // // ------------------------------------------------------------
  // interface MessageRegistRequest {
  //   messages: ToBeRecordedMessage[];
  // }
  // interface MessageRegistParams {
  //   chatId: string;
  // }
  // interface MessageRegistResponse {
  //   messages: RecordedMessage[];
  // }

  // // ------------------------------------------------------------
  // // Chat Title Update
  // // ------------------------------------------------------------
  // interface ChatTitleUpdateRequest {
  //   title: string;
  // }
  // interface ChatTitleUpdateParams {
  //   chatId: string;
  // }
  // interface ChatTitleUpdateResponse {
  //   chat: Chat;
  // }

  // // ------------------------------------------------------------
  // // SystemContext List
  // // ------------------------------------------------------------
  // interface SystemContextListRequest {}
  // type SystemContextListResponse = SystemContext[];

  // // ------------------------------------------------------------
  // // SystemContext Regist
  // // ------------------------------------------------------------
  // interface SystemContextRegistRequest extends SystemContext {}
  // type SystemContextRegistResponse = SystemContext;

  // // ------------------------------------------------------------
  // // SystemContext Delete
  // // ------------------------------------------------------------
  // interface SystemContextDeleteRequest {}
  // interface SystemContextDeleteParams {
  //   systemContextId: string;
  // }
  // type SystemContextDeleteResponse = void;

  // // ------------------------------------------------------------
  // // SystemContext Title Update
  // // ------------------------------------------------------------
  // interface SystemContextTitleUpdateRequest {
  //   title: string;
  // }
  // interface SystemContextTitleUpdateParams {
  //   systemContextId: string;
  // }
  // interface SystemContextTitleUpdateResponse {
  //   systemContext: SystemContext;
  // }
}
