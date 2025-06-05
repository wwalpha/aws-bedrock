/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // cognito
  readonly VITE_AUTHORITY: string;
  readonly VITE_CLIENT_ID: string;
  readonly VITE_REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export type ContentType = 'chats' | 'presets' | 'prompts' | 'files' | 'collections' | 'assistants' | 'tools' | 'models';
