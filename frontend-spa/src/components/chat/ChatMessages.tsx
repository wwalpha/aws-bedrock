export default function ChatMessages() {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 py-4">
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-lg bg-blue-600 px-3 py-2 text-white">Hello!</div>
      </div>
      <div className="flex justify-start">
        <div className="max-w-[80%] rounded-lg border px-3 py-2">Hi, how can I help you?</div>
      </div>
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-lg bg-blue-600 px-3 py-2 text-white">Show me a demo.</div>
      </div>
    </div>
  );
}
