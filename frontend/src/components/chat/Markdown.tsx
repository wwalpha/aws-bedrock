import React from 'react';
import { cn } from '@/lib/utils';

// Minimal markdown subset: paragraphs, inline code `code`, fenced blocks ```lang\n...```, bold **text**, italics *text*.
export function Markdown({ content }: { content: string }) {
  const blocks = React.useMemo(() => parseMarkdown(content), [content]);
  return (
    <div className="prose prose-invert max-w-none text-sm">
      {blocks.map((b, i) =>
        b.type === 'code' ? (
          <pre key={i} className="rounded-md bg-muted/60 p-3 overflow-x-auto text-xs">
            <code className={cn(b.lang && `language-${b.lang}`)}>{b.text}</code>
          </pre>
        ) : (
          <p key={i} dangerouslySetInnerHTML={{ __html: b.html }} />
        )
      )}
    </div>
  );
}

interface MdBlockCode {
  type: 'code';
  lang?: string;
  text: string;
}
interface MdBlockHtml {
  type: 'html';
  html: string;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string);
}

function inlineFormat(s: string) {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-muted/70 text-xs">$1</code>');
}

function parseMarkdown(src: string): (MdBlockCode | MdBlockHtml)[] {
  const lines = src.split(/\r?\n/);
  const out: (MdBlockCode | MdBlockHtml)[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const codeMatch = line.match(/^```(.*)$/);
    if (codeMatch) {
      const lang = codeMatch[1].trim() || undefined;
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        buf.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].startsWith('```')) i++;
      out.push({ type: 'code', lang, text: buf.join('\n') });
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('```')) {
      para.push(lines[i]);
      i++;
    }
    if (para.length) {
      out.push({ type: 'html', html: inlineFormat(para.join(' ')) });
    }
    while (i < lines.length && lines[i].trim() === '') i++;
  }
  return out;
}
