declare global {
    interface CloudflareEnv {
      OPEN_DASHBOARD_KV: KVNamespace;
    }
    namespace NodeJS {
      interface ProcessEnv {
        ADMIN_USERNAME: string;
        ADMIN_PASSWORD: string;
        JWT_SECRET: string;
      }
    }
}

export {};
