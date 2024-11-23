import { z } from "zod";

export const CreateBatchSchema = z.object({
    fileId: z.string().startsWith("file-"),
    completionWindow: z.enum(["24h"]),
    endpoint: z.enum(["/v1/chat/completions"]),
});

export type CreateBatchInput = z.infer<typeof CreateBatchSchema>;
