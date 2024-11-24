import { getFilesKeyPerfix } from "@/common/key/get-key";
import { ServerFileUploadSchema } from "@/common/type/file-upload";
import { getBaseUrlAndKey } from "@/lib/get-baseurl-and-key";
import { listFiles } from "@/lib/openai/list-files";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";


export async function GET(request: Request, { params }: { params: { projId: string } }) {
  const { searchParams } = new URL(request.url);
  const offset = searchParams.get("offset") || "0";
  const limit = searchParams.get("limit") || "20";
  const refresh = searchParams.get("refresh") === "true";
  return NextResponse.json(await listFiles(params.projId, {
      offset: parseInt(offset),
      limit: parseInt(limit),
      refresh,
  }));
}

export async function POST(request: Request, { params }: { params: { projId: string } }) {
    const ctx = getRequestContext();
    const kv = ctx.env.OPEN_DASHBOARD_KV;
  
    const { apiKey, baseUrl } = await getBaseUrlAndKey(kv, params.projId);
    const openai = new OpenAI({ 
      apiKey, 
      baseURL: baseUrl 
    });

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const purpose = formData.get("purpose") as string;
    
    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith('.jsonl')) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }

    const result = ServerFileUploadSchema.safeParse({
      purpose,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    try {
        const response = await openai.files.create({
            file,
            purpose: purpose as OpenAI.Files.FileCreateParams["purpose"],
        });
        
        if (!response.id) {
            return NextResponse.json(
                { error: "Failed to upload file" },
                { status: 500 }
            );
        }

        const needClean = await kv.list({ prefix: getFilesKeyPerfix(apiKey) });
        await Promise.all(needClean.keys.map(async (key) => {
            kv.delete(key.name);
        }));

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
