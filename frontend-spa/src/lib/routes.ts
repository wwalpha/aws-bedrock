export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY: '/verify',
  DEMO: '/demo',
  WORKSPACE: '/workspace',
  WORKSPACE_CHAT: '/workspace/:chatId',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
