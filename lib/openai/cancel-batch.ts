import { getRequestContext } from "@cloudflare/next-on-pages";
import { getOpenAiClient } from "../get-openai-client";


export async function cancelBatch(batchId: string) {
    const kv = getRequestContext().env.OPEN_DASHBOARD_KV;
    const openai = await getOpenAiClient(kv);
    try {
        const response = await openai.batches.cancel(batchId);
        return { success: true, data: response };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}
