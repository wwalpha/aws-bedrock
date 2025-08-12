// Centralized API endpoint path constants
// Keep leading slashes; baseURL handled by ApiClient
export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  CHATS: '/chats',
  PRESETS: '/presets',
  WORKSPACES: '/workspaces',
  ASSISTANTS: '/assistants',
  COLLECTIONS: '/collections',
  PROMPTS: '/prompts',
  TOOLS: '/tools',
  MODELS: '/models',
} as const;

export type ApiEndpointKey = keyof typeof API_ENDPOINTS;
