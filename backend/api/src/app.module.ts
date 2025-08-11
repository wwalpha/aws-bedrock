import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ModelsModule } from './models/models.module';
import { ChatsModule } from './chats/chats.module';
import { KnowledgeModule } from './knowledge/knowledge.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ModelsModule,
    ChatsModule,
    KnowledgeModule,
  ],
})
export class AppModule {}
