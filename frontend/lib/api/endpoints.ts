// Centralized API endpoint paths for backend

export const API = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    signup: "/auth/signup",
    confirmSignup: "/auth/confirmSignup",
    me: "/auth/me"
  },
  chat: {
    anthropic: "/chat/anthropic",
    azure: "/chat/azure",
    custom: "/chat/custom",
    google: "/chat/google",
    groq: "/chat/groq",
    mistral: "/chat/mistral",
    openai: "/chat/openai",
    openrouter: "/chat/openrouter",
    perplexity: "/chat/perplexity",
    tools: "/chat/tools"
  },
  retrieval: {
    process: "/retrieval/process",
    processDocx: "/retrieval/process/docx",
    retrieve: "/retrieval/retrieve"
  },
  command: "/command",
  keys: "/keys",
  username: {
    get: "/username/get",
    available: "/username/available"
  },
  assistants: {
    openai: "/assistants/openai"
  },
  upload: {
    root: "/upload",
    delete: "/upload/delete",
    signedUrl: (
      scope: "files" | "workspaces" | "messages" | "assistants",
      path: string,
      ttl = 86400
    ) =>
      `/upload/signed-url?scope=${scope}&path=${encodeURIComponent(path)}&ttl=${ttl}`
  },
  backend: {
    profile: {
      me: "/profile/me"
    },
    files: (id: string) => `/files/${encodeURIComponent(id)}`,
    fileItemsBulk: "/file_items/bulk",
    retrieval: {
      match: "/retrieval/match"
    }
  }
}
