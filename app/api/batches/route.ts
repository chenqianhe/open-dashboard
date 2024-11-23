import { getBatchesKeyPerfix } from "@/common/key/get-key";
import { CreateBatchSchema } from "@/common/type/create-batch";
import { getBaseUrlAndKey } from "@/lib/get-baseurl-and-key";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

export const POST = async (request: Request) => {
    const body = await request.json();
    const validatedData = CreateBatchSchema.safeParse(body);

    if (!validatedData.success) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { fileId, completionWindow, endpoint } = validatedData.data;

    const kv = getRequestContext().env.OPEN_DASHBOARD_KV;
    const { baseUrl, apiKey } = await getBaseUrlAndKey(kv);

    const openai = new OpenAI({
        baseURL: baseUrl,
        apiKey,
    });

    try {
        const response = await openai.batches.create({
            input_file_id: fileId,
            completion_window: completionWindow,
            endpoint,
        });

        const needClean = await kv.list({ prefix: getBatchesKeyPerfix(apiKey) });
        await Promise.all(needClean.keys.map(async (key) => {
            await kv.delete(key.name);
        }));

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
