import OpenAI from "openai";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getBaseUrlAndKey } from "../get-baseurl-and-key";
import { getFilesKey } from "@/common/key/get-key";

export const listFiles = async (
  offset: number = 0,
  limit: number = 20,
  refresh: boolean = false
): Promise<{ success: true, data: OpenAI.Files.FileObject[] } | { success: false, error: string }> => {
  const kv = getRequestContext().env.OPEN_DASHBOARD_KV;
  const config = await getBaseUrlAndKey(kv);

  const cacheKey = getFilesKey(config.apiKey, offset, limit);
  if (!refresh) {
    const cached = await kv.get(cacheKey, "json");
    if (cached) {
      return {
        success: true as const,
        data: cached as OpenAI.Files.FileObject[]
      };
    }
  }

  const openai = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseUrl });
  try {
    const response = await openai.files.list({
      order: "desc",
      limit,
      after: offset > 0 ? String(offset) : undefined
    });

    await kv.put(cacheKey, JSON.stringify(response.data), { expirationTtl: 60 * 60 * 1 });

    return {
      success: true as const,
      data: response.data
    };
  } catch {
    return {
      success: false as const,
      error: "Failed to fetch files"
    };
  }
};
