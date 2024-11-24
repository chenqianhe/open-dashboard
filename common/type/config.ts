import { z } from "zod";

export const configSchema = z.object({
  projId: z.string().min(1, { message: "Project ID is required" }),
  name: z.string().min(1, { message: "Project Name is required" }),
  baseUrl: z.string().url({ message: "Please enter a valid URL" }),
  apiKey: z.string().min(1, { message: "API Key is required" }),
});

export type ConfigSchema = z.infer<typeof configSchema>;
