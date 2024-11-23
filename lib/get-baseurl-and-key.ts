import { getConfigKey } from "@/common/key/get-key";

export const getBaseUrlAndKey = async (kv: KVNamespace) => {
    const config = await kv.get(getConfigKey(), "json") as { apiKey: string; baseUrl: string } | null;
    if (!config || !config.apiKey || !config.baseUrl) {
        throw new Error("Invalid config");
    }
    return config;
}
