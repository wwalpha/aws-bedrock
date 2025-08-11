import { useChatStore } from '@/store';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';

export default function Workspace() {
  const selectedWorkspace = useChatStore((s) => s.selectedWorkspace);

  return (
    <div className="flex h-full w-full min-w-0 min-h-0 flex-col p-4 overflow-hidden">
      <ChatHeader />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ChatMessages />
      </div>
      <ChatInput />
    </div>
  );
}
