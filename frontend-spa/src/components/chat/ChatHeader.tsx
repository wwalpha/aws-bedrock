import { useChatStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';

export default function ChatHeader() {
  const selectedChat = useChatStore((s: any) => s.selectedChat);
  return (
    <div className="flex items-center justify-between border-b pb-2 gap-4">
      <div className="min-w-0 flex-1 truncate font-semibold text-sm md:text-base">
        {selectedChat?.name || 'New Chat'}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="size-8" title="Quick settings (coming soon)">
          <Settings2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
