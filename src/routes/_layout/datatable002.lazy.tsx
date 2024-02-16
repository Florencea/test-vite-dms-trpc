import { BarChartOutlined } from "@ant-design/icons";
import { createLazyFileRoute } from "@tanstack/react-router";
import type { ItemType } from "antd/es/menu/hooks/useItems";
import { useTranslation } from "react-i18next";
import { SiteTitle } from "../../components/SiteTitle";
import i18n from "../../i18n";

export const Route = createLazyFileRoute("/_layout/datatable002")({
  component: Page,
});

export const menuItemDatatable002: ItemType = {
  key: "datatable002",
  icon: <BarChartOutlined />,
  label: i18n.t("datatable002", { ns: "menu" }),
};

function Page() {
  const { t } = useTranslation();
  return (
    <>
      <SiteTitle>{t("datatable002", { ns: "menu" })}</SiteTitle>
      <Datatable002 />
    </>
  );
}

function Datatable002() {
  return (
    <div>
      <div>Hello /dashboard/datatable002/!</div>
    </div>
  );
}
