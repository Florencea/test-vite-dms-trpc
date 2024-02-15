import { Title } from "react-head";

export const SiteTitle = ({ children }: { children?: string }) => {
  return children ? (
    <Title>{`${children} - ${import.meta.env.VITE_TITLE}`}</Title>
  ) : (
    <Title>{import.meta.env.VITE_TITLE}</Title>
  );
};
