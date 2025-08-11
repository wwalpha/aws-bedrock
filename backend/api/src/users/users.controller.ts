import { Controller, Delete, Get, Param, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/:id ユーザープロフィール取得
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.usersService.getUser(id);
  }

  // PATCH /users/:id プロフィール更新
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() dto: any) {
    return this.usersService.updateUser(id, dto);
  }

  // DELETE /users/:id ユーザー削除
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  // GET /users/:id/sessions 過去セッション一覧取得
  @Get(':id/sessions')
  async listSessions(@Param('id') id: string) {
    return await this.usersService.listSessions(id);
  }
}
