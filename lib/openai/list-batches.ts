import OpenAI from "openai";
import { getConfig } from "../kv";


export async function listBatches() {
  const config = await getConfig() as { apiKey: string; baseUrl: string } | null | undefined;
  if (!config || !config.apiKey || !config.baseUrl) {
    throw new Error("Invalid config");
  }
  const openai = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseUrl });
  try {
    const response = await openai.batches.list({
      limit: 50
    });
    return {
      success: true as const,
      data: response.data
    };
  } catch {
    return {
      success: false as const,
      error: "Failed to fetch batches"
    };
  }
}
