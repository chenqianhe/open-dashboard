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

type ConfigFormProps = {
  initialData?: {
    baseUrl?: string;
    apiKey?: string;
  };
};

export function ConfigForm({ initialData }: ConfigFormProps) {
  const { toast } = useToast();
  const form = useForm<ConfigSchema>({
    resolver: zodResolver(configSchema),
    defaultValues: {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
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
        
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
