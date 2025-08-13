export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  modelId?: string; // selected model id
}

export interface UserSessionSummary {
  id: string;
  startedAt: string; // ISO string or epoch-as-string
}

export type UpdateUserRequest = Partial<
  Pick<UserProfile, 'email' | 'name' | 'avatarUrl' | 'modelId'>
>;

export interface UpdateUserModelRequest {
  userId: string;
  modelId: string;
}
