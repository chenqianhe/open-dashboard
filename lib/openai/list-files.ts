import OpenAI from "openai";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const listFiles = async (
  offset: number = 0,
  limit: number = 20,
  refresh: boolean = false
) => {
  const kv = getRequestContext().env.OPEN_DASHBOARD_KV;

  const config = await kv.get("api_config", "json") as { apiKey: string; baseUrl: string } | null;
  if (!config || !config.apiKey || !config.baseUrl) {
    throw new Error("Invalid config");
  }

  const cacheKey = `apiKey:${config.apiKey}:files:${offset}:${limit}`
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
