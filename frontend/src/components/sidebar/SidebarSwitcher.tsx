import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SIDEBAR_CATEGORIES } from './constants';
import { ProfileSettings } from '@/components/utility/ProfileSettings';
import { MessageSquareText, Sparkles, FileText, BookOpen, Bot, Wrench, Pencil, Boxes } from 'lucide-react';

const iconFor = (c: string, size = 22) => {
  switch (c) {
    case 'chats':
      return <MessageSquareText size={size} />;
    case 'presets':
      return <Sparkles size={size} />;
    case 'prompts':
      return <Pencil size={size} />;
    case 'models':
      return <Boxes size={size} />;
    case 'files':
      return <FileText size={size} />;
    case 'collections':
      return <BookOpen size={size} />;
    case 'assistants':
      return <Bot size={size} />;
    case 'tools':
      return <Wrench size={size} />;
    default:
      return null;
  }
};

export function SidebarSwitcher() {
  return (
    <div className="flex h-full w-[60px] flex-col justify-between border-r py-3">
      <TabsList className="bg-transparent grid grid-rows-8 h-[440px] mx-auto p-0">
        {SIDEBAR_CATEGORIES.map((c) => (
          <TabsTrigger
            key={c}
            value={c}
            className="data-[state=active]:bg-muted/40 data-[state=active]:text-foreground/90 h-10 w-10 rounded-md p-0 text-muted-foreground"
            aria-label={c}
          >
            {iconFor(c)}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="flex items-center justify-center">
        <ProfileSettings />
      </div>
    </div>
  );
}
