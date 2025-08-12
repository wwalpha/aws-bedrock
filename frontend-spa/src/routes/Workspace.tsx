import { useEffect } from 'react';
import { useChatStore } from '@/store';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';

export default function Workspace() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const chats = useChatStore((s: any) => s.chats);
  const selectedChat = useChatStore((s: any) => s.selectedChat);
  const setSelectedChat = useChatStore((s: any) => s.setSelectedChat);

  // On mount / param change: align store with URL
  useEffect(() => {
    if (chatId) {
      if (!selectedChat || selectedChat.id !== chatId) {
        const found = (chats || []).find((c: any) => c.id === chatId);
        if (found) setSelectedChat(found);
        else if (chats?.length) {
          // Invalid id -> redirect to first chat
          navigate(`${ROUTES.WORKSPACE}/${chats[0].id}`, { replace: true });
        }
      }
    } else {
      // No chatId in URL: if we have a selected chat ensure URL reflects it
      if (selectedChat) {
        navigate(`${ROUTES.WORKSPACE}/${selectedChat.id}`, { replace: true });
      } else if (chats?.length) {
        setSelectedChat(chats[0]);
        navigate(`${ROUTES.WORKSPACE}/${chats[0].id}`, { replace: true });
      }
    }
  }, [chatId, chats, selectedChat, setSelectedChat, navigate]);

  return (
    <div className="flex h-full w-full min-w-0 min-h-0 flex-col p-4 overflow-hidden">
      <ChatHeader />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ChatMessages />
      </div>
      <ChatInput />
    </div>
  );
}
