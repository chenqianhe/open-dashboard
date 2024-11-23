import { getRequestContext } from "@cloudflare/next-on-pages";
import OpenAI from "openai";
import { getBaseUrlAndKey } from "../get-baseurl-and-key";
import { getBatchesKeyPerfix, getBatchKey } from "@/common/key/get-key";


export async function getBatchDetail(batchId: string) {
    const kv = getRequestContext().env.OPEN_DASHBOARD_KV;
    const config = await getBaseUrlAndKey(kv);

    const cacheKey = getBatchKey(config.apiKey, batchId);
    const cached = await kv.get(cacheKey, "json");
    if (cached) {
        return {
            success: true as const,
            data: cached as OpenAI.Batches.Batch
        };
    }

    const openai = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseUrl });
    try {
        const response = await openai.batches.retrieve(batchId);

        if (response.status === "completed" || response.status === "cancelled" || response.status === "failed" || response.status === "expired") {
            const needClean = await kv.list({ prefix: getBatchesKeyPerfix(config.apiKey) });
            await Promise.all([...needClean.keys.map(async (key) => {
                await kv.delete(key.name);
            }), kv.put(cacheKey, JSON.stringify(response), { expirationTtl: 60 * 60 * 24 * 30 })]);
        }

        return {
            success: true as const,
            data: response as OpenAI.Batches.Batch
        };
    } catch {
        return { success: false as const, error: "Failed to fetch batch detail" };
    }
}