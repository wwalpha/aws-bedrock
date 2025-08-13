export const SIDEBAR_CATEGORIES = [
  'chats',
  'presets',
  'prompts',
  'files',
  'collections',
  'assistants',
  'tools',
  'models',
] as const;

export type SidebarCategory = (typeof SIDEBAR_CATEGORIES)[number];
