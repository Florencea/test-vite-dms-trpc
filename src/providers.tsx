import { StyleProvider } from "@ant-design/cssinjs";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { TRPCClientError, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { App, ConfigProvider, message } from "antd";
import type { Locale } from "antd/es/locale";
import enUS from "antd/es/locale/en_US";
import zhTW from "antd/es/locale/zh_TW";
import "dayjs/locale/zh-tw";
import { StrictMode, useCallback, useEffect, useState } from "react";
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
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries();
  }, [i18n.language, queryClient]);
  return (
    <ConfigProvider
      getPopupContainer={() => container}
      autoInsertSpaceInButton={false}
      locale={antdLocales[i18n.language]}
      theme={theme}
    >
      <StyleProvider hashPriority="high">
        <App>{children}</App>
      </StyleProvider>
    </ConfigProvider>
  );
};

export const trpc = createTRPCReact<AppRouter>({ abortOnUnmount: true });

const ApiProvider = ({ children }: Props) => {
  const [msg, msgContext] = message.useMessage();
  const retry = useCallback(
    (_: number, err: unknown) => {
      if (err instanceof TRPCClientError) {
        msg.error(`${err.name}: ${err.message}`, 4.5);
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
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_API_PREFIX,
        }),
      ],
    }),
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
