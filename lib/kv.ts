import { getConfigKey } from "@/common/key/get-key";
import { getRequestContext } from "@cloudflare/next-on-pages";

export async function getConfig() {
  const kv = getRequestContext().env.OPEN_DASHBOARD_KV;
  try {
    const config = await kv.get(getConfigKey(), "json");
    return config || null;
  } catch (error) {
    console.error('Error fetching config from KV:', error);
    return null;
  }
}

export async function setConfig(config: { baseUrl: string; apiKey: string }) {
  const kv = getRequestContext().env.OPEN_DASHBOARD_KV;
  try {
    await kv.put(getConfigKey(), JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving config to KV:', error);
    return false;
  }
} 
