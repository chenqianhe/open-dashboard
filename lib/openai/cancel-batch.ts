import { getRequestContext } from "@cloudflare/next-on-pages";
import { getBatchesKeyPerfix } from "@/common/key/get-key";
import { getBaseUrlAndKey } from "../get-baseurl-and-key";
import OpenAI from "openai";


export async function cancelBatch(batchId: string) {
    const kv = getRequestContext().env.OPEN_DASHBOARD_KV;
    const { apiKey, baseUrl } = await getBaseUrlAndKey(kv);
    const openai = new OpenAI({
        baseURL: baseUrl,
        apiKey,
    });
    try {
        const response = await openai.batches.cancel(batchId);
        const needClean = await kv.list({ prefix: getBatchesKeyPerfix(apiKey) });
        await Promise.all(needClean.keys.map(async (key) => {
            await kv.delete(key.name);
        }));
        return { success: true, data: response };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}
