// Incrementally consume a text streaming response (Server-Sent like or fetch body)
// Calls onChunk with each decoded text fragment and onDone at the end.
export async function consumeTextStream(
  stream: ReadableStream<Uint8Array>,
  { onChunk, onDone, signal }: { onChunk: (delta: string) => void; onDone?: () => void; signal?: AbortSignal }
) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  try {
    while (true) {
      if (signal?.aborted) break;
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        const text = decoder.decode(value, { stream: true });
        if (text) onChunk(text);
      }
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {}
    onDone?.();
  }
}
