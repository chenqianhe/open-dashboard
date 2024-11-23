import { getConfig } from '@/lib/kv';
import { ConfigForm } from '@/components/config-form';

export const runtime = 'edge';

export default async function ConfigPage() {
  const config = await getConfig();

  return (
    <div className="container flex items-start justify-center min-h-[calc(100vh-4rem)] pt-36">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">API Configuration</h2>
          <p className="text-muted-foreground">
            Configure your OpenAI API settings
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <ConfigForm initialData={config || undefined} />
        </div>
      </div>
    </div>
  );
}
