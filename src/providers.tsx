import { StyleProvider } from "@ant-design/cssinjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { TRPCClientError, httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { App, ConfigProvider, message } from "antd";
import zhTW from "antd/es/locale/zh_TW";
import "dayjs/locale/zh-tw";
import { StrictMode, useState } from "react";
import { HeadProvider } from "react-head";
import "tailwindcss/tailwind.css";
import { theme } from "./theme";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import type { AppRouter } from "./server/app";

// Create a new router instance
export const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const trpc = createTRPCReact<AppRouter>({ abortOnUnmount: true });

interface Props {
  container: HTMLDivElement;
}

export const Providers = ({ container }: Props) => {
  const [msg, msgContext] = message.useMessage();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            retryDelay: (_, err) => {
              if (err instanceof TRPCClientError) {
                const content = JSON.parse(err.message)?.[0];
                msg.error(`${content.code}: ${content.message}`, 4.5);
              }
              return 0;
            },
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
              locale={zhTW}
              theme={theme}
            >
              <StyleProvider hashPriority="high">
                <App>
                  {msgContext}
                  <RouterProvider router={router} />
                </App>
              </StyleProvider>
            </ConfigProvider>
          </HeadProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </StrictMode>
  );
};
