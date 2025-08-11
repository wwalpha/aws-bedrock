import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import {
  AddMessageRequest,
  CreateChatRequest,
  UpdateTitleRequest,
} from './chats.interfaces';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chats: ChatsService) {}

  // POST /chats 新規作成
  @Post()
  create(@Body() body: CreateChatRequest) {
    return this.chats.createChat(body);
  }

  // GET /chats 一覧（現状は空のスタブ、将来GSI導入で実装）
  @Get()
  list(@Query('limit') limit?: string) {
    return this.chats.listChats(limit ? Number(limit) : undefined);
  }

  // GET /chats?userId=xxx ユーザー別一覧（GSI 利用）
  @Get('user')
  listByUser(@Query('userId') userId?: string, @Query('limit') limit?: string) {
    if (userId) {
      return this.chats.listChatsByUser(
        userId,
        limit ? Number(limit) : undefined,
      );
    }
    return this.chats.listChats(limit ? Number(limit) : undefined);
  }
  // GET /chats/:chatId 取得
  @Get(':chatId')
  get(@Param('chatId') chatId: string) {
    return this.chats.getChat(chatId);
  }

  // DELETE /chats/:chatId 削除
  @Delete(':chatId')
  remove(@Param('chatId') chatId: string) {
    return this.chats.deleteChat(chatId);
  }

  // PUT /chats/:chatId/title タイトル更新
  @Put(':chatId/title')
  setTitle(@Param('chatId') chatId: string, @Body() body: UpdateTitleRequest) {
    return this.chats.updateTitle(chatId, body);
  }

  // GET /chats/:chatId/messages メッセージ一覧
  @Get(':chatId/messages')
  messages(@Param('chatId') chatId: string, @Query('limit') limit?: string) {
    return this.chats.listMessages(chatId, limit ? Number(limit) : undefined);
  }

  // POST /chats/:chatId/messages メッセージ追加
  @Post(':chatId/messages')
  addMessage(@Param('chatId') chatId: string, @Body() body: AddMessageRequest) {
    return this.chats.addMessage(chatId, body);
  }
}
