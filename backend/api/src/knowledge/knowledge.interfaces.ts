// Knowledge base domain interfaces
export interface KnowledgeItem {
  id: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: number; // epoch millis
  updatedAt: number; // epoch millis
  docCount?: number;
}

export interface ListKnowledgeResponse {
  items: KnowledgeItem[];
}

export interface CreateKnowledgeRequest {
  name: string;
  description?: string;
  userId: string; // TODO: derive from auth context later
}

export interface UpdateKnowledgeRequest {
  name?: string;
  description?: string;
}

export interface UploadDocumentRequest {
  knowledgeId: string;
  userId: string; // TODO: derive from auth context later
  filename: string;
  contentType?: string;
}

export interface QueryKnowledgeRequest {
  knowledgeId: string;
  userId: string; // TODO: derive from auth context later
  query: string;
  topK?: number;
}

export interface KnowledgeStats {
  id: string;
  userId: string;
  docCount: number;
  lastIngestAt?: number;
  totalTokens?: number;
}
