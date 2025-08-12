import { useMemo, useRef, useEffect } from 'react';
import { useChatStore } from '@/store';
import type { ChatMessage } from 'typings';
import { ChatMessageItem } from './ChatMessageItem';

export default function ChatMessages() {
  const selectedChat = useChatStore((s: any) => s.selectedChat);
  const messages = useChatStore((s: any) => s.chatMessages as ChatMessage[]);
  const listRef = useRef<HTMLDivElement | null>(null);

  const chatMessages = useMemo(
    () => (selectedChat ? messages.filter((m) => m.chatId === selectedChat.id) : []),
    [messages, selectedChat]
  );

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [chatMessages.length]);

  if (!selectedChat) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Start a new chat to begin.
      </div>
    );
  }

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto py-4">
      <div className="mx-auto w-full max-w-2xl space-y-6 px-2">
        {chatMessages.map((m, i) => (
          <ChatMessageItem key={m.id} message={m} isLast={i === chatMessages.length - 1} />
        ))}
        {chatMessages.length === 0 && <div className="text-xs text-muted-foreground">No messages yet. Say hi!</div>}
      </div>
    </div>
  );
}
