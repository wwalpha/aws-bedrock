import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ModelInfo,
  ModelListItem,
  ModelDetail,
  UpdateModelParamsRequest,
} from './models.interfaces';

@Injectable()
export class ModelsService {
  private models: ModelInfo[] = [
    {
      id: 'bedrock:anthropic.claude-3-haiku',
      name: 'Claude 3 Haiku',
      provider: 'bedrock',
      description: 'Fast, cost-effective model for general tasks',
      defaults: { temperature: 0.2, maxTokens: 2048 },
    },
    {
      id: 'bedrock:meta.llama3-70b-instruct',
      name: 'Llama 3 70B Instruct',
      provider: 'bedrock',
      description: 'High-quality instruction following',
      defaults: { temperature: 0.5, maxTokens: 4096 },
    },
    {
      id: 'openai:gpt-4o-mini',
      name: 'GPT-4o mini',
      provider: 'openai',
      description: 'Lightweight multimodal-capable model',
      defaults: { temperature: 0.3, maxTokens: 2048 },
    },
  ];

  private selectedModelId: string = this.models[0].id;
  private paramsMap = new Map<string, Record<string, any>>();

  list(): ModelListItem[] {
    return this.models.map(({ id, name, provider, description }) => ({
      id,
      name,
      provider,
      description,
      selected: id === this.selectedModelId,
    }));
  }

  get(id: string): ModelDetail {
    const model = this.models.find((m) => m.id === id);
    if (!model) throw new NotFoundException('Model not found');
    const overrides = this.paramsMap.get(id) || {};
    return {
      ...model,
      parameters: { ...(model.defaults || {}), ...overrides },
      selected: id === this.selectedModelId,
    };
  }

  select(id: string) {
    const exists = this.models.some((m) => m.id === id);
    if (!exists) throw new NotFoundException('Model not found');
    this.selectedModelId = id;
    return { message: 'Model selected', id };
  }

  updateParams(input: UpdateModelParamsRequest) {
    if (!input || !input.parameters) {
      throw new BadRequestException('parameters is required');
    }
    const targetId = input.id || this.selectedModelId;
    if (!targetId) throw new BadRequestException('No target model specified');
    const exists = this.models.some((m) => m.id === targetId);
    if (!exists) throw new NotFoundException('Model not found');
    const current = this.paramsMap.get(targetId) || {};
    const next = { ...current, ...input.parameters };
    this.paramsMap.set(targetId, next);
    return { id: targetId, parameters: next };
  }
}
