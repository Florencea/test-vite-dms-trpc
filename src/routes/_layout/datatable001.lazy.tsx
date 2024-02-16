import { BarChartOutlined } from "@ant-design/icons";
import { createLazyFileRoute } from "@tanstack/react-router";
import type { ItemType } from "antd/es/menu/hooks/useItems";
import { useTranslation } from "react-i18next";
import { SiteTitle } from "../../components/SiteTitle";
import i18n from "../../i18n";

export const Route = createLazyFileRoute("/_layout/datatable001")({
  component: Page,
});

export const menuItemDatatable001: ItemType = {
  key: "datatable001",
  icon: <BarChartOutlined />,
  label: i18n.t("datatable001", { ns: "menu" }),
};

function Page() {
  const { t } = useTranslation();
  return (
    <>
      <SiteTitle>{t("datatable001", { ns: "menu" })}</SiteTitle>
      <Datatable001 />
    </>
  );
}

function Datatable001() {
  return (
    <div>
      <div>Hello /dashboard/datatable001/!</div>
    </div>
  );
}
