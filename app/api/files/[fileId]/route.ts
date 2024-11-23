import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";
import OpenAI from "openai";


export const runtime = "edge";

export async function DELETE(request: Request, { params }: { params: { fileId: string } }) {
  const { fileId } = params;
  const ctx = getRequestContext();
  const kv = ctx.env.OPEN_DASHBOARD_KV;

  const config = await kv.get("api_config", "json") as { 
    apiKey: string; 
    baseUrl: string 
  } | null;
  
  if (!config?.apiKey || !config?.baseUrl) {
    return NextResponse.json(
      { error: "Invalid configuration" },
      { status: 500 }
    );
  }
  const openai = new OpenAI({ 
    apiKey: config.apiKey, 
    baseURL: config.baseUrl 
  });

  const cacheKey = `apiKey:${config.apiKey}:file:${fileId}`;

  try {
    const response = await openai.files.del(fileId);
    const needClean = await kv.list({ prefix: `apiKey:${config.apiKey}:files:` });
    const promises = needClean.keys.map(async (key) => {
      kv.delete(key.name);
    });
    await Promise.all([...promises, kv.delete(cacheKey)]);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete file" },
      { status: 500 }
    );
  }
}
