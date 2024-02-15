import { createLazyFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { SiteTitle } from "../../../components/SiteTitle";

export const Route = createLazyFileRoute("/_layout/datatable001/")({
  component: Datatable001,
});

function Datatable001() {
  const { t } = useTranslation();
  return (
    <>
      <SiteTitle>{t("datatable001", { ns: "menu" })}</SiteTitle>
      <div>Hello /dashboard/datatable001/!</div>
    </>
  );
}
