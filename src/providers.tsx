import { StyleProvider } from "@ant-design/cssinjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  TRPCClientError,
  createTRPCProxyClient,
  httpBatchLink,
} from "@trpc/client";
import {
  createTRPCReact,
  type inferReactQueryProcedureOptions,
} from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { App, ConfigProvider, message } from "antd";
import type { Locale } from "antd/es/locale";
import enUS from "antd/es/locale/en_US";
import zhTW from "antd/es/locale/zh_TW";
import "dayjs/locale/zh-tw";
import { StrictMode, useCallback, useMemo, useState } from "react";
import { HeadProvider } from "react-head";
import { I18nextProvider, useTranslation } from "react-i18next";
import "tailwindcss/tailwind.css";
import i18n from "./i18n";
import type { AppRouter } from "./server/router";
import { theme } from "./theme";

interface Props {
  children?: React.ReactNode;
}

interface ProviderProps extends Props {
  container: HTMLDivElement;
}

const antdLocales: Record<string, Locale> = {
  "en-US": enUS,
  "zh-TW": zhTW,
};

export const Providers = ({ container, children }: ProviderProps) => {
  return (
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <HeadProvider
          headTags={[<title key="title">{import.meta.env.VITE_TITLE}</title>]}
        >
          <ApiProvider>
            <AntdProvider container={container}>{children}</AntdProvider>
          </ApiProvider>
        </HeadProvider>
      </I18nextProvider>
    </StrictMode>
  );
};

const AntdProvider = ({ container, children }: ProviderProps) => {
  const { i18n } = useTranslation();
  return (
    <ConfigProvider
      getPopupContainer={() => container}
      locale={antdLocales[i18n.language]}
      theme={theme}
      autoInsertSpaceInButton={false}
    >
      <StyleProvider hashPriority="high">
        <App>{children}</App>
      </StyleProvider>
    </ConfigProvider>
  );
};

export const trpc = createTRPCReact<AppRouter>({ abortOnUnmount: true });
export const trpcVanilla = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_PREFIX,
    }),
  ],
});
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

const ApiProvider = ({ children }: Props) => {
  const [msg, msgContext] = message.useMessage();
  const { i18n } = useTranslation();
  const retry = useCallback(
    (_: number, err: unknown) => {
      if (err instanceof TRPCClientError) {
        msg.error(err.message, 4.5);
      }
      return false;
    },
    [msg],
  );
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry, refetchOnWindowFocus: false },
          mutations: { retry },
        },
      }),
  );
  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: import.meta.env.VITE_API_PREFIX,
            headers: {
              "Accept-Language": i18n.language,
            },
          }),
        ],
      }),
    [i18n.language],
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {msgContext}
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};
