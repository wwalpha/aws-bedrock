import { useState } from 'react';
import { useChatStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export function WorkspaceSettings() {
  const [open, setOpen] = useState(false);
  const profile = useChatStore((s: any) => s.profile);
  const setProfile = useChatStore((s: any) => s.setProfile);

  const [workspaceTitle, setWorkspaceTitle] = useState(profile?.workspaceTitle || '');
  const [compactMode, setCompactMode] = useState(!!profile?.compactMode);

  const save = () => {
    setProfile((p: any) => ({ ...(p || {}), workspaceTitle, compactMode }));
    setOpen(false);
  };

  return (
    <>
      <Button variant="ghost" size="sm" className="ml-auto px-2" onClick={() => setOpen(true)}>
        Settings
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Workspace Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-1">
              <Label htmlFor="ws-title">Title</Label>
              <Input id="ws-title" value={workspaceTitle} onChange={(e) => setWorkspaceTitle(e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compact">Compact mode</Label>
              <Switch id="compact" checked={compactMode} onCheckedChange={setCompactMode} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
