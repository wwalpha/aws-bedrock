import { useEffect, useRef } from 'react';
import { store } from '@/store';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';

export default function Workspace() {
  const { chatId } = useParams();
  // 個別 selector で不要な再レンダーを抑止
  const idToken = store((s: any) => s.idToken);
  const accessToken = store((s: any) => s.accessToken);
  if (!idToken && !accessToken) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  const navigate = useNavigate();
  const chats = store((s: any) => s.chats);
  const selectedChat = store((s: any) => s.selectedChat);
  const setSelectedChat = store((s: any) => s.setSelectedChat);

  // On mount / param change: align store with URL
  // ループ防止用の最終適用状態記録
  const lastAppliedRef = useRef<{ chatIdParam: string | undefined; selectedId: string | null } | null>(null);

  useEffect(() => {
    const current = {
      chatIdParam: chatId,
      selectedId: selectedChat?.id || null,
    };
    // 同一状態なら何もしない
    if (
      lastAppliedRef.current &&
      lastAppliedRef.current.chatIdParam === current.chatIdParam &&
      lastAppliedRef.current.selectedId === current.selectedId
    ) {
      return;
    }

    if (chatId) {
      if (!selectedChat || selectedChat.id !== chatId) {
        const found = (chats || []).find((c: any) => c.id === chatId);
        if (found) {
          setSelectedChat(found);
        } else if (chats?.length) {
          navigate(`${ROUTES.WORKSPACE}/${chats[0].id}`, { replace: true });
        }
      }
    } else {
      if (selectedChat) {
        navigate(`${ROUTES.WORKSPACE}/${selectedChat.id}`, { replace: true });
      } else if (chats?.length) {
        setSelectedChat(chats[0]);
        navigate(`${ROUTES.WORKSPACE}/${chats[0].id}`, { replace: true });
      }
    }
    lastAppliedRef.current = current;
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
