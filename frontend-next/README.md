# Chatbot UI

The open-source AI chat app for everyone.

<img src="./public/readme/screenshot.png" alt="Chatbot UI" width="600">

## Demo

View the latest demo [here](https://x.com/mckaywrigley/status/1738273242283151777?s=20).

## Updates

Hey everyone! I've heard your feedback and am working hard on a big update.

Things like simpler deployment, better backend compatibility, and improved mobile layouts are on their way.

Be back soon.

-- Mckay

## Official Hosted Version

Use Chatbot UI without having to host it yourself!

Find the official hosted version of Chatbot UI [here](https://chatbotui.com).

## Sponsor

If you find Chatbot UI useful, please consider [sponsoring](https://github.com/sponsors/mckaywrigley) me to support my open-source work :)

## Issues

We restrict "Issues" to actual issues related to the codebase.

We're getting excessive amounts of issues that amount to things like feature requests, cloud provider issues, etc.

If you are having issues with things like setup, please refer to the "Help" section in the "Discussions" tab above.

Issues unrelated to the codebase will likely be closed immediately.

## Discussions

We highly encourage you to participate in the "Discussions" tab above!

Discussions are a great place to ask questions, share ideas, and get help.

Odds are if you have a question, someone else has the same question.

## Legacy Code

Chatbot UI was recently updated to its 2.0 version.

The code for 1.0 can be found on the `legacy` branch.

## Updating

In your terminal at the root of your local Chatbot UI repository, run:

```bash
npm run update
```

## Local Quickstart

Follow these steps to get your own Chatbot UI instance running locally.

Note: This fork removes Supabase dependencies. The UI talks to a backend REST API. Set backend URL envs and provider API keys; no Supabase is required.

You can watch the full video tutorial [here](https://www.youtube.com/watch?v=9Qq3-7-HNgw).

### 1. Clone the Repo

```bash
git clone https://github.com/mckaywrigley/chatbot-ui.git
```

### 2. Install Dependencies

Open a terminal in the root directory of your local Chatbot UI repository and run:

```bash
npm install
```

### 3. Backend URL and keys

Configure the backend base URL and any model/provider keys.

- BACKEND_URL: Server-side base URL for the backend (e.g., https://api.example.com)

Provider keys (optional, can also be stored per-user in the backend profile):

- OPENAI_API_KEY, OPENAI_ORGANIZATION_ID
- ANTHROPIC_API_KEY
- GOOGLE_GEMINI_API_KEY
- MISTRAL_API_KEY
- GROQ_API_KEY
- PERPLEXITY_API_KEY
- OPENROUTER_API_KEY
- AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, AZURE_GPT_35_TURBO_NAME, AZURE_GPT_45_TURBO_NAME, AZURE_GPT_45_VISION_NAME, AZURE_EMBEDDINGS_NAME

### 4. Fill in Secrets

#### 1. Environment Variables

In your terminal at the root of your local Chatbot UI repository, run:

```bash
cp .env.local.example .env.local
```

Now go to your `.env.local` file and fill in the values.

If the environment variable is set, it will disable the input in the user settings.

No SQL or Supabase setup is required in this fork.

### 5. Install Ollama (optional for local models)

Follow the instructions [here](https://github.com/jmorganca/ollama#macos).

### 6. Run app locally

In your terminal at the root of your local Chatbot UI repository, run:

```bash
npm run dev
```

Your local instance of Chatbot UI should now be running at [http://localhost:3000](http://localhost:3000). Be sure to use a compatible node version (i.e. v18).

Ensure your backend is reachable at BACKEND_URL; authentication cookies are forwarded by the internal API routes.

## Hosted Quickstart

Follow these steps to get your own Chatbot UI instance running in the cloud.

Video tutorial coming soon.

### 1. Follow Local Quickstart

Repeat steps 1-4 in "Local Quickstart" above.

You will want separate repositories for your local and hosted instances.

Create a new repository for your hosted instance of Chatbot UI on GitHub and push your code to it.

### 2. Setup Backend

Use your own REST backend that implements the endpoints referenced below. Set BACKEND_URL to point to it. Authentication is proxied via internal routes under /api/auth.

### 3. Setup Frontend with Vercel

Go to [Vercel](https://vercel.com/) and create a new project.

In the setup page, import your GitHub repository for your hosted instance of Chatbot UI. Within the project Settings, in the "Build & Development Settings" section, switch Framework Preset to "Next.js".

In environment variables, add at least:

- `BACKEND_URL`

You can also add provider API keys as environment variables (optional):

- `OPENAI_API_KEY`
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_ENDPOINT`
- `AZURE_GPT_45_VISION_NAME`

For the full list of environment variables, refer to the '.env.local.example' file. If provider API keys are set in env, it disables input in user settings.

## Frontend API routes (proxy/edge)

These Next.js routes proxy to the backend or call provider SDKs after fetching the user profile from the backend.

| Method | Path                        | Description                                           |
| ------ | --------------------------- | ----------------------------------------------------- |
| GET    | /api/keys                   | Indicates which provider keys are set via env         |
| POST   | /api/auth/login             | Proxy to BACKEND_URL/v1/auth/login; sets auth cookies |
| POST   | /api/auth/logout            | Proxy to BACKEND_URL/v1/auth/logout                   |
| GET    | /api/auth/me                | Proxy to BACKEND_URL/v1/auth/me                       |
| POST   | /api/username/get           | Get profile username by user_id                       |
| POST   | /api/username/available     | Check if username is available                        |
| POST   | /api/retrieval/process      | Chunk + embed uploaded files; bulk upsert to backend  |
| POST   | /api/retrieval/process/docx | Process docx text and embed                           |
| POST   | /api/retrieval/retrieve     | Compute query embedding and match via backend         |
| POST   | /api/chat/openai            | Chat via OpenAI                                       |
| POST   | /api/chat/anthropic         | Chat via Anthropic                                    |
| POST   | /api/chat/azure             | Chat via Azure OpenAI                                 |
| POST   | /api/chat/google            | Chat via Google Gemini                                |
| POST   | /api/chat/mistral           | Chat via Mistral                                      |
| POST   | /api/chat/groq              | Chat via Groq                                         |
| POST   | /api/chat/perplexity        | Chat via Perplexity                                   |
| POST   | /api/chat/openrouter        | Chat via OpenRouter                                   |
| POST   | /api/chat/custom            | Chat via a custom model configured in the backend     |
| POST   | /api/chat/tools             | Tool-call flow using OpenAPI schemas                  |
| GET    | /api/assistants/openai      | List OpenAI assistants for the user                   |
| POST   | /api/command                | Simple command completion using OpenAI                |

Notes:

- All routes that need user context call BACKEND_URL/v1/profile/me and rely on authentication cookies.
- File upload uses POST BACKEND_URL/v1/upload and signed URLs via GET BACKEND_URL/v1/upload/signed-url.

Click "Deploy" and wait for your frontend to deploy.

Once deployed, you should be able to use your hosted instance of Chatbot UI via the URL Vercel gives you.

## Contributing

We are working on a guide for contributing.

## Contact

Message Mckay on [Twitter/X](https://twitter.com/mckaywrigley)
