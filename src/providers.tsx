import { StyleProvider } from "@ant-design/cssinjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TRPCClientError, httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { App, ConfigProvider, message } from "antd";
import zhTW from "antd/es/locale/zh_TW";
import "dayjs/locale/zh-tw";
import { StrictMode, useState } from "react";
import { HeadProvider } from "react-head";
import "tailwindcss/tailwind.css";
import type { AppRouter } from "./server/router";
import { theme } from "./theme";

export const trpc = createTRPCReact<AppRouter>({ abortOnUnmount: true });

interface Props {
  container: HTMLDivElement;
  children?: React.ReactNode;
}

export const Providers = ({ container, children }: Props) => {
  const [msg, msgContext] = message.useMessage();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (_, err) => {
              if (err instanceof TRPCClientError) {
                msg.error(`${err.name}: ${err.message}`, 4.5);
              }
              return false;
            },
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: import.meta.env.VITE_API_PREFIX,
        }),
      ],
    }),
  );
  return (
    <StrictMode>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <HeadProvider
            headTags={[<title key="title">{import.meta.env.VITE_TITLE}</title>]}
          >
            <ConfigProvider
              getPopupContainer={() => container}
              autoInsertSpaceInButton={false}
              locale={zhTW}
              theme={theme}
            >
              <StyleProvider hashPriority="high">
                <App>
                  {msgContext}
                  {children}
                </App>
              </StyleProvider>
            </ConfigProvider>
          </HeadProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </StrictMode>
  );
};
