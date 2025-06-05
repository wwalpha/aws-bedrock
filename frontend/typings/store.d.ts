export type StoreState = AuthSlice & UIContextSlice & SidebarSlice;

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthSlice {
  user: User | null;
  accessToken: string | null;
  idToken: string | null;

  setAuthInfo: (user: User, accessToken: string, idToken: string) => void;
  clearAuthInfo: () => void;
}

export interface UIContextSlice {
  sendMessage: (message: string) => void;
  stopMessage: () => void;
  newChat: () => void;

  profile?: Record<string, string>;
  setProfile: (profile: Record<string, string>) => void;

  // ITEMS STORE
  assistants: Record<string, string>[];
  // setAssistants:

  collections: Record<string, string>[];
  // setCollections: Dispatch<SetStateAction<Tables<'collections'>[]>>;
  chats: Record<string, string>[];
  // setChats: Dispatch<SetStateAction<Tables<'chats'>[]>>;
  files: Record<string, string>[];
  // setFiles: Dispatch<SetStateAction<Tables<'files'>[]>>;
  folders: Record<string, string>[];
  // setFolders: Dispatch<SetStateAction<Tables<'folders'>[]>>;
  models: Record<string, string>[];
  // setModels: Dispatch<SetStateAction<Tables<'models'>[]>>;
  presets: Record<string, string>[];
  // setPresets: Dispatch<SetStateAction<Tables<'presets'>[]>>;
  prompts: Record<string, string>[];
  // setPrompts: Dispatch<SetStateAction<Tables<'prompts'>[]>>;
  tools: Record<string, string>[];
  // setTools: Dispatch<SetStateAction<Tables<'tools'>[]>>;
  workspaces: Tables<'workspaces'>[];
  // setWorkspaces: Dispatch<SetStateAction<Tables<'workspaces'>[]>>;

  // MODELS STORE
  // envKeyMap: Record<string, VALID_ENV_KEYS>;
  // setEnvKeyMap: Dispatch<SetStateAction<Record<string, VALID_ENV_KEYS>>>;
  // availableHostedModels: LLM[];
  // setAvailableHostedModels: Dispatch<SetStateAction<LLM[]>>;
  // availableLocalModels: LLM[];
  // setAvailableLocalModels: Dispatch<SetStateAction<LLM[]>>;
  // availableOpenRouterModels: OpenRouterLLM[];
  // setAvailableOpenRouterModels: Dispatch<SetStateAction<OpenRouterLLM[]>>;

  // WORKSPACE STORE
  // selectedWorkspace: Tables<'workspaces'> | null;
  // setSelectedWorkspace: Dispatch<SetStateAction<Tables<'workspaces'> | null>>;
  // workspaceImages: WorkspaceImage[];
  // setWorkspaceImages: Dispatch<SetStateAction<WorkspaceImage[]>>;

  // PRESET STORE
  // selectedPreset: Tables<'presets'> | null;
  // setSelectedPreset: Dispatch<SetStateAction<Tables<'presets'> | null>>;

  // ASSISTANT STORE
  // selectedAssistant: Tables<'assistants'> | null;
  // setSelectedAssistant: Dispatch<SetStateAction<Tables<'assistants'> | null>>;
  // assistantImages: AssistantImage[];
  // setAssistantImages: Dispatch<SetStateAction<AssistantImage[]>>;
  // openaiAssistants: any[];
  // setOpenaiAssistants: Dispatch<SetStateAction<any[]>>;

  // PASSIVE CHAT STORE
  // userInput: string;
  // setUserInput: Dispatch<SetStateAction<string>>;
  // chatMessages: ChatMessage[];
  // setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  // chatSettings: ChatSettings | null;
  // setChatSettings: Dispatch<SetStateAction<ChatSettings>>;
  // selectedChat: Tables<'chats'> | null;
  // setSelectedChat: Dispatch<SetStateAction<Tables<'chats'> | null>>;
  // chatFileItems: Tables<'file_items'>[];
  // setChatFileItems: Dispatch<SetStateAction<Tables<'file_items'>[]>>;

  // ACTIVE CHAT STORE
  // abortController: AbortController | null;
  // setAbortController: Dispatch<SetStateAction<AbortController | null>>;
  // firstTokenReceived: boolean;
  // setFirstTokenReceived: Dispatch<SetStateAction<boolean>>;
  // isGenerating: boolean;
  // setIsGenerating: Dispatch<SetStateAction<boolean>>;

  // CHAT INPUT COMMAND STORE
  // isPromptPickerOpen: boolean;
  // setIsPromptPickerOpen: Dispatch<SetStateAction<boolean>>;
  // slashCommand: string;
  // setSlashCommand: Dispatch<SetStateAction<string>>;
  // isFilePickerOpen: boolean;
  // setIsFilePickerOpen: Dispatch<SetStateAction<boolean>>;
  // hashtagCommand: string;
  // setHashtagCommand: Dispatch<SetStateAction<string>>;
  // isToolPickerOpen: boolean;
  // setIsToolPickerOpen: Dispatch<SetStateAction<boolean>>;
  // toolCommand: string;
  // setToolCommand: Dispatch<SetStateAction<string>>;
  // focusPrompt: boolean;
  // setFocusPrompt: Dispatch<SetStateAction<boolean>>;
  // focusFile: boolean;
  // setFocusFile: Dispatch<SetStateAction<boolean>>;
  // focusTool: boolean;
  // setFocusTool: Dispatch<SetStateAction<boolean>>;
  // focusAssistant: boolean;
  // setFocusAssistant: Dispatch<SetStateAction<boolean>>;
  // atCommand: string;
  // setAtCommand: Dispatch<SetStateAction<string>>;
  // isAssistantPickerOpen: boolean;
  // setIsAssistantPickerOpen: Dispatch<SetStateAction<boolean>>;

  // ATTACHMENTS STORE
  // chatFiles: ChatFile[];
  // setChatFiles: Dispatch<SetStateAction<ChatFile[]>>;
  // chatImages: MessageImage[];
  // setChatImages: Dispatch<SetStateAction<MessageImage[]>>;
  // newMessageFiles: ChatFile[];
  // setNewMessageFiles: Dispatch<SetStateAction<ChatFile[]>>;
  // newMessageImages: MessageImage[];
  // setNewMessageImages: Dispatch<SetStateAction<MessageImage[]>>;
  // showFilesDisplay: boolean;
  // setShowFilesDisplay: Dispatch<SetStateAction<boolean>>;

  // RETRIEVAL STORE
  // useRetrieval: boolean;
  // setUseRetrieval: Dispatch<SetStateAction<boolean>>;
  // sourceCount: number;
  // setSourceCount: Dispatch<SetStateAction<number>>;

  // TOOL STORE
  // selectedTools: Tables<'tools'>[];
  // setSelectedTools: Dispatch<SetStateAction<Tables<'tools'>[]>>;
  // toolInUse: string;
  // setToolInUse: Dispatch<SetStateAction<string>>;
}

export interface SidebarSlice {}
