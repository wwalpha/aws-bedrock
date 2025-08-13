import { FC, useState } from 'react';
import { store } from '@/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2 } from 'lucide-react';
import type { Conversation } from 'typings';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';

interface ChatItemProps {
  chat: Conversation;
  active?: boolean;
}

export const ChatItem: FC<ChatItemProps> = ({ chat, active }) => {
  const setSelectedChat = store((s: any) => s.setSelectedChat);
  const setChats = store((s: any) => s.setChats);
  const navigate = useNavigate();

  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState(chat.name || '');

  const handleOpen = () => {
    setSelectedChat(chat);
    navigate(`${ROUTES.WORKSPACE}/${chat.id}`);
  };
  const handleRename = () => {
    setChats((prev: Conversation[]) =>
      prev.map((c: Conversation) => (c.id === chat.id ? { ...c, name, updatedAt: new Date().toISOString() } : c))
    );
    setRenameOpen(false);
  };
  const handleDelete = () => {
    setChats((prev: Conversation[]) => {
      const next = prev.filter((c: Conversation) => c.id !== chat.id);
      return next;
    });
    // If this was the selected chat, clear selection and navigate to fallback
    setSelectedChat((prev: Conversation | null) => {
      if (prev?.id === chat.id) {
        const remaining = (store.getState().chats as Conversation[]).filter((c) => c.id !== chat.id);
        if (remaining.length) {
          const first = remaining[0];
          navigate(`${ROUTES.WORKSPACE}/${first.id}`, { replace: true });
          return first;
        } else {
          navigate(ROUTES.WORKSPACE, { replace: true });
          return null;
        }
      }
      return prev;
    });
    setDeleteOpen(false);
  };

  return (
    <li
      className={cn(
        'group flex items-center justify-between rounded-md border px-2 py-1.5 text-sm hover:bg-accent/30',
        active && 'border-primary/50 bg-accent/40'
      )}
      onClick={handleOpen}
    >
      <div className="truncate">{chat.name || 'Untitled'}</div>
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          size="icon"
          variant="ghost"
          className="size-8"
          onClick={(e) => {
            e.stopPropagation();
            setRenameOpen(true);
          }}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-8 text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteOpen(true);
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename chat</DialogTitle>
          </DialogHeader>
          <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete chat</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete “{chat.name}”?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
};
