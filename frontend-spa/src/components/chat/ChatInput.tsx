import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function ChatInput() {
  return (
    <div className="border-t pt-2">
      <div className="flex items-end gap-2">
        <Textarea placeholder="Type a message..." className="min-h-[44px]" />
        <Button>Send</Button>
      </div>
    </div>
  );
}
