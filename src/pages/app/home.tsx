import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useList, useTranslate } from "@refinedev/core";

export default function AppHome() {
  const t = useTranslate();
  const {
    result,
    query: { isLoading },
  } = useList({ resource: "app-home" });

  return (
    <LoadingOverlay loading={isLoading}>
      <h1>{t("app.home.title")}</h1>
    </LoadingOverlay>
  );
}
