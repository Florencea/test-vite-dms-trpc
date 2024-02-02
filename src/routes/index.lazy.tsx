import { useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getQueryKey } from "@trpc/react-query";
import { Button } from "antd";
import { useState } from "react";
import { SITE_LOGO } from "../constants";
import { trpc } from "../providers";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const queryClient = useQueryClient();
  const [enabled, setEnabled] = useState(false);
  const { data } = trpc.hello.useQuery("abc", {
    enabled,
  });
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 text-center">
      <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
        <img
          src={SITE_LOGO}
          className="pointer-events-none h-[20vmin]"
          alt={import.meta.env.VITE_TITLE}
        />
      </a>
      <h1 className="text-3xl font-bold text-primary">
        Welcome to {import.meta.env.VITE_TITLE} {data}
      </h1>
      <Button
        onClick={() => {
          if (enabled) {
            queryClient.invalidateQueries({
              queryKey: getQueryKey(trpc.hello),
            });
          } else {
            setEnabled(true);
          }
        }}
      >
        Fetch word
      </Button>
    </div>
  );
}
