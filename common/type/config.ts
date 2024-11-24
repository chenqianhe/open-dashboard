import { z } from "zod";

export const configSchema = z.object({
  projId: z.string().min(1, { message: "Project ID 不能为空" }),
  name: z.string().min(1, { message: "Project Name 不能为空" }),
  baseUrl: z.string().url({ message: "请输入有效的URL" }),
  apiKey: z.string().min(1, { message: "API Key 不能为空" }),
});

export type ConfigSchema = z.infer<typeof configSchema>;
