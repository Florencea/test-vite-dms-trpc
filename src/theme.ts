import { type ThemeConfig } from "antd";

/**
 * 主題色 (自 env 讀取)
 */
export const PRIMARY_COLOR = import.meta.env.VITE_THEME_COLOR_PRIMARY;

/**
 * 全域 antd 主題
 */
export const theme: ThemeConfig = {
  cssVar: true,
  token: {
    colorPrimary: PRIMARY_COLOR,
    colorInfo: PRIMARY_COLOR,
  },
  components: {
    Menu: {
      itemSelectedColor: "var(--ant-menu-color-item-text-selected-horizontal)",
      itemSelectedBg: "var(--ant-menu-color-item-bg-selected)",
      itemBg: "var(--ant-menu-sub-menu-item-bg)",
    },
  },
};
