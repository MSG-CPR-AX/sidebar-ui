/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITLAB_BASE_URL: string
  readonly VITE_GITLAB_PROJECT_PATH: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_USE_MOCK: string
  readonly VITE_API_BASE_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
