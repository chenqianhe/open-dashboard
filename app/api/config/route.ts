import { NextResponse } from 'next/server';
import { setConfig } from '@/lib/kv';
import { configSchema } from '@/common/type/config';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getProjectsKey } from '@/common/key/get-key';
import { Project } from '@/common/type/project';

export const runtime = 'edge';

export async function POST(request: Request) {
  const kv = getRequestContext().env.OPEN_DASHBOARD_KV;

  try {
    const body = await request.json();
    
    const result = configSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { projId, name, baseUrl, apiKey } = result.data;

    const projects = ((await kv.get<Project[]>(getProjectsKey(), "json")) ?? []).filter(p => p.id !== projId);

    const success = await Promise.all([
      setConfig(projId, {
        name,
        baseUrl,
        apiKey,
      }),
      kv.put(getProjectsKey(), JSON.stringify([{ id: projId, name }, ...projects])),
    ]);

    if (success) {
      return NextResponse.json({ status: 'success' });
    } else {
      return NextResponse.json(
        { error: 'Failed to save config' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json(
      { error: 'Failed to save config' }, 
      { status: 500 }
    );
  }
}
