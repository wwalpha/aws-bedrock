// Simplified local typings for SPA (no external deps)

export interface LoginResponse {
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: any;
}

export interface Profile {
  id?: string;
  username?: string;
  display_name?: string;
  workspaceTitle?: string;
  compactMode?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileSlice {
  profile: Profile | null;
  setProfile: (v: Profile | null | ((prev: Profile | null) => Profile | null)) => void;
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
  assistants: Assistant[];
  setAssistants: (v: Assistant[] | ((prev: Assistant[]) => Assistant[])) => void;
  collections: Collection[];
  setCollections: (v: Collection[] | ((prev: Collection[]) => Collection[])) => void;
  chats: Chat[];
  setChats: (v: Chat[] | ((prev: Chat[]) => Chat[])) => void;
  files: FileAsset[];
  setFiles: (v: FileAsset[] | ((prev: FileAsset[]) => FileAsset[])) => void;
  folders: Folder[];
  setFolders: (v: Folder[] | ((prev: Folder[]) => Folder[])) => void;
  models: ModelRef[];
  setModels: (v: ModelRef[] | ((prev: ModelRef[]) => ModelRef[])) => void;
  presets: Preset[];
  setPresets: (v: Preset[] | ((prev: Preset[]) => Preset[])) => void;
  prompts: Prompt[];
  setPrompts: (v: Prompt[] | ((prev: Prompt[]) => Prompt[])) => void;
  tools: Tool[];
  setTools: (v: Tool[] | ((prev: Tool[]) => Tool[])) => void;
  workspaces: Workspace[];
  setWorkspaces: (v: Workspace[] | ((prev: Workspace[]) => Workspace[])) => void;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FileAsset {
  id: string;
  name: string;
  size?: number;
  mimeType?: string;
  createdAt: string;
  folderId?: string | null;
  url?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string | null;
  createdAt: string;
}

export interface ModelRef {
  id: string;
  provider?: string;
  label?: string;
  contextLength?: number;
  supportsStreaming?: boolean;
}

export interface Prompt {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
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
  selectedPreset: Preset | null;
  setSelectedPreset: (v: Preset | null | ((prev: Preset | null) => Preset | null)) => void;
}

export interface Assistant {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AssistantSlice {
  selectedAssistant: Assistant | null;
  setSelectedAssistant: (v: Assistant | null | ((prev: Assistant | null) => Assistant | null)) => void;
  assistantImages: string[]; // urls/base64
  setAssistantImages: (v: string[] | ((prev: string[]) => string[])) => void;
  openaiAssistants: Assistant[];
  setOpenaiAssistants: (v: Assistant[] | ((prev: Assistant[]) => Assistant[])) => void;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  imagePaths?: string[]; // simple attachment preview
  fileNames?: string[]; // placeholder for file attachment names
}

export interface ChatSettings {
  model?: string;
  temperature?: number;
  top_p?: number;
  [key: string]: unknown;
}

export interface ChatFileItem {
  id: string;
  chatId: string;
  fileId: string;
  addedAt: string;
}

export interface PassiveChatSlice {
  userInput: string;
  setUserInput: (v: string | ((prev: string) => string)) => void;
  chatMessages: ChatMessage[];
  setChatMessages: (v: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  chatSettings: ChatSettings;
  setChatSettings: (v: ChatSettings | ((prev: ChatSettings) => ChatSettings)) => void;
  selectedChat: Chat | null;
  setSelectedChat: (v: Chat | null | ((prev: Chat | null) => Chat | null)) => void;
  chatFileItems: ChatFileItem[];
  setChatFileItems: (v: ChatFileItem[] | ((prev: ChatFileItem[]) => ChatFileItem[])) => void;
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

export interface ChatFile {
  id: string;
  name: string;
  size?: number;
  mimeType?: string;
  createdAt: string;
  url?: string;
}

export interface ChatImage extends ChatFile {
  width?: number;
  height?: number;
  thumbnailUrl?: string;
}

export interface AttachmentsSlice {
  chatFiles: ChatFile[];
  setChatFiles: (v: ChatFile[] | ((prev: ChatFile[]) => ChatFile[])) => void;
  chatImages: ChatImage[];
  setChatImages: (v: ChatImage[] | ((prev: ChatImage[]) => ChatImage[])) => void;
  newMessageFiles: ChatFile[];
  setNewMessageFiles: (v: ChatFile[] | ((prev: ChatFile[]) => ChatFile[])) => void;
  newMessageImages: ChatImage[];
  setNewMessageImages: (v: ChatImage[] | ((prev: ChatImage[]) => ChatImage[])) => void;
  showFilesDisplay: boolean;
  setShowFilesDisplay: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export interface RetrievalSlice {
  useRetrieval: boolean;
  setUseRetrieval: (v: boolean | ((prev: boolean) => boolean)) => void;
  sourceCount: number;
  setSourceCount: (v: number | ((prev: number) => number)) => void;
}

export interface Tool {
  id: string;
  name: string;
  kind?: string;
  createdAt?: string;
}

export interface ToolsSlice {
  selectedTools: Tool[];
  setSelectedTools: (v: Tool[] | ((prev: Tool[]) => Tool[])) => void;
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
