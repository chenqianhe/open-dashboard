import { getConfigKey } from "@/common/key/get-key";

export const getBaseUrlAndKey = async (kv: KVNamespace, projId: string) => {
    const config = await kv.get(getConfigKey(projId), "json") as { apiKey: string; baseUrl: string } | null;
    if (!config || !config.apiKey || !config.baseUrl) {
        throw new Error("Invalid config");
    }
    return config;
}
