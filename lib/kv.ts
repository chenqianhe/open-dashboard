import { getRequestContext } from "@cloudflare/next-on-pages";

export async function getConfig() {
  const kv = getRequestContext().env.KV;
  try {
    const config = await kv.get("api_config", "json");
    return config || null;
  } catch (error) {
    console.error('Error fetching config from KV:', error);
    return null;
  }
}

export async function setConfig(config: { baseUrl: string; apiKey: string }) {
  const kv = getRequestContext().env.KV;
  try {
    await kv.put("api_config", JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving config to KV:', error);
    return false;
  }
} 
