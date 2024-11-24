import { getFileInfoKey, getFilesKeyPerfix } from "@/common/key/get-key";
import { getBaseUrlAndKey } from "@/lib/get-baseurl-and-key";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";
import OpenAI from "openai";


export const runtime = "edge";

export async function DELETE(request: Request, { params }: { params: { projId: string, fileId: string } }) {
  const { fileId } = params;
  const ctx = getRequestContext();
  const kv = ctx.env.OPEN_DASHBOARD_KV;

  const { apiKey, baseUrl } = await getBaseUrlAndKey(kv, params.projId);
  const openai = new OpenAI({ 
    apiKey, 
    baseURL: baseUrl 
  });

  const cacheKey = getFileInfoKey(apiKey, fileId);

  try {
    const response = await openai.files.del(fileId);
    const needClean = await kv.list({ prefix: getFilesKeyPerfix(apiKey) });
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
