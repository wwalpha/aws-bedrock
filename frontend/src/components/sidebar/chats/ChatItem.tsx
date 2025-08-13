import { FC, useState } from 'react';
import { store } from '@/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2 } from 'lucide-react';
import type { Chat } from 'typings';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';

interface ChatItemProps {
  chat: Chat;
  active?: boolean;
}

export const ChatItem: FC<ChatItemProps> = ({ chat, active }) => {
  const activeChatId = store((s: any) => s.activeChatId as string | null);
  const setActiveChatId = store((s: any) => s.setActiveChatId);
  const setChats = store((s: any) => s.setChats);
  const navigate = useNavigate();

  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [title, setTitle] = useState(chat.title || '');

  const handleOpen = () => {
    setActiveChatId(chat.id);
    navigate(`${ROUTES.WORKSPACE}/${chat.id}`);
  };
  const handleRename = () => {
    setChats((prev: Chat[]) => prev.map((c: Chat) => (c.id === chat.id ? { ...c, title } : c)));
    setRenameOpen(false);
  };
  const handleDelete = () => {
    setChats((prev: Chat[]) => prev.filter((c: Chat) => c.id !== chat.id));
    if (activeChatId === chat.id) {
      const remaining = (store.getState().chats as Chat[]).filter((c) => c.id !== chat.id);
      if (remaining.length) {
        const first = remaining[0];
        setActiveChatId(first.id);
        navigate(`${ROUTES.WORKSPACE}/${first.id}`, { replace: true });
      } else {
        setActiveChatId(null);
        navigate(ROUTES.WORKSPACE, { replace: true });
      }
    }
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
      <div className="truncate">{chat.title || 'Untitled'}</div>
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
          <Input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
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
          <p className="text-sm text-muted-foreground">Are you sure you want to delete “{chat.title}”?</p>
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
