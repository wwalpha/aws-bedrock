import { TabsContent } from '@/components/ui/tabs';
import { WorkspaceSwitcher } from '@/components/utility/WorkspaceSwitcher';
import { WorkspaceSettings } from '@/components/workspace/WorkspaceSettings';
import { SidebarContent } from '@/components/sidebar/SidebarContent';
import { SIDEBAR_CATEGORIES } from '@/components/sidebar/constants';
import { ChatsPanel } from '@/components/sidebar/chats/ChatsPanel';

export function Sidebar() {
  return (
    <aside className="border-r bg-background/50 w-[350px] shrink-0 p-3">
      <div className="flex items-center border-b-2 pb-2">
        <WorkspaceSwitcher />
        <WorkspaceSettings />
      </div>
      <div className="w-full mt-2">
        {SIDEBAR_CATEGORIES.map((c) => (
          <TabsContent key={c} value={c}>
            <div className="text-xs text-muted-foreground capitalize">{c}</div>
            {c === 'chats' ? <ChatsPanel /> : <SidebarContent contentType={c as any} />}
          </TabsContent>
        ))}
      </div>
    </aside>
  );
}
