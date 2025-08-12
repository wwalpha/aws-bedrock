import { useCallback, useRef } from 'react';
import { useChatStore } from '@/store';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Send, Square } from 'lucide-react';
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

  return (
    <div className="border-t pt-4 px-3">
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative rounded-xl border bg-background/60 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/50 focus-within:ring-2 focus-within:ring-primary transition">
          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            title="Add (coming soon)"
          >
            <PlusCircle className="size-5" />
          </button>
          <Textarea
            ref={inputRef}
            placeholder="Ask anything. Type '/' for prompts, '@' for files, and '#' for tools."
            className="m-0 h-auto min-h-[60px] max-h-[320px] w-full resize-none border-none bg-transparent py-4 pl-12 pr-16 text-sm leading-relaxed focus-visible:ring-0 focus-visible:outline-none scrollbar-thin"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {isGenerating ? (
              <Button size="icon" variant="secondary" className="size-9" onClick={handleStop} title="Stop">
                <Square className="size-4" />
              </Button>
            ) : (
              <Button
                size="icon"
                className="size-9"
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
