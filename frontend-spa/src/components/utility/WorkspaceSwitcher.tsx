import { useMemo, useState } from 'react';
import { useChatStore } from '@/store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Workspace } from 'typings';
import { ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react';

export function WorkspaceSwitcher() {
  const workspaces = useChatStore((s: any) => s.workspaces as Workspace[]);
  const setWorkspaces = useChatStore((s: any) => s.setWorkspaces);
  const selectedWorkspace = useChatStore((s: any) => s.selectedWorkspace as Workspace | null);
  const setSelectedWorkspace = useChatStore((s: any) => s.setSelectedWorkspace);

  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState('');

  const currentName = selectedWorkspace?.name || 'Default Workspace';

  const genId = () => (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)).toLowerCase();

  const ensureDefault = useMemo(() => {
    if (!workspaces?.length) {
      const ws = { id: genId(), name: 'Default Workspace', createdAt: new Date().toISOString() } as Workspace;
      setWorkspaces([ws]);
      setSelectedWorkspace(ws);
    }
    return true;
  }, [workspaces, setWorkspaces, setSelectedWorkspace]);

  const createWorkspace = () => {
    const ws: Workspace = { id: genId(), name: 'New Workspace', createdAt: new Date().toISOString() };
    setWorkspaces((prev: Workspace[]) => [ws, ...(prev || [])]);
    setSelectedWorkspace(ws);
  };

  const renameWorkspace = () => {
    const id = selectedWorkspace?.id;
    if (!id) return;
    setWorkspaces((prev: Workspace[]) =>
      prev.map((w) => (w.id === id ? { ...w, name, updatedAt: new Date().toISOString() } : w))
    );
    setSelectedWorkspace((w: Workspace | null) => (w && w.id === id ? { ...w, name } : w));
    setRenameOpen(false);
  };

  const deleteWorkspace = () => {
    const id = selectedWorkspace?.id;
    if (!id) return;
    setWorkspaces((prev: Workspace[]) => prev.filter((w) => w.id !== id));
    const remaining = (useChatStore.getState().workspaces as Workspace[]).filter((w) => w.id !== id);
    if (remaining.length) setSelectedWorkspace(remaining[0]);
    else setSelectedWorkspace(null);
    setDeleteOpen(false);
  };

  if (!ensureDefault) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="px-2 gap-1">
            {currentName}
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          {workspaces.map((w) => (
            <DropdownMenuItem key={w.id} onClick={() => setSelectedWorkspace(w)}>
              {w.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={createWorkspace}>
            <Plus className="mr-2 size-4" /> New Workspace
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setName(currentName);
              setRenameOpen(true);
            }}
          >
            <Pencil className="mr-2 size-4" /> Rename
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-2 size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Workspace</DialogTitle>
          </DialogHeader>
          <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={renameWorkspace}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workspace</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This will remove the current workspace.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteWorkspace}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
