import { BarChartOutlined } from "@ant-design/icons";
import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import {
  Layout as AntdLayout,
  Button,
  Menu,
  Typography,
  theme,
  type MenuProps,
} from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SiteTitle } from "../components/SiteTitle";
import { I18nSwitcher } from "../components/i18n-switcher";
import { SITE_LOGO } from "../constants";
import { trpc, trpcVanilla } from "../providers";
import { MENU_WIDTH, NAV_HEIGHT } from "../theme";

export const Route = createFileRoute("/_layout")({
  component: Layout,
  beforeLoad: async () => {
    const isLogin = await trpcVanilla.auth.beacon.mutate();
    if (!isLogin) {
      throw redirect({
        to: "/",
        replace: true,
      });
    }
  },
});

const { Header, Sider, Content } = AntdLayout;
const { Text } = Typography;

function Layout() {
  const { t } = useTranslation("menu");
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const logout = trpc.auth.logout.useMutation();
  const info = trpc.auth.info.useQuery();
  const menuItems: MenuProps["items"] = useMemo(
    () => [
      {
        key: "/datatable001",
        icon: <BarChartOutlined />,
        label: t("datatable001"),
      },
      {
        key: "/datatable002",
        icon: <BarChartOutlined />,
        label: t("datatable002"),
      },
    ],
    [t],
  );
  return (
    <>
      <SiteTitle>dashboard</SiteTitle>
      <AntdLayout className="h-svh flex flex-col">
        <Header className="sticky top-0 z-10 flex w-full items-stretch justify-between">
          <Link
            className="flex justify-center items-center gap-3"
            style={{ color: token.colorText }}
            to={import.meta.env.VITE_WEB_BASE}
            rel="noopener"
          >
            <img className="w-[32px] h-[32px]" src={SITE_LOGO} alt="logo" />
            <h1 className="font-bold text-lg">{import.meta.env.VITE_TITLE}</h1>
          </Link>
          <div className="flex shrink-0 items-center justify-end">
            <div className="px-3">
              <Text strong>{info.data?.userName}</Text>
            </div>
            <I18nSwitcher />
            <Button
              onClick={async () => {
                await logout.mutateAsync();
                navigate({ to: "/", replace: true });
              }}
              type="text"
            >
              {t("logout", { ns: "header" })}
            </Button>
          </div>
        </Header>
        <AntdLayout className="grow flex flex-col">
          <Sider
            className="h-svh fixed top-0 left-0 bottom-0"
            width={MENU_WIDTH}
            style={{ paddingTop: NAV_HEIGHT }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={[
                `/${window.location.pathname.replace(import.meta.env.BASE_URL, "").split("/")?.[1] ?? ""}`,
              ]}
              items={menuItems}
              onClick={({ key }) => {
                navigate({ to: key });
              }}
            />
          </Sider>
          <AntdLayout
            className="w-full grow overflow-hidden"
            style={{ marginLeft: MENU_WIDTH }}
          >
            <Content className="overflow-hidden">
              <Outlet />
            </Content>
          </AntdLayout>
        </AntdLayout>
      </AntdLayout>
    </>
  );
}
