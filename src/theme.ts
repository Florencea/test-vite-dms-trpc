import { theme as antTheme, type ThemeConfig } from "antd";

const { getDesignToken } = antTheme;

/**
 * 當前預設全域基礎 token
 */
const globalToken = getDesignToken();

/**
 * 主題色 (自 env 讀取)
 */
export const PRIMARY_COLOR = import.meta.env.VITE_THEME_COLOR_PRIMARY;
/**
 * Layout 左側選單寬度
 */
export const MENU_WIDTH = 200;
/**
 * Layout 頂部選單高度
 */
export const NAV_HEIGHT = 64;
/**
 * Layout 頂部選單內距
 */
export const NAV_PADDING = 20;

/**
 * 全域 antd 主題
 */
export const theme: ThemeConfig = {
  token: {
    colorPrimary: PRIMARY_COLOR,
    colorInfo: PRIMARY_COLOR,
  },
  components: {
    Layout: {
      headerHeight: NAV_HEIGHT,
      headerPadding: NAV_PADDING,
      headerBg: globalToken.colorBgContainer,
      siderBg: globalToken.colorBgContainer,
    },
  },
};
