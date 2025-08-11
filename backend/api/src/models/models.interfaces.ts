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
  selected: boolean;
}

export interface ModelDetail extends ModelInfo {
  parameters: Record<string, any>;
  selected: boolean;
}

export interface SelectModelRequest {
  id: string;
}

export interface UpdateModelParamsRequest {
  id?: string;
  parameters: Record<string, any>;
}
