export interface ModelInfo {
  id: string;
  name: string;
  provider?: string;
  description?: string;
  defaults?: Record<string, any>;
}

export interface ModelListItem {
  id: string;
  name: string;
  provider?: string;
  description?: string;
  selected?: boolean; // optional: resolved per user
}

export interface ModelDetail extends ModelInfo {
  parameters: Record<string, any>;
  selected: boolean;
}

export interface SelectModelRequest {
  id: string; // model id
  userId: string; // target user id
  apiKey?: string; // required when selecting external gpt-5
}

export interface UpdateModelParamsRequest {
  id?: string;
  parameters: Record<string, any>;
}
