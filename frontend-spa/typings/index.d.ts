// Simplified local typings for SPA (no external deps)

export interface LoginResponse {
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: any;
}

export interface ProfileSlice {
  profile: any | null;
  setProfile: (v: any | null | ((prev: any | null) => any | null)) => void;
}

export interface Chat {
  id: string;
  name: string;
  createdAt: string; // ISO date
  updatedAt?: string;
}

export interface Preset {
  id: string;
  name: string;
  model?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ItemsSlice {
  assistants: any[]; // TODO: type later
  setAssistants: (v: any[] | ((prev: any[]) => any[])) => void;
  collections: any[];
  setCollections: (v: any[] | ((prev: any[]) => any[])) => void;
  chats: Chat[];
  setChats: (v: Chat[] | ((prev: Chat[]) => Chat[])) => void;
  files: any[];
  setFiles: (v: any[] | ((prev: any[]) => any[])) => void;
  folders: any[];
  setFolders: (v: any[] | ((prev: any[]) => any[])) => void;
  models: any[];
  setModels: (v: any[] | ((prev: any[]) => any[])) => void;
  presets: Preset[];
  setPresets: (v: Preset[] | ((prev: Preset[]) => Preset[])) => void;
  prompts: any[];
  setPrompts: (v: any[] | ((prev: any[]) => any[])) => void;
  tools: any[];
  setTools: (v: any[] | ((prev: any[]) => any[])) => void;
  workspaces: Workspace[];
  setWorkspaces: (v: Workspace[] | ((prev: Workspace[]) => Workspace[])) => void;
}

export interface ModelsSlice {
  envKeyMap: Record<string, string>;
  setEnvKeyMap: (v: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  availableHostedModels: any[];
  setAvailableHostedModels: (v: any[] | ((prev: any[]) => any[])) => void;
  availableLocalModels: any[];
  setAvailableLocalModels: (v: any[] | ((prev: any[]) => any[])) => void;
  availableOpenRouterModels: any[];
  setAvailableOpenRouterModels: (v: any[] | ((prev: any[]) => any[])) => void;
}

export interface WorkspaceSlice {
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (v: Workspace | null | ((prev: Workspace | null) => Workspace | null)) => void;
  workspaceImages: any[];
  setWorkspaceImages: (v: any[] | ((prev: any[]) => any[])) => void;
}

export interface PresetSlice {
  selectedPreset: any | null;
  setSelectedPreset: (v: any | null | ((prev: any | null) => any | null)) => void;
}

export interface AssistantSlice {
  selectedAssistant: any | null;
  setSelectedAssistant: (v: any | null | ((prev: any | null) => any | null)) => void;
  assistantImages: any[];
  setAssistantImages: (v: any[] | ((prev: any[]) => any[])) => void;
  openaiAssistants: any[];
  setOpenaiAssistants: (v: any[] | ((prev: any[]) => any[])) => void;
}

export interface PassiveChatSlice {
  userInput: string;
  setUserInput: (v: string | ((prev: string) => string)) => void;
  chatMessages: any[];
  setChatMessages: (v: any[] | ((prev: any[]) => any[])) => void;
  chatSettings: any;
  setChatSettings: (v: any | ((prev: any) => any)) => void;
  selectedChat: Chat | null;
  setSelectedChat: (v: Chat | null | ((prev: Chat | null) => Chat | null)) => void;
  chatFileItems: any[];
  setChatFileItems: (v: any[] | ((prev: any[]) => any[])) => void;
}

export interface ActiveChatSlice {
  abortController: AbortController | null;
  setAbortController: (v: AbortController | null | ((prev: AbortController | null) => AbortController | null)) => void;
  firstTokenReceived: boolean;
  setFirstTokenReceived: (v: boolean | ((prev: boolean) => boolean)) => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export interface ChatInputSlice {
  isPromptPickerOpen: boolean;
  setIsPromptPickerOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  slashCommand: string;
  setSlashCommand: (v: string | ((prev: string) => string)) => void;
  isFilePickerOpen: boolean;
  setIsFilePickerOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  hashtagCommand: string;
  setHashtagCommand: (v: string | ((prev: string) => string)) => void;
  isToolPickerOpen: boolean;
  setIsToolPickerOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  toolCommand: string;
  setToolCommand: (v: string | ((prev: string) => string)) => void;
  focusPrompt: boolean;
  setFocusPrompt: (v: boolean | ((prev: boolean) => boolean)) => void;
  focusFile: boolean;
  setFocusFile: (v: boolean | ((prev: boolean) => boolean)) => void;
  focusTool: boolean;
  setFocusTool: (v: boolean | ((prev: boolean) => boolean)) => void;
  focusAssistant: boolean;
  setFocusAssistant: (v: boolean | ((prev: boolean) => boolean)) => void;
  atCommand: string;
  setAtCommand: (v: string | ((prev: string) => string)) => void;
  isAssistantPickerOpen: boolean;
  setIsAssistantPickerOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export interface AttachmentsSlice {
  chatFiles: any[];
  setChatFiles: (v: any[] | ((prev: any[]) => any[])) => void;
  chatImages: any[];
  setChatImages: (v: any[] | ((prev: any[]) => any[])) => void;
  newMessageFiles: any[];
  setNewMessageFiles: (v: any[] | ((prev: any[]) => any[])) => void;
  newMessageImages: any[];
  setNewMessageImages: (v: any[] | ((prev: any[]) => any[])) => void;
  showFilesDisplay: boolean;
  setShowFilesDisplay: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export interface RetrievalSlice {
  useRetrieval: boolean;
  setUseRetrieval: (v: boolean | ((prev: boolean) => boolean)) => void;
  sourceCount: number;
  setSourceCount: (v: number | ((prev: number) => number)) => void;
}

export interface ToolsSlice {
  selectedTools: any[];
  setSelectedTools: (v: any[] | ((prev: any[]) => any[])) => void;
  toolInUse: string;
  setToolInUse: (v: string | ((prev: string) => string)) => void;
}

export interface AppSlice {
  idToken: string | null;
  accessToken: string | null;
  setIdToken: (v: string | null | ((prev: string | null) => string | null)) => void;
  setAccessToken: (v: string | null | ((prev: string | null) => string | null)) => void;
  loginWithTokens: (params: { idToken?: string; accessToken?: string }) => void;
  login: (email: string, password: string) => Promise<{ ok: true; data: LoginResponse } | { ok: false; error: string }>;
  logout: () => void;
  logoutApi: () => Promise<void>;
}

export type ChatbotState = ProfileSlice &
  ItemsSlice &
  ModelsSlice &
  WorkspaceSlice &
  PresetSlice &
  AssistantSlice &
  PassiveChatSlice &
  ActiveChatSlice &
  ChatInputSlice &
  AttachmentsSlice &
  RetrievalSlice &
  ToolsSlice &
  AppSlice;
