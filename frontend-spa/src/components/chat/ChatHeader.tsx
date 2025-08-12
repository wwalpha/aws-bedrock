import { useState, useMemo } from 'react';
import { useChatStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import { ModelSettings } from './ModelSettings';

export default function ChatHeader() {
  const selectedChat = useChatStore((s: any) => s.selectedChat);
  const [open, setOpen] = useState(false);
  const chatSettings = useChatStore((s: any) => s.chatSettings);
  const models = useChatStore((s: any) => s.availableHostedModels as any[]);
  const currentModelLabel = useMemo(() => {
    if (!chatSettings?.model) return null;
    const found = (models || []).find((m) => m.id === chatSettings.model);
    return found?.label || found?.id || chatSettings.model;
  }, [chatSettings?.model, models]);
  return (
    <div className="flex items-center justify-between border-b pb-2 gap-4">
      <div className="min-w-0 flex-1 truncate">
        <div className="flex items-center gap-3 min-w-0">
          <span className="truncate font-semibold text-sm md:text-base">{selectedChat?.name || 'New Chat'}</span>
          {currentModelLabel && (
            <span
              className="hidden md:inline-flex items-center rounded border px-2 py-0.5 text-[11px] leading-4 text-muted-foreground bg-background/40 max-w-[180px] truncate"
              title={currentModelLabel}
            >
              {currentModelLabel}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[11px] font-medium max-w-[200px]"
          title="Model settings"
          onClick={() => setOpen(true)}
        >
          <Settings2 className="size-4 mr-1 shrink-0" />
          <span className="truncate">{currentModelLabel || 'Select Model'}</span>
        </Button>
      </div>
      <ModelSettings open={open} onOpenChange={setOpen} />
    </div>
  );
}
