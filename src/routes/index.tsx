import { createFileRoute, redirect } from "@tanstack/react-router";
import { trpcVanilla } from "../providers";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { success } = await trpcVanilla.auth.info.query();
    if (success) {
      throw redirect({
        to: "/datatable001",
        replace: true,
      });
    }
  },
});
