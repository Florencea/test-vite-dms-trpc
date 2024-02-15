import { createFileRoute, redirect } from "@tanstack/react-router";
import { trpcVanilla } from "../providers";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const isLogin = await trpcVanilla.auth.beacon.mutate();
    if (isLogin) {
      throw redirect({
        to: "/datatable001",
        replace: true,
      });
    }
  },
});
