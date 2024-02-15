import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Card, Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import { SiteTitle } from "../components/SiteTitle";
import { I18nSwitcher } from "../components/i18n-switcher";
import { trpc, type RouterInputs } from "../providers";

export const Route = createFileRoute("/")({
  component: Login,
});

function Login() {
  const { t } = useTranslation("login");
  const navigate = useNavigate();
  const login = trpc.auth.login.useMutation();
  return (
    <>
      <SiteTitle>{t("login")}</SiteTitle>
      <main className="w-full h-svh bg-primary flex justify-center items-center">
        <Card title={t("login")} extra={[<I18nSwitcher key="i18nswicher" />]}>
          <Form
            layout="vertical"
            disabled={login.isLoading}
            onFinish={async (values: RouterInputs["auth"]["login"]) => {
              await login.mutateAsync(values);
              navigate({ to: "/datatable001", replace: true });
            }}
          >
            <Form.Item
              name="account"
              label={t("account")}
              rules={[{ required: true }]}
            >
              <Input autoFocus />
            </Form.Item>
            <Form.Item
              name="password"
              label={t("password")}
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Button
              loading={login.isLoading}
              disabled={login.isLoading}
              block
              type="primary"
              htmlType="submit"
            >
              {t("submit")}
            </Button>
          </Form>
        </Card>
      </main>
    </>
  );
}
