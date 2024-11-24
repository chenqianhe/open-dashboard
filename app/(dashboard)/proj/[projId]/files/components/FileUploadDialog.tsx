"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClientFileUploadSchema, type ClientFileUploadInput } from "@/common/type/file-upload";
import { Input } from "@/components/ui/input";
import { MAX_FILE_SIZE } from "@/common/constants";

export function FileUploadDialog({ projId }: { projId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ClientFileUploadInput>({
    resolver: zodResolver(ClientFileUploadSchema),
    defaultValues: {
      purpose: "batch",
      name: "",
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset({
        purpose: "batch",
        name: "",
        file: undefined,
      });
    }
    setIsOpen(open);
  };

  async function onSubmit(data: ClientFileUploadInput) {
    try {
      setIsUploading(true);
      
      if (data.file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds Cloudflare Edge Runtime limit: ${MAX_FILE_SIZE} bytes`);
      }

      const formData = new FormData();
      const renamedFile = new File([data.file], data.name + '.jsonl', { type: data.file.type });
      formData.append("file", renamedFile);
      formData.append("purpose", data.purpose);

      const response = await fetch(`/api/projects/${projId}/files`, {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(65000),
      });

      if (!response.ok) {
        const error = await response.json() as { error: string };
        throw new Error(error.error || "Failed to upload file");
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      router.push(`/proj/${projId}/files`);
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">Upload</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a File</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <div className="grid w-full gap-1.5">
                      <Input
                        type="file"
                        accept=".jsonl"
                        multiple={false}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file);
                          if (file) {
                            const fileName = file.name.replace('.jsonl', '');
                            form.setValue('name', fileName);
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Upload a JSONL file containing your data
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter file name" 
                      {...field}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    The name of the uploaded file
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="batch">Batch</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    The purpose of the uploaded file
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 