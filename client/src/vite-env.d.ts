/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_VERCEL_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
