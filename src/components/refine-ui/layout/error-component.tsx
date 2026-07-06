import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGo, useTranslate } from "@refinedev/core";
import { ChevronLeft } from "lucide-react";

/**
 * When the app is navigated to a non-existent route, refine shows a default error page.
 * A custom error component can be used for this error page.
 *
 * @see {@link https://refine.dev/docs/packages/documentation/routers/} for more details.
 */
export function ErrorComponent() {
  const translate = useTranslate();
  const go = useGo();

  return (
    <div
      className={cn(
        "h-full",
        "flex",
        "items-center",
        "justify-center",
        "bg-background",
        "my-auto",
      )}
    >
      <div className={cn("text-center", "space-y-8")}>
        <div className={cn("space-y-4")}>
          <h1 className={cn("text-2xl", "font-semibold", "text-foreground")}>
            {translate("pages.error.title", "Page under development.")}
          </h1>

          <div
            className={cn("flex", "items-center", "justify-center", "gap-2")}
          >
            <p className={cn("text-muted-foreground")}>
              {translate(
                "pages.error.description",
                "The page you're looking for is still under development.",
              )}
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            go({ to: "/" });
          }}
          className={cn("flex", "items-center", "gap-2", "mx-auto")}
        >
          <ChevronLeft className={cn("h-4", "w-4")} />
          {translate("pages.error.backHome", "Go back")}
        </Button>
      </div>
    </div>
  );
}

ErrorComponent.displayName = "ErrorComponent";
