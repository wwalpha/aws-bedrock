import bedrockApi from './bedrockApi';
import bedrockAgentApi from './bedrockAgentApi';
import sagemakerApi from './sagemakerApi';
import { ApiInterface } from 'typings';

const api: Record<'bedrock' | 'bedrockAgent' | 'sagemaker', ApiInterface> = {
  bedrock: bedrockApi,
  bedrockAgent: bedrockAgentApi,
  sagemaker: sagemakerApi,
};

export default api;
