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
import { CreateBatchInput, CreateBatchSchema } from "@/common/type/create-batch";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MAX_FILE_SIZE } from "@/common/constants";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function CreateBatchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [inputMethod, setInputMethod] = useState<"upload" | "select">("upload");

  const form = useForm<CreateBatchInput>({
    resolver: zodResolver(CreateBatchSchema),
    defaultValues: {
      completionWindow: "24h",
      endpoint: "/v1/chat/completions",
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOpen(open);
  };

  async function onSubmit(data: CreateBatchInput) {
    try {
      setIsCreating(true);

      const response = await fetch("/api/batches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json() as { error: string };
        throw new Error(error.error || "Failed to create batch");
      }

      toast({
        title: "Success",
        description: "Batch created successfully",
      });
      const { id } = await response.json() as { id: string };
      router.push(`/batches/${id}`);
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create batch",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds Cloudflare Edge Runtime limit: ${MAX_FILE_SIZE} bytes`);
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("purpose", "batch");

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(65000),
      });

      if (!response.ok) {
        const error = await response.json() as { error: string };
        throw new Error(error.error || "Failed to upload file");
      }

      const { id } = await response.json() as { id: string };
      return id;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">Create Batch</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Batch</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fileId"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel>Input File</FormLabel>
                  <div className="flex items-center space-x-2 justify-between">
                  <RadioGroup
                    defaultValue="upload"
                    value={inputMethod}
                    onValueChange={(value) => setInputMethod(value as "upload" | "select")}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upload" id="upload" />
                      <Label htmlFor="upload">Upload new</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="select" id="select" />
                      <Label htmlFor="select">Select existing</Label>
                    </div>
                  </RadioGroup>
                    {inputMethod === "select" && <Link href="/files" target="_blank" rel="noreferrer noopener" className="text-sm text-green-600 flex items-center gap-1">
                        Browse files
                        <ExternalLink className="h-4 w-4 flex-shrink-0 text-green-600" />
                    </Link>}
                  </div>
                  
                  <FormControl>
                    {inputMethod === "upload" ? (
                      <div className="grid w-full gap-1.5">
                        <Input
                          type="file"
                          accept=".jsonl"
                          multiple={false}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setIsCreating(true);
                              const fileId = await handleFileUpload(file);
                              if (fileId) {
                                field.onChange(fileId);
                                setInputMethod("select");
                              }
                              setIsCreating(false);
                            }
                          }}
                          className="w-full"
                        />
                        <p className="text-sm text-muted-foreground">
                          Upload a JSONL file containing your data
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Input 
                          placeholder="file-..." 
                          {...field}
                        />
                      </div>
                    )}
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Add a jsonl file of request inputs for the batch
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="completionWindow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Completion Window</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select window" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="24h">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    The time frame within which the batch should be processed
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select endpoint" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="/v1/chat/completions">/v1/chat/completions</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    The endpoint to be used for all requests in the batch
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 