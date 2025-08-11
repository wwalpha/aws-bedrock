import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkspaceSwitcher } from '@/components/utility/WorkspaceSwitcher';
import { WorkspaceSettings } from '@/components/workspace/WorkspaceSettings';
import { SidebarContent } from '@/components/sidebar/SidebarContent';

const categories = ['chats', 'presets', 'prompts', 'files', 'collections', 'assistants', 'tools', 'models'] as const;

export function Sidebar() {
  return (
    <aside className="border-r bg-background/50 w-[350px] shrink-0 p-3">
      <div className="flex items-center border-b-2 pb-2">
        <WorkspaceSwitcher />
        <WorkspaceSettings />
      </div>
      <Tabs defaultValue="chats" className="w-full mt-2">
        <TabsList className="w-full flex flex-wrap gap-1">
          {categories.map((c) => (
            <TabsTrigger key={c} value={c} className="capitalize">
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((c) => (
          <TabsContent key={c} value={c}>
            <div className="text-xs text-muted-foreground capitalize">{c}</div>
            <SidebarContent contentType={c as any} />
          </TabsContent>
        ))}
      </Tabs>
    </aside>
  );
}
