import { useMemo, useRef, useEffect } from 'react';
import { useChatStore } from '@/store';
import type { ChatMessage } from 'typings';
import { cn } from '@/lib/utils';

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
    <div ref={listRef} className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
      {chatMessages.map((m) => {
        const isUser = m.role === 'user';
        return (
          <div key={m.id} className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[82%] rounded-lg px-3 py-2 text-sm shadow-sm whitespace-pre-wrap break-words',
                isUser ? 'bg-primary text-primary-foreground' : 'bg-muted/40 border border-border'
              )}
            >
              {m.content}
            </div>
          </div>
        );
      })}
      {chatMessages.length === 0 && <div className="text-xs text-muted-foreground">No messages yet. Say hi!</div>}
    </div>
  );
}
