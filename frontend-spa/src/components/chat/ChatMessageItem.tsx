import React, { useState, useCallback, useEffect } from 'react';
import type { ChatMessage } from 'typings';
import { useChatStore } from '@/store';
import { cn } from '@/lib/utils';
import { Copy, Edit2, RefreshCcw, Save, X, Image as ImgIcon, FileText } from 'lucide-react';
import { Markdown } from './Markdown';

interface Props {
  message: ChatMessage;
  isLast: boolean;
}

export function ChatMessageItem({ message, isLast }: Props) {
  const setChatMessages = useChatStore((s: any) => s.setChatMessages);
  const isGenerating = useChatStore((s: any) => s.isGenerating as boolean);
  const setIsGenerating = useChatStore((s: any) => s.setIsGenerating);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const isUser = message.role === 'user';

  const updateContent = (newContent: string) => {
    setChatMessages((prev: ChatMessage[]) =>
      prev.map((m) => (m.id === message.id ? { ...m, content: newContent } : m))
    );
  };

  const handleCopy = () => navigator.clipboard?.writeText(message.content).catch(() => {});
  const handleSave = () => {
    updateContent(draft.trim());
    setEditing(false);
  };
  const handleRegenerate = () => {
    if (!isLast) return;
    setIsGenerating(true);
    setTimeout(() => {
      updateContent(message.content + '\n\n(Regenerated sample)');
      setIsGenerating(false);
    }, 700);
  };

  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const images = message.imagePaths || [];

  const closeViewer = useCallback(() => setViewerIndex(null), []);
  const showPrev = useCallback(() => {
    setViewerIndex((idx) => (idx == null ? null : (idx - 1 + images.length) % images.length));
  }, [images.length]);
  const showNext = useCallback(() => {
    setViewerIndex((idx) => (idx == null ? null : (idx + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (viewerIndex == null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeViewer();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [viewerIndex, closeViewer, showPrev, showNext]);

  return (
    <div className={cn('group relative flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex w-full gap-4', isUser && 'flex-row-reverse')}>
        <div className={cn('flex-shrink-0 mt-0.5')}>
          <div
            className={cn(
              'size-8 rounded flex items-center justify-center border text-xs font-medium select-none',
              isUser ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/40 border-border'
            )}
          >
            {isUser ? 'You' : 'AI'}
          </div>
        </div>
        <div className={cn('flex-1 min-w-0 space-y-2', !isUser && 'pr-10')}>
          <div className={cn('text-[11px] uppercase tracking-wide font-semibold opacity-60', isUser && 'text-right')}>
            {isUser ? 'You' : 'Assistant'}
          </div>
          <div className={cn('relative')}>
            {editing ? (
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full min-h-[80px] rounded-md border bg-background/40 p-2 text-sm focus:outline-none"
              />
            ) : (
              <div
                className={cn(
                  'whitespace-pre-wrap break-words text-sm leading-relaxed',
                  isUser && 'bg-primary text-primary-foreground rounded-lg px-3 py-2 shadow-sm inline-block'
                )}
              >
                <Markdown content={message.content} />
              </div>
            )}
            <div
              className={cn(
                'absolute -top-2 opacity-0 group-hover:opacity-100 transition',
                isUser ? '-left-1' : 'right-0'
              )}
            >
              {!editing ? (
                <div className="flex gap-1">
                  <Action onClick={handleCopy} icon={<Copy className="size-3" />} />
                  {isUser && <Action onClick={() => setEditing(true)} icon={<Edit2 className="size-3" />} />}
                  {!isUser && isLast && (
                    <Action
                      disabled={isGenerating}
                      onClick={handleRegenerate}
                      icon={<RefreshCcw className="size-3" />}
                    />
                  )}
                </div>
              ) : (
                <div className="flex gap-1">
                  <Action onClick={handleSave} icon={<Save className="size-3" />} />
                  <Action
                    onClick={() => {
                      setEditing(false);
                      setDraft(message.content);
                    }}
                    icon={<X className="size-3" />}
                  />
                </div>
              )}
            </div>
          </div>
          {(message.imagePaths?.length || message.fileNames?.length) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {message.imagePaths?.map((p, idx) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setViewerIndex(idx)}
                  className="relative size-24 rounded border border-border overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p}
                    alt="attachment"
                    className="object-cover w-full h-full bg-muted"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as any).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 hidden items-center justify-center bg-black/40 text-white text-[10px] group-hover:flex">
                    <ImgIcon className="size-4" />
                  </div>
                </button>
              ))}
              {message.fileNames?.map((n) => (
                <div
                  key={n}
                  className="flex items-center gap-1 rounded border px-2 py-1 text-[10px] text-muted-foreground bg-background/60"
                >
                  <FileText className="size-3" /> {n}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {viewerIndex != null && images[viewerIndex] && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeViewer();
          }}
        >
          <div className="flex items-center justify-between p-3 text-white text-xs">
            <span>
              Image {viewerIndex + 1} / {images.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
              >
                ◀
              </button>
              <button
                type="button"
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
              >
                ▶
              </button>
              <button
                type="button"
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  closeViewer();
                }}
              >
                ✕
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[viewerIndex]}
              alt="preview"
              className="max-h-full max-w-full object-contain rounded shadow-lg"
              draggable={false}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface ActionProps {
  onClick?: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
}
function Action({ onClick, disabled, icon }: ActionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'size-6 rounded border bg-background/70 flex items-center justify-center hover:bg-background text-muted-foreground hover:text-foreground transition',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
    >
      {icon}
    </button>
  );
}
