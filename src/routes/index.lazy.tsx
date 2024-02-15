import { useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getQueryKey } from "@trpc/react-query";
import { Button, DatePicker } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SITE_LOGO } from "../constants";
import { trpc } from "../providers";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const queryClient = useQueryClient();
  const [enabled, setEnabled] = useState(false);
  const [enabled2, setEnabled2] = useState(false);
  const { data } = trpc.hello.useQuery("abc", {
    enabled,
  });
  const { data: data2 } = trpc.secret.useQuery("abc", {
    enabled: enabled2,
  });
  const { t, i18n } = useTranslation();
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
        Welcome to {import.meta.env.VITE_TITLE} {t("hello")}
      </h1>
      <p>{data}</p>
      <p>secret {data2}</p>
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
        Fetch word public
      </Button>
      <Button
        onClick={() => {
          if (enabled2) {
            queryClient.invalidateQueries({
              queryKey: getQueryKey(trpc.secret),
            });
          } else {
            setEnabled2(true);
          }
        }}
      >
        Fetch word secret
      </Button>
      <Button
        onClick={() => {
          i18n.changeLanguage("en-US");
        }}
      >
        to en
      </Button>
      <Button
        onClick={() => {
          i18n.changeLanguage("zh-TW");
        }}
      >
        to zh
      </Button>
      <DatePicker />
    </div>
  );
}
