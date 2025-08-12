import { useMemo, useState } from 'react';
import { store } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type PanelKey = 'presets' | 'prompts' | 'files' | 'collections' | 'assistants' | 'tools' | 'models';

const displayLabel: Record<PanelKey, string> = {
  presets: 'Preset',
  prompts: 'Prompt',
  files: 'File',
  collections: 'Collection',
  assistants: 'Assistant',
  tools: 'Tool',
  models: 'Model',
};

function genId() {
  return (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)).toLowerCase();
}

export function NonChatCrudPanel({ kind }: { kind: PanelKey }) {
  const state = store((s: any) => s);
  const items: any[] = state[kind] || [];
  const setItems = state[`set${kind.charAt(0).toUpperCase()}${kind.slice(1)}`] as (v: any) => void;

  // Optional selected setters for known kinds
  const selectedSetterMap: Partial<Record<PanelKey, any>> = {
    presets: state.setSelectedPreset,
    assistants: state.setSelectedAssistant,
  };
  const setSelected = selectedSetterMap[kind as PanelKey];

  const [query, setQuery] = useState('');
  const [renameOpenId, setRenameOpenId] = useState<string | null>(null);
  const [deleteOpenId, setDeleteOpenId] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i: any) => (i?.name || i?.title || '').toLowerCase().includes(q));
  }, [items, query]);

  const handleCreate = () => {
    const newItem = {
      id: genId(),
      name: `New ${displayLabel[kind]}`,
      createdAt: new Date().toISOString(),
    };
    setItems((prev: any[]) => [newItem, ...(prev || [])]);
    setSelected?.(newItem);
  };

  const openRename = (item: any) => {
    setNameDraft(item?.name || item?.title || '');
    setRenameOpenId(item.id);
  };

  const handleRename = () => {
    const id = renameOpenId;
    if (!id) return;
    setItems((prev: any[]) =>
      prev.map((i) => (i.id === id ? { ...i, nameDraft, name: nameDraft, updatedAt: new Date().toISOString() } : i))
    );
    setRenameOpenId(null);
  };

  const handleDelete = () => {
    const id = deleteOpenId;
    if (!id) return;
    setItems((prev: any[]) => prev.filter((i) => i.id !== id));
    // Clear selection if matches
    if (setSelected) {
      setSelected((sel: any) => (sel?.id === id ? null : sel));
    }
    setDeleteOpenId(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${kind}`}
            className="pl-8"
          />
        </div>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="mr-1 size-4" /> New
        </Button>
      </div>

      <div className="-mx-1">
        {(filtered || []).length === 0 ? (
          <div className="text-xs text-muted-foreground px-1 py-2">No {kind} yet</div>
        ) : (
          <ul className="space-y-1 px-1">
            {filtered.map((item: any) => (
              <li
                key={item.id}
                className="group flex items-center justify-between rounded-md border px-2 py-1.5 text-sm hover:bg-accent/30"
              >
                <div className="truncate">{item?.name || item?.title || 'Untitled'}</div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="icon" variant="ghost" className="size-8" onClick={() => openRename(item)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-destructive"
                    onClick={() => setDeleteOpenId(item.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={!!renameOpenId} onOpenChange={(o) => !o && setRenameOpenId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {displayLabel[kind]}</DialogTitle>
          </DialogHeader>
          <Input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} autoFocus />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenameOpenId(null)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteOpenId} onOpenChange={(o) => !o && setDeleteOpenId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {displayLabel[kind]}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this {displayLabel[kind]}?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpenId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
