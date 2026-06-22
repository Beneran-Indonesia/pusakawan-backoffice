import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationHeader() {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "rounded-full",
        "border-sidebar-border",
        "bg-transparent",
        "h-10",
        "w-10",
      )}
    >
      <Bell />
    </Button>
  );
}
