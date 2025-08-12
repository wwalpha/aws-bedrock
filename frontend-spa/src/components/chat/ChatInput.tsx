import { useCallback, useRef } from 'react';
import { useChatStore } from '@/store';
import { Button } from '@/components/ui/button';
import { PlusCircle, Send, Square } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import type { Chat, ChatMessage } from 'typings';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';

function genId() {
  return (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).toLowerCase();
}

export default function ChatInput() {
  const navigate = useNavigate();
  const chats = useChatStore((s: any) => s.chats as Chat[]);
  const setChats = useChatStore((s: any) => s.setChats);
  const selectedChat = useChatStore((s: any) => s.selectedChat as Chat | null);
  const setSelectedChat = useChatStore((s: any) => s.setSelectedChat);
  const userInput = useChatStore((s: any) => s.userInput as string);
  const setUserInput = useChatStore((s: any) => s.setUserInput);
  const chatMessages = useChatStore((s: any) => s.chatMessages as ChatMessage[]);
  const setChatMessages = useChatStore((s: any) => s.setChatMessages);
  const isGenerating = useChatStore((s: any) => s.isGenerating as boolean);
  const setIsGenerating = useChatStore((s: any) => s.setIsGenerating);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const ensureChat = useCallback(() => {
    if (selectedChat) return selectedChat;
    const newChat: Chat = { id: genId(), name: 'New Chat', createdAt: new Date().toISOString() };
    setChats((prev: Chat[]) => [newChat, ...(prev || [])]);
    setSelectedChat(newChat);
    navigate(`${ROUTES.WORKSPACE}/${newChat.id}`, { replace: true });
    return newChat;
  }, [selectedChat, setChats, setSelectedChat, navigate]);

  const sendMessage = useCallback(
    (text: string) => {
      const chat = ensureChat();
      const userMsg: ChatMessage = {
        id: genId(),
        chatId: chat.id,
        role: 'user',
        content: text.trim(),
        createdAt: new Date().toISOString(),
      };
      setChatMessages((prev: ChatMessage[]) => [...prev, userMsg]);
      setUserInput('');
      // Simulate assistant response
      setIsGenerating(true);
      timeoutRef.current = window.setTimeout(() => {
        const assistant: ChatMessage = {
          id: genId(),
          chatId: chat.id,
          role: 'assistant',
          content: 'これはサンプル応答です。 (Placeholder response)',
          createdAt: new Date().toISOString(),
        };
        setChatMessages((prev: ChatMessage[]) => [...prev, assistant]);
        setIsGenerating(false);
      }, 800);
    },
    [ensureChat, setChatMessages, setUserInput, setIsGenerating]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!userInput.trim() || isGenerating) return;
      sendMessage(userInput);
    }
  };

  const handleStop = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsGenerating(false);
  };

  const lineHeightEmpty = 44; // px

  return (
    <div className="border-t pt-4 px-3">
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative flex items-stretch gap-2 rounded-xl border bg-background/60 px-3 py-0 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/50 focus-within:ring-2 focus-within:ring-primary transition min-h-[44px]">
          <div className="flex items-center self-stretch">
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground transition"
              title="Add (coming soon)"
            >
              <PlusCircle className="size-5" />
            </button>
          </div>
          <TextareaAutosize
            ref={inputRef as any}
            placeholder="Ask anything. Type '/' for prompts, '@' for files, and '#' for tools."
            className="flex-1 w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none focus:outline-none border-none m-0 scrollbar-thin leading-[1.25rem]"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            minRows={1}
            maxRows={12}
            style={{
              lineHeight: userInput ? '1.25rem' : `${lineHeightEmpty}px`,
              paddingTop: userInput ? '8px' : '0px',
              paddingBottom: userInput ? '8px' : '0px',
            }}
          />
          <div className="flex items-center self-stretch">
            {isGenerating ? (
              <Button size="icon" variant="secondary" className="size-8" onClick={handleStop} title="Stop">
                <Square className="size-4" />
              </Button>
            ) : (
              <Button
                size="icon"
                className="size-8"
                onClick={() => userInput.trim() && sendMessage(userInput)}
                disabled={!userInput.trim()}
                title="Send"
              >
                <Send className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
