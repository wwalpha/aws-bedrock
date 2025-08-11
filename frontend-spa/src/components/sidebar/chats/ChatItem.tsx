import { FC, useState } from 'react';
import { useChatStore } from '@/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2 } from 'lucide-react';

interface ChatItemProps {
  chat: any;
  active?: boolean;
}

export const ChatItem: FC<ChatItemProps> = ({ chat, active }) => {
  const setSelectedChat = useChatStore((s: any) => s.setSelectedChat);
  const setChats = useChatStore((s: any) => s.setChats);

  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState(chat.name || '');

  const handleOpen = () => setSelectedChat(chat);
  const handleRename = () => {
    setChats((prev: any[]) => prev.map((c) => (c.id === chat.id ? { ...c, name } : c)));
    setRenameOpen(false);
  };
  const handleDelete = () => {
    setChats((prev: any[]) => prev.filter((c) => c.id !== chat.id));
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
