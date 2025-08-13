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
  SelectModelRequest,
} from './models.interfaces';
import { UsersService } from '../users/users.service';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { Environment } from '../const/consts';

@Injectable()
export class ModelsService {
  // Allowed models (requirement): Claude 3 Sonnet 4 (Bedrock) and GPT-5 (external)
  private models: ModelInfo[] = [
    {
      id: 'bedrock:anthropic.claude-3-sonnet-4',
      name: 'Claude 3 Sonnet 4',
      provider: 'bedrock',
      description: 'Primary Bedrock model',
      defaults: { temperature: 0.5, maxTokens: 4096 },
    },
    {
      id: 'external:gpt-5',
      name: 'GPT-5',
      provider: 'external',
      description: 'External advanced model (requires apiKey)',
      defaults: { temperature: 0.4, maxTokens: 4096 },
    },
  ];

  private selectedModelId: string = this.models[0].id; // fallback (per-process)
  private secrets = new SecretsManagerClient({
    region: Environment.AWS_REGION,
  });
  private paramsMap = new Map<string, Record<string, any>>();

  constructor(private readonly usersService: UsersService) {}

  list(): ModelListItem[] {
    // Selection is user-specific; this method returns list without selected flag
    return this.models.map(({ id, name, provider, description }) => ({
      id,
      name,
      provider,
      description,
    }));
  }

  get(id: string): ModelDetail {
    const model = this.models.find((m) => m.id === id);
    if (!model) throw new NotFoundException('Model not found');
    const overrides = this.paramsMap.get(id) || {};
    return {
      ...model,
      parameters: { ...(model.defaults || {}), ...overrides },
      selected: id === this.selectedModelId, // process-level only
    };
  }

  async select(req: SelectModelRequest) {
    const exists = this.models.some((m) => m.id === req.id);
    if (!exists) throw new NotFoundException('Model not found');
    if (!req.userId) throw new BadRequestException('userId required');
    // For GPT-5 ensure global secret exists (soft check)
    if (req.id === 'external:gpt-5') {
      try {
        await this.secrets.send(
          new GetSecretValueCommand({
            SecretId: Environment.GLOBAL_GPT5_SECRET_NAME,
          }),
        );
      } catch (e) {
        throw new BadRequestException('Global GPT-5 API key secret not found');
      }
    }
    await this.usersService.updateSelectedModel({
      userId: req.userId,
      modelId: req.id,
    });
    this.selectedModelId = req.id; // maintain process fallback
    return { message: 'Model selected', id: req.id };
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
