import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Layout } from "../components/Layout";
import { trpcVanilla } from "../providers";

export const Route = createFileRoute("/_layout")({
  component: Page,
  beforeLoad: async () => {
    const { success } = await trpcVanilla.auth.info.query();
    if (!success) {
      throw redirect({
        to: "/",
        replace: true,
      });
    }
  },
});

function Page() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
