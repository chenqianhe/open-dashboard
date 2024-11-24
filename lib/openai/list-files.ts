import OpenAI from "openai";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getBaseUrlAndKey } from "../get-baseurl-and-key";
import { getFilesKey } from "@/common/key/get-key";

export const listFiles = async (
  projId: string,
  config: {
    offset: number;
    limit: number;
    refresh: boolean;
  } = {
    offset: 0,
    limit: 20,
    refresh: false
  }
): Promise<{ success: true, data: OpenAI.Files.FileObject[] } | { success: false, error: string }> => {
  const kv = getRequestContext().env.OPEN_DASHBOARD_KV;
  const { apiKey, baseUrl } = await getBaseUrlAndKey(kv, projId);

  const cacheKey = getFilesKey(apiKey, config.offset, config.limit);
  if (!config.refresh) {
    const cached = await kv.get(cacheKey, "json");
    if (cached) {
      return {
        success: true as const,
        data: cached as OpenAI.Files.FileObject[]
      };
    }
  }

  const openai = new OpenAI({ apiKey, baseURL: baseUrl });
  try {
    const response = await openai.files.list({
      order: "desc",
      limit: config.limit,
      after: config.offset > 0 ? String(config.offset) : undefined
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
