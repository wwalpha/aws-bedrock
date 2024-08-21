import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthWithUserpool from './components/AuthWithUserpool.tsx';
import AuthWithSAML from './components/AuthWithSAML.tsx';
import './index.css';
import {
  RouterProvider,
  createBrowserRouter,
  RouteObject,
} from 'react-router-dom';
import LandingPage from './pages/LandingPage.tsx';
import Setting from './pages/Setting.tsx';
import ChatPage from './pages/ChatPage.tsx';
import SharedChatPage from './pages/SharedChatPage.tsx';
import SummarizePage from './pages/SummarizePage.tsx';
import GenerateTextPage from './pages/GenerateTextPage.tsx';
import EditorialPage from './pages/EditorialPage.tsx';
import TranslatePage from './pages/TranslatePage.tsx';
import VideoAnalyzerPage from './pages/VideoAnalyzerPage.tsx';
import NotFound from './pages/NotFound.tsx';
import KendraSearchPage from './pages/KendraSearchPage.tsx';
import RagPage from './pages/RagPage.tsx';
import RagKnowledgeBasePage from './pages/RagKnowledgeBasePage.tsx';
import WebContent from './pages/WebContent.tsx';
import GenerateImagePage from './pages/GenerateImagePage.tsx';
import TranscribePage from './pages/TranscribePage.tsx';
import AgentChatPage from './pages/AgentChatPage.tsx';
import FileUploadPage from './pages/FileUploadPage.tsx';
import { MODELS } from './hooks/useModel.ts';
import { Authenticator } from '@aws-amplify/ui-react';

const ragEnabled: boolean = import.meta.env.VITE_APP_RAG_ENABLED === 'true';
const ragKnowledgeBaseEnabled: boolean =
  import.meta.env.VITE_APP_RAG_KNOWLEDGE_BASE_ENABLED === 'true';
const samlAuthEnabled: boolean =
  import.meta.env.VITE_APP_SAMLAUTH_ENABLED === 'true';
const agentEnabled: boolean = import.meta.env.VITE_APP_AGENT_ENABLED === 'true';
const recognizeFileEnabled: boolean =
  import.meta.env.VITE_APP_RECOGNIZE_FILE_ENABLED === 'true';
const { multiModalModelIds } = MODELS;
const multiModalEnabled: boolean = multiModalModelIds.length > 0;

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/setting',
    element: <Setting />,
  },
  {
    path: '/chat',
    element: <ChatPage />,
  },
  {
    path: '/chat/:chatId',
    element: <ChatPage />,
  },
  {
    path: '/share/:shareId',
    element: <SharedChatPage />,
  },
  {
    path: '/generate',
    element: <GenerateTextPage />,
  },
  {
    path: '/summarize',
    element: <SummarizePage />,
  },
  {
    path: '/editorial',
    element: <EditorialPage />,
  },
  {
    path: '/translate',
    element: <TranslatePage />,
  },
  {
    path: '/web-content',
    element: <WebContent />,
  },
  {
    path: '/image',
    element: <GenerateImagePage />,
  },
  {
    path: '/transcribe',
    element: <TranscribePage />,
  },
  multiModalEnabled
    ? {
        path: '/video',
        element: <VideoAnalyzerPage />,
      }
    : null,
  recognizeFileEnabled
    ? {
        path: '/file',
        element: <FileUploadPage />,
      }
    : null,
  ragEnabled
    ? {
        path: '/rag',
        element: <RagPage />,
      }
    : null,
  ragKnowledgeBaseEnabled
    ? {
        path: '/rag-knowledge-base',
        element: <RagKnowledgeBasePage />,
      }
    : null,
  ragEnabled
    ? {
        path: '/kendra',
        element: <KendraSearchPage />,
      }
    : null,
  agentEnabled
    ? {
        path: '/agent',
        element: <AgentChatPage />,
      }
    : null,
  {
    path: '*',
    element: <NotFound />,
  },
].flatMap((r) => (r !== null ? [r] : []));

const router = createBrowserRouter([
  {
    path: '/',
    element: samlAuthEnabled ? <AuthWithSAML /> : <AuthWithUserpool />,
    children: routes,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Authenticator.Provider>
      <RouterProvider router={router} />
    </Authenticator.Provider>
  </React.StrictMode>
);
