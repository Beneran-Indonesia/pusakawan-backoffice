import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "./notifications-store";

export default function NotificationHeader() {
  const notifications = useNotifications();

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  console.log("this is notifications with unread count", notifications, unreadCount);

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
