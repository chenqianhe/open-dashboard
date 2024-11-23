import { getRequestContext } from "@cloudflare/next-on-pages";
import OpenAI from "openai";


export async function getFileInfo(fileId: string) {
    const kv = getRequestContext().env.OPEN_DASHBOARD_KV;
    const config = await kv.get("api_config", "json") as { apiKey: string; baseUrl: string } | null;
    if (!config || !config.apiKey || !config.baseUrl) {
        throw new Error("Invalid config");
    }

    const cacheKey = `apiKey:${config.apiKey}:file:${fileId}`;
    const cached = await kv.get(cacheKey, "json");
    if (cached) {
        return {
            success: true as const,
            data: cached as OpenAI.Files.FileObject
        };
    }

    try {
        const openai = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseUrl });
        const fileInfo = await openai.files.retrieve(fileId);
        await kv.put(cacheKey, JSON.stringify(fileInfo), { expirationTtl: 60 * 60 * 30 });
        return {
            success: true as const,
            data: fileInfo
        };
    } catch (error) {
        return {
            success: false as const,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}
