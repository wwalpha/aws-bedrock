import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { WithTooltip } from '@/components/ui/with-tooltip';

export default function Demo() {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">UI Demo</h2>
      <div className="flex gap-2 items-center">
        <Button
          onClick={() =>
            toast({ title: 'Hello', description: 'This is a toast from SPA' })
          }
        >
          Show Toast
        </Button>

        <WithTooltip trigger={<Button variant="outline">Hover me</Button>} display="Tooltip content" />
      </div>
    </div>
  );
}
