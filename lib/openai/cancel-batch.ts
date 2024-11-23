import { getRequestContext } from "@cloudflare/next-on-pages";
import OpenAI from "openai";


export async function cancelBatch(batchId: string) {
    const kv = getRequestContext().env.OPEN_DASHBOARD_KV;
    const config = await kv.get("api_config", "json") as { apiKey: string; baseUrl: string } | null;
    if (!config || !config.apiKey || !config.baseUrl) {
        throw new Error("Invalid config");
    }
    try {
        const openai = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseUrl });
        const response = await openai.batches.cancel(batchId);
        return { success: true, data: response };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}
