import { GlobalOutlined } from "@ant-design/icons";
import { Button, Dropdown, type MenuProps } from "antd";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

export const I18nSwitcher = () => {
  const { t, i18n } = useTranslation("i18nswicher");

  const items: MenuProps["items"] = [
    {
      label: "繁體中文",
      key: "zh-TW",
    },
    {
      label: "English",
      key: "en-US",
    },
  ];

  return (
    <Suspense>
      <Dropdown
        menu={{
          selectable: true,
          selectedKeys: [i18n.language],
          items,
          onClick: ({ key }) => {
            i18n.changeLanguage(key);
          },
        }}
        trigger={["click"]}
        arrow
      >
        <Button
          type="text"
          className="flex items-center justify-center"
          title={t("changelocale")}
        >
          <GlobalOutlined />
        </Button>
      </Dropdown>
    </Suspense>
  );
};
