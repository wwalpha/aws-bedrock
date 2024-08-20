import { Request } from 'express';
import { ChatService } from '@services';
import { APIs } from 'typings';

export default async (
  req: Request<APIs.FeedbackParams, any, APIs.FeedbackRequest, any>
): Promise<APIs.FeedbackResponse> => {
  const { chatId } = req.params;
  const { feedback, createdDate } = req.body;

  const message = await ChatService.updateFeedback(chatId, createdDate, feedback);

  return {
    message: message,
  };
};
