export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
}

export interface UserSessionSummary {
  id: string;
  startedAt: string; // ISO string or epoch-as-string
}

export type UpdateUserRequest = Partial<
  Pick<UserProfile, 'email' | 'name' | 'avatarUrl'>
>;
