import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { KnowledgeService } from './knowledge.service';
import {
  CreateKnowledgeRequest,
  ListKnowledgeResponse,
  QueryKnowledgeRequest,
  UpdateKnowledgeRequest,
} from './knowledge.interfaces';

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly service: KnowledgeService) {}

  // GET /knowledge?userId=...
  @Get()
  async list(@Req() req: Request): Promise<ListKnowledgeResponse> {
    const userId = String(req.headers['x-user-id'] || '');
    return this.service.list(userId);
  }

  // POST /knowledge
  @Post()
  async create(@Req() req: Request, @Body() body: CreateKnowledgeRequest) {
    const userId = String(req.headers['x-user-id'] || body.userId || '');
    return this.service.create({ ...body, userId });
  }

  // PATCH /knowledge/:id
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: UpdateKnowledgeRequest,
  ) {
    const userId = String(req.headers['x-user-id'] || '');
    return this.service.update(userId, id, body);
  }

  // DELETE /knowledge/:id
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const userId = String(req.headers['x-user-id'] || '');
    await this.service.remove(userId, id);
    return { ok: true };
  }

  // POST /knowledge/upload
  @Post('upload')
  async upload(
    @Req() req: Request,
    @Body()
    body: {
      userId?: string;
      knowledgeId: string;
      filename: string;
      contentType?: string;
    },
  ) {
    const userId = String(req.headers['x-user-id'] || body.userId || '');
    return this.service.uploadDocument({ ...body, userId });
  }

  // POST /knowledge/query
  @Post('query')
  async query(@Req() req: Request, @Body() body: QueryKnowledgeRequest) {
    const userId = String(req.headers['x-user-id'] || body.userId || '');
    return this.service.query({ ...body, userId });
  }

  // GET /knowledge/:id/stats
  @Get(':id/stats')
  async stats(@Param('id') id: string, @Req() req: Request) {
    const userId = String(req.headers['x-user-id'] || '');
    return this.service.stats(userId, id);
  }
}
