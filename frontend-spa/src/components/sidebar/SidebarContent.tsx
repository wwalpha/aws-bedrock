import { useChatStore } from '@/store';

export type ContentType = 'chats' | 'presets' | 'prompts' | 'files' | 'collections' | 'assistants' | 'tools' | 'models';

interface Props {
  contentType: ContentType;
}

function getDisplayName(item: any): string {
  return (item?.name ?? item?.title ?? item?.filename ?? item?.id ?? 'Untitled') as string;
}

export function SidebarContent({ contentType }: Props) {
  const { chats, presets, prompts, files, collections, assistants, tools, models } = useChatStore((s: any) => s);

  const dataMap: Record<ContentType, any[]> = {
    chats: chats || [],
    presets: presets || [],
    prompts: prompts || [],
    files: files || [],
    collections: collections || [],
    assistants: assistants || [],
    tools: tools || [],
    models: models || [],
  };

  const data = dataMap[contentType] || [];

  if (!data.length) {
    return <div className="text-xs text-muted-foreground">No {contentType} yet</div>;
  }

  return (
    <ul className="mt-2 space-y-1">
      {data.map((item: any) => (
        <li
          key={item.id || getDisplayName(item)}
          className="text-sm text-foreground/80 truncate rounded-md border p-2 hover:bg-accent/30"
        >
          {getDisplayName(item)}
        </li>
      ))}
    </ul>
  );
}
