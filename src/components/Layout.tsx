import { BarChartOutlined } from "@ant-design/icons";
import { ProLayout } from "@ant-design/pro-components";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Button,
  ConfigProvider,
  Menu,
  Typography,
  theme as antdTheme,
} from "antd";
import { useMemo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { SITE_LOGO } from "../constants";
import { trpc } from "../providers";
import { theme } from "../theme";
import { getMenuItemKey } from "../utils/client";
import { I18nSwitcher } from "./i18n-switcher";

interface Props {
  children?: ReactNode;
}

const { Text } = Typography;

export const Layout = ({ children }: Props) => {
  const logout = trpc.auth.logout.useMutation();
  const info = trpc.auth.info.useQuery();
  const { t } = useTranslation("header");
  const { token } = antdTheme.useToken();
  const navigate = useNavigate();
  const router = useRouterState();
  const menuItems = useMemo(
    () => [
      {
        key: "datatable001",
        icon: <BarChartOutlined />,
        label: t("datatable001", { ns: "menu" }),
      },
      {
        key: "datatable002",
        icon: <BarChartOutlined />,
        label: t("datatable002", { ns: "menu" }),
      },
    ],
    [t],
  );
  return (
    <ProLayout
      className="h-svh"
      menuContentRender={() => {
        return (
          <ConfigProvider theme={{ components: theme.components }}>
            <Menu
              selectedKeys={[getMenuItemKey(router.location.pathname)]}
              items={menuItems}
              onClick={({ key }) => {
                navigate({ to: key });
              }}
            />
          </ConfigProvider>
        );
      }}
      fixSiderbar
      layout="mix"
      actionsRender={() => {
        return [
          <Text key="userName">{info.data?.userName}</Text>,
          <I18nSwitcher key="i18nswitcher" />,
        ];
      }}
      avatarProps={{
        render: () => (
          <Button
            key="logout"
            type="text"
            onClick={async () => {
              await logout.mutateAsync();
              navigate({ to: "/", replace: true });
            }}
          >
            {t("logout")}
          </Button>
        ),
      }}
      headerTitleRender={() => {
        return (
          <Link
            className="flex justify-center items-center"
            style={{ color: token.colorText }}
            to={import.meta.env.VITE_WEB_BASE}
            rel="noopener"
          >
            <img className="w-[32px] h-[32px]" src={SITE_LOGO} alt="logo" />
            <h1 className="font-bold text-lg flex items-center">
              {import.meta.env.VITE_TITLE}
            </h1>
          </Link>
        );
      }}
    >
      {children}
    </ProLayout>
  );
};
