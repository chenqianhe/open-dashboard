import { getConfigKey } from "@/common/key/get-key";
import { getRequestContext } from "@cloudflare/next-on-pages";

export async function getConfig(projId: string) {
  const kv = getRequestContext().env.OPEN_DASHBOARD_KV;
  try {
    const config = await kv.get(getConfigKey(projId), "json");
    return config || null;
  } catch (error) {
    console.error('Error fetching config from KV:', error);
    return null;
  }
}

export async function setConfig(projId: string, config: { baseUrl: string; apiKey: string; name: string }) {
  const kv = getRequestContext().env.OPEN_DASHBOARD_KV;
  try {
    await kv.put(getConfigKey(projId), JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving config to KV:', error);
    return false;
  }
} 
