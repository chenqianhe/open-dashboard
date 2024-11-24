import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getBaseUrlAndKey } from "@/lib/get-baseurl-and-key";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: { projId: string, fileId: string } }
) {
  const { fileId } = params;
  const ctx = getRequestContext();
  const kv = ctx.env.OPEN_DASHBOARD_KV;

  const config = await getBaseUrlAndKey(kv, params.projId);

  const openai = new OpenAI({ 
    apiKey: config.apiKey, 
    baseURL: config.baseUrl 
  });

  try {
    const [fileInfo, response] = await Promise.all([
      openai.files.retrieve(fileId),
      openai.files.content(fileId)
    ]);
    const stream = response.body;

    if (!stream) {
      throw new Error("No content stream available");
    }

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${fileInfo.filename}"`,
        "Transfer-Encoding": "chunked",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });

  } catch (error: unknown) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
