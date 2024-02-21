import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Card, Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import { SiteTitle } from "../components/SiteTitle";
import { I18nSwitcher } from "../components/i18n-switcher";
import { trpc, type RouterInputs } from "../providers";
import { useAntdForm } from "../utils/client";

export const Route = createFileRoute("/")({
  component: Login,
});

function Login() {
  const { t } = useTranslation("login");
  const navigate = useNavigate();
  const { mutateAsync, isLoading } = trpc.auth.login.useMutation();
  const loginForm = useAntdForm<RouterInputs["auth"]["login"]>({
    formProps: {
      layout: "vertical",
      disabled: isLoading,
      onFinish: async (values) => {
        await mutateAsync(values);
        navigate({ to: "/datatable001", replace: true });
      },
    },
    formItemProps: {
      account: {
        name: "account",
        label: t("account"),
        rules: [{ required: true }],
      },
      password: {
        name: "password",
        label: t("password"),
        rules: [{ required: true }],
      },
    },
  });
  return (
    <>
      <SiteTitle>{t("login")}</SiteTitle>
      <main className="w-full h-svh bg-primary flex justify-center items-center">
        <Card title={t("login")} extra={[<I18nSwitcher key="i18nswicher" />]}>
          <Form {...loginForm.formProps}>
            <Form.Item {...loginForm.formItemProps.account}>
              <Input autoFocus />
            </Form.Item>
            <Form.Item {...loginForm.formItemProps.password}>
              <Input.Password />
            </Form.Item>
            <Button
              loading={isLoading}
              disabled={isLoading}
              type="primary"
              htmlType="submit"
              block
            >
              {t("submit")}
            </Button>
          </Form>
        </Card>
      </main>
    </>
  );
}
