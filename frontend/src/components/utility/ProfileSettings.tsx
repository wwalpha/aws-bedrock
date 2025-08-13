import { FC, useState } from 'react';
import { store } from '@/store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCog } from 'lucide-react';
import { WithTooltip } from '@/components/ui/with-tooltip';

export const ProfileSettings: FC = () => {
  const profile = store((s: any) => s.profile);
  const setProfile = store((s: any) => s.setProfile);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(profile?.username || '');
  const [displayName, setDisplayName] = useState(profile?.display_name || '');

  const handleSave = () => {
    // For SPA demo: persist in local store only
    setProfile((p: any) => ({
      ...(p || {}),
      username,
      display_name: displayName,
    }));
    setOpen(false);
  };

  return (
    <>
      <WithTooltip
        display={<div>Profile Settings</div>}
        side="right"
        trigger={
          <Button size="icon" variant="ghost" className="size-10" onClick={() => setOpen(true)}>
            <UserCog className="size-5" />
          </Button>
        }
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid gap-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="display_name">Display name</Label>
              <Input id="display_name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
