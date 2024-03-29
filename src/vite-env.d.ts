/// <reference types="vite/client" />
import { resources } from "./i18n";

interface ImportMetaEnv {
  readonly VITE_TITLE: string;
  readonly VITE_FAVICON: string;
  readonly VITE_THEME_COLOR_PRIMARY: string;
  readonly VITE_WEB_BASE: string;
  readonly VITE_OUTDIR: string;
  readonly VITE_API_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "i18next" {
  interface CustomTypeOptions {
    resources: (typeof resources)["en-US"];
  }
}
