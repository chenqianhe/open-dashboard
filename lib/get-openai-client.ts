import OpenAI from "openai";
import { getBaseUrlAndKey } from "./get-baseurl-and-key";

export const getOpenAiClient = async (kv: KVNamespace) => {
    const { apiKey, baseUrl } = await getBaseUrlAndKey(kv);
    return new OpenAI({ apiKey, baseURL: baseUrl });
}
