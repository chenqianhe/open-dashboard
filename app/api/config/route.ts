import { NextResponse } from 'next/server';
import { setConfig } from '@/lib/kv';
import { configSchema } from '@/common/type/config';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const result = configSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { baseUrl, apiKey } = result.data;

    if (!baseUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const success = await setConfig({
      baseUrl,
      apiKey,
    });

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
