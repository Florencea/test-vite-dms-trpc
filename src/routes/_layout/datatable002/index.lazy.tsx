import { createLazyFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { SiteTitle } from "../../../components/SiteTitle";

export const Route = createLazyFileRoute("/_layout/datatable002/")({
  component: Datatable002,
});

function Datatable002() {
  const { t } = useTranslation();
  return (
    <>
      <SiteTitle>{t("datatable002", { ns: "menu" })}</SiteTitle>
      <div>Hello /dashboard/datatable002/!</div>
    </>
  );
}
