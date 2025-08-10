import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categories = ['chats', 'presets', 'prompts', 'files', 'collections', 'assistants', 'tools', 'models'] as const;

export function Sidebar() {
  return (
    <aside className="border-r bg-background/50 w-60 shrink-0 p-3">
      <Tabs defaultValue="chats" className="w-full">
        <TabsList className="w-full flex flex-wrap gap-1">
          {categories.map((c) => (
            <TabsTrigger key={c} value={c} className="capitalize">
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((c) => (
          <TabsContent key={c} value={c}>
            <div className="text-xs text-muted-foreground">{c} list</div>
            <ul className="mt-2 space-y-1">
              <li className="text-sm text-foreground/80">Sample item A</li>
              <li className="text-sm text-foreground/80">Sample item B</li>
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </aside>
  );
}
