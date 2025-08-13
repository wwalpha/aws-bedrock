import { useCallback, useRef, useState } from 'react';
import { store } from '@/store';
import { Button } from '@/components/ui/button';
import { PlusCircle, Send, Square, X } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import type { Chat, ChatMessage } from 'typings';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';

function genId() {
  return (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).toLowerCase();
}

export default function ChatInput() {
  const navigate = useNavigate();
  const chats = store((s: any) => s.chats as Chat[]);
  const setChats = store((s: any) => s.setChats);
  const activeChatId = store((s: any) => s.activeChatId as string | null);
  const setActiveChatId = store((s: any) => s.setActiveChatId);
  const userInput = store((s: any) => s.userInput as string);
  const setUserInput = store((s: any) => s.setUserInput);
  const chatMessages = store((s: any) => s.chatMessages as ChatMessage[]);
  const setChatMessages = store((s: any) => s.setChatMessages);
  const isGenerating = store((s: any) => s.isGenerating as boolean);
  const setIsGenerating = store((s: any) => s.setIsGenerating);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const newMessageImages = store((s: any) => s.newMessageImages as any[]);
  const setNewMessageImages = store((s: any) => s.setNewMessageImages);
  const newMessageFiles = store((s: any) => s.newMessageFiles as any[]);
  const setNewMessageFiles = store((s: any) => s.setNewMessageFiles);

  const createChat = store((s: any) => s.createChat as () => Promise<void>);

  const ensureChat = useCallback(async () => {
    if (activeChatId) {
      const found = (chats || []).find((c: Chat) => c.id === activeChatId);
      if (found) return found;
    }
    // API 経由で新規チャット作成 (id は slice 内で生成)
    await createChat();
    // fetchChats が別途呼ばれている前提で即座に chats へ反映されない場合はローカル fallback を検討
    // 現在は単純に最新 chats 先頭を選ぶ
    const latest = store.getState().chats as Chat[];
    const first = latest[0];
    if (first) {
      setActiveChatId(first.id);
      navigate(`${ROUTES.WORKSPACE}/${first.id}`, { replace: true });
      return first;
    }
    throw new Error('Chat creation failed');
  }, [activeChatId, chats, createChat, setActiveChatId, navigate]);

  const revokeAllObjectUrls = () => {
    newMessageImages.forEach((img: any) => img.url && URL.revokeObjectURL(img.url));
  };

  const addFiles = (files: File[]) => {
    if (!files.length) return;
    const images: any[] = [];
    const otherFiles: any[] = [];
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        images.push({ id: genId(), name: file.name, size: file.size, mimeType: file.type, url });
      } else {
        otherFiles.push({ id: genId(), name: file.name, size: file.size, mimeType: file.type });
      }
    });
    if (images.length) setNewMessageImages((prev: any[]) => [...prev, ...images]);
    if (otherFiles.length) setNewMessageFiles((prev: any[]) => [...prev, ...otherFiles]);
  };

  const sliceSendMessage = store((s: any) => s.sendMessage as (content: string) => Promise<void>);
  const setAbortGenerate = store((s: any) => s.setAbortGenerate as (v: AbortController | null) => void);

  const sendMessage = useCallback(
    async (text: string) => {
      const chat = await ensureChat();
      const userMsg: ChatMessage = {
        id: genId(),
        chatId: chat.id,
        role: 'user',
        content: text.trim(),
        createdAt: new Date().toISOString(),
        imagePaths: newMessageImages.map((i: any) => i.url).filter(Boolean),
        fileNames: newMessageFiles.map((f: any) => f.name),
      };
      setChatMessages((prev: ChatMessage[]) => [...prev, userMsg]);
      setUserInput('');
      // clear attachments after send
      revokeAllObjectUrls();
      setNewMessageImages([]);
      setNewMessageFiles([]);
      // 実 API 呼び出し
      setIsGenerating(true);
      const controller = new AbortController();
      setAbortGenerate(controller);
      try {
        await sliceSendMessage(text);
      } finally {
        setIsGenerating(false);
        setAbortGenerate(null);
      }
    },
    [
      ensureChat,
      setChatMessages,
      setUserInput,
      setIsGenerating,
      newMessageImages,
      newMessageFiles,
      sliceSendMessage,
      setAbortGenerate,
    ]
  );

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if ((!userInput.trim() && newMessageImages.length === 0 && newMessageFiles.length === 0) || isGenerating) return;
      await sendMessage(userInput);
    }
  };

  const abortGenerate = store((s: any) => s.abortGenerate as AbortController | null);
  const handleStop = () => {
    if (abortGenerate) {
      abortGenerate.abort();
      setAbortGenerate(null);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsGenerating(false);
  };

  const handlePickFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
    e.target.value = '';
  };

  const removeImage = (id: string) => {
    setNewMessageImages((prev: any[]) => {
      const target = prev.find((i) => i.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((i) => i.id !== id);
    });
  };
  const removeFile = (id: string) => {
    setNewMessageFiles((prev: any[]) => prev.filter((f) => f.id !== id));
  };

  const lineHeightEmpty = 44; // px

  // Drag & drop support
  const [dragging, setDragging] = useState(false);
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items?.length) setDragging(true);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  const handleDragLeave = (e: React.DragEvent) => {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setDragging(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    addFiles(files);
    setDragging(false);
  };

  return (
    <div className="border-t pt-4 px-3">
      <div className="mx-auto w-full max-w-3xl space-y-2">
        {(newMessageImages.length > 0 || newMessageFiles.length > 0) && (
          <div className="flex flex-col gap-2 rounded-xl border bg-background/40 p-3">
            {newMessageImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newMessageImages.map((img: any) => (
                  <div key={img.id} className="relative group size-24 border border-border rounded overflow-hidden">
                    <img src={img.url} alt={img.name} className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 size-5 rounded bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      title="Remove image"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {newMessageFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newMessageFiles.map((f: any) => (
                  <div
                    key={f.id}
                    className="group flex items-center gap-2 rounded border px-2 py-1 text-xs text-muted-foreground bg-background/60"
                  >
                    <span className="truncate max-w-[140px]" title={f.name}>
                      {f.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(f.id)}
                      className="size-5 flex items-center justify-center rounded hover:bg-muted/60"
                      title="Remove file"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div
          className="relative flex items-stretch gap-2 rounded-xl border bg-background/60 px-3 py-0 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/50 focus-within:ring-2 focus-within:ring-primary transition min-h-[44px]"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {dragging && (
            <div className="absolute inset-0 z-10 rounded-xl border-2 border-primary/60 bg-primary/10 flex items-center justify-center pointer-events-none text-sm font-medium text-primary">
              Drop files to attach
            </div>
          )}
          <div className="flex items-center self-stretch">
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground transition"
              onClick={handlePickFiles}
              title="Attach files or images"
            >
              <PlusCircle className="size-5" />
            </button>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFilesSelected} />
          </div>
          <TextareaAutosize
            ref={inputRef as any}
            placeholder="Ask anything. Type '/' for prompts, '@' for files, and '#' for tools."
            className="flex-1 w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none focus:outline-none border-none m-0 scrollbar-thin leading-[1.25rem]"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            minRows={1}
            maxRows={12}
            style={{
              lineHeight: userInput ? '1.25rem' : `${lineHeightEmpty}px`,
              paddingTop: userInput ? '8px' : '0px',
              paddingBottom: userInput ? '8px' : '0px',
            }}
          />
          <div className="flex items-center self-stretch">
            {isGenerating ? (
              <Button size="icon" variant="secondary" className="size-8" onClick={handleStop} title="Stop">
                <Square className="size-4" />
              </Button>
            ) : (
              <Button
                size="icon"
                className="size-8"
                onClick={() =>
                  (userInput.trim() || newMessageImages.length || newMessageFiles.length) && sendMessage(userInput)
                }
                disabled={!userInput.trim() && newMessageImages.length === 0 && newMessageFiles.length === 0}
                title="Send"
              >
                <Send className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
