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

type ConfigFormProps = {
  initialData?: {
    baseUrl?: string;
    apiKey?: string;
  };
};

export function ConfigForm({ initialData }: ConfigFormProps) {
  const form = useForm<ConfigSchema>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      baseUrl: initialData?.baseUrl || "",
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
        // TODO: add success tip
        console.log('Config saved successfully');
      } else {
        // TODO: add error tip
        console.error('Failed to save config');
      }
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="baseUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base URL</FormLabel>
              <FormControl>
                <Input placeholder="https://api.openai.com/v1" {...field} />
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
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input type="password" placeholder="sk-..." {...field} />
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
