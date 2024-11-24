"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ConfigSchema, configSchema } from "@/common/type/config";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ConfigFormProps = {
  projId: string;
  initialData?: {
    name?: string;
    baseUrl?: string;
    apiKey?: string;
  };
};

export function ConfigForm({ projId, initialData }: ConfigFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<ConfigSchema>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      projId,
      name: initialData?.name || "",
      baseUrl: initialData?.baseUrl || "https://api.openai.com/v1",
      apiKey: initialData?.apiKey || "",
    },
  });

  async function onSubmit(values: ConfigSchema) {
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Configuration saved successfully",
          variant: "default",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: "Failed to save configuration",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  }

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/projects/${projId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Configuration deleted successfully",
          variant: "default",
        });
        router.push('/proj');
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete configuration",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input 
                  className="w-full" 
                  placeholder="Project Name" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Please enter the project name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="baseUrl"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Base URL</FormLabel>
              <FormControl>
                <Input 
                  className="w-full" 
                  placeholder="https://api.openai.com/v1" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Please enter the base URL of the API
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input 
                  className="w-full"
                  type="password" 
                  placeholder="sk-..." 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Please enter your API Key
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex space-x-4">
          <Button type="submit">Save</Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
