import { getRequestContext } from "@cloudflare/next-on-pages";
import OpenAI from "openai";
import { getBaseUrlAndKey } from "../get-baseurl-and-key";
import { getFileInfoKey } from "@/common/key/get-key";


export async function getFileInfo(projId: string, fileId: string) {
    const kv = getRequestContext().env.OPEN_DASHBOARD_KV;
    const config = await getBaseUrlAndKey(kv, projId);

    const cacheKey = getFileInfoKey(config.apiKey, fileId);
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
