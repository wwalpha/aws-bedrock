import { useEffect, useState } from 'react';
import { store } from '@/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface BackendModel {
  id: string;
  label?: string;
  provider?: string;
  contextLength?: number;
  supportsStreaming?: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ModelSettings({ open, onOpenChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const models = store((s: any) => s.availableHostedModels as BackendModel[]);
  const setModels = store((s: any) => s.setAvailableHostedModels);
  const chatSettings = store((s: any) => s.chatSettings);
  const setChatSettings = store((s: any) => s.setChatSettings);

  const [modelId, setModelId] = useState<string | undefined>(chatSettings.model);
  const [temperature, setTemperature] = useState<number>(chatSettings.temperature ?? 0.5);
  const [contextLength, setContextLength] = useState<number>(4096);
  const [includeProfile, setIncludeProfile] = useState(true);
  const [includeWorkspace, setIncludeWorkspace] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(true);

  useEffect(() => {
    if (!open) return;
    if (models?.length) return;
    setLoading(true);
    setError(null);
    fetch('/api/models')
      .then((r) => {
        if (!r.ok) throw new Error(r.status + '');
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setModels(data);
      })
      .catch((e) => setError(e.message || 'Failed to load models'))
      .finally(() => setLoading(false));
  }, [open, models, setModels]);

  const save = () => {
    setChatSettings((prev: any) => ({ ...prev, model: modelId, temperature, top_p: contextLength }));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Model Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-sm">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide">Model</Label>
            <div className="rounded border bg-background/40 p-3 min-h-[60px] flex items-center">
              {loading && <span className="text-xs text-muted-foreground">Loading models…</span>}
              {error && <span className="text-xs text-destructive">{error}</span>}
              {!loading && !error && (
                <select
                  className="bg-transparent text-sm w-full outline-none"
                  value={modelId || ''}
                  onChange={(e) => setModelId(e.target.value || undefined)}
                >
                  <option value="">(Select a model)</option>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label || m.id}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="text-[11px] text-muted-foreground">
              Unlock models by entering API keys in profile settings.
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide">Prompt</Label>
            <textarea
              className="w-full rounded border bg-background/40 p-2 text-sm resize-none h-20"
              defaultValue="You are a friendly, helpful AI assistant."
            />
          </div>
          <div className="space-y-2">
            <button
              type="button"
              className="text-xs font-semibold tracking-wide inline-flex items-center gap-1 border rounded px-2 py-1 bg-background/40 hover:bg-background/60"
              onClick={() => setAdvancedOpen((v) => !v)}
            >
              {advancedOpen ? 'Advanced Settings ▲' : 'Advanced Settings ▼'}
            </button>
            {advancedOpen && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Temperature: {temperature.toFixed(2)}</span>
                  </div>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={[temperature]}
                    onValueChange={(v) => setTemperature(v[0])}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Context Length: {contextLength}</span>
                  </div>
                  <Slider
                    min={512}
                    max={32768}
                    step={256}
                    value={[contextLength]}
                    onValueChange={(v) => setContextLength(v[0])}
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      className="size-4"
                      checked={includeProfile}
                      onChange={(e) => setIncludeProfile(e.target.checked)}
                    />
                    <span>Chats Include Profile Context</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      className="size-4"
                      checked={includeWorkspace}
                      onChange={(e) => setIncludeWorkspace(e.target.checked)}
                    />
                    <span>Chats Include Workspace Instructions</span>
                  </label>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs uppercase tracking-wide">Embeddings Provider</Label>
                  <div className="rounded border bg-background/40 p-2 text-xs">OpenAI</div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button size="sm" onClick={save} disabled={!modelId}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
