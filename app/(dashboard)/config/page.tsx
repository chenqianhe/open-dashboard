import { getConfig } from '@/lib/kv';
import { ConfigForm } from '@/components/config-form';

export const runtime = 'edge';

export default async function ConfigPage() {
  const config = await getConfig();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">API Configuration</h2>
      <ConfigForm initialData={config || undefined} />
    </div>
  );
}
