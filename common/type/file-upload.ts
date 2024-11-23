import { z } from "zod";

export const ClientFileUploadSchema = z.object({
  file: z.instanceof(File, {
    message: "File is required",
  }).refine((file) => {
    const validTypes = [
      ".jsonl",
    ];
    return validTypes.some(type => file.name.endsWith(type));
  }, "Only JSONL files are allowed"),
  name: z.string().min(1, "Name is required"),
  purpose: z.enum(["batch"], {
    required_error: "Purpose is required",
    invalid_type_error: "Invalid purpose selected",
  }),
});

export const ServerFileUploadSchema = z.object({
  purpose: z.enum(["batch"], {
    required_error: "Purpose is required",
    invalid_type_error: "Invalid purpose selected",
  }),
});

export type ClientFileUploadInput = z.infer<typeof ClientFileUploadSchema>;
export type ServerFileUploadInput = z.infer<typeof ServerFileUploadSchema>;
