import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ModelsService } from './models.service';
import {
  ModelDetail,
  ModelListItem,
  SelectModelRequest,
  UpdateModelParamsRequest,
} from './models.interfaces';

@Controller('models')
export class ModelsController {
  constructor(private readonly models: ModelsService) {}

  // GET /models 利用可能モデル一覧
  @Get()
  list(): ModelListItem[] {
    return this.models.list();
  }

  // GET /models/:id モデル詳細
  @Get(':id')
  get(@Param('id') id: string): ModelDetail {
    return this.models.get(id);
  }

  // POST /models/select 使用モデル切替 { id }
  @Post('select')
  select(@Body() body: SelectModelRequest) {
    return this.models.select(body?.id);
  }

  // POST /models/parameters モデルパラメータ更新 { id?, parameters }
  @Post('parameters')
  updateParams(@Body() body: UpdateModelParamsRequest) {
    return this.models.updateParams(body);
  }
}
