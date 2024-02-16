export const getMenuItemKey = (pathname: string) =>
  (pathname.split(import.meta.env.BASE_URL)?.[1] ?? "").replaceAll("/", "");
