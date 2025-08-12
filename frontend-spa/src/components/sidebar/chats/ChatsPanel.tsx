import { useMemo, useState } from 'react';
import { store } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { ChatItem } from './ChatItem.tsx';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import type { Chat } from 'typings';

function genId() {
  return (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)).toLowerCase();
}

export function ChatsPanel() {
  const chats = store((s: any) => s.chats as Chat[]);
  const setChats = store((s: any) => s.setChats);
  const selectedChat = store((s: any) => s.selectedChat as Chat | null);
  const setSelectedChat = store((s: any) => s.setSelectedChat);
  const navigate = useNavigate();

  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats || [];
    return (chats || []).filter((c: any) => (c?.name || '').toLowerCase().includes(q));
  }, [query, chats]);

  const handleCreate = () => {
    const newChat: Chat = {
      id: genId(),
      name: 'New Chat',
      createdAt: new Date().toISOString(),
    };
    setChats((prev: Chat[]) => [newChat, ...(prev || [])]);
    setSelectedChat(newChat);
    navigate(`${ROUTES.WORKSPACE}/${newChat.id}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chats" className="pl-8" />
        </div>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="mr-1 size-4" /> New
        </Button>
      </div>

      <div className="-mx-1">
        {(filtered || []).length === 0 ? (
          <div className="text-xs text-muted-foreground px-1 py-2">No chats yet</div>
        ) : (
          <ul className="space-y-1 px-1">
            {filtered.map((chat: Chat) => (
              <ChatItem key={chat.id} chat={chat} active={selectedChat?.id === chat.id} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
