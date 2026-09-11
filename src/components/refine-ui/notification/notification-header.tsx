import { useTranslate } from "@refinedev/core";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CircleCheck, CircleAlert, Clock, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications, type Notification } from "./notifications-store";

type IconVariant = { icon: React.ReactNode; badgeClassName: string };

const TYPE_ICON: Record<Notification["type"], IconVariant> = {
  success: {
    icon: <CircleCheck className={cn("h-5", "w-5")} strokeWidth={2.25} />,
    badgeClassName: cn(
      "bg-emerald-100",
      "text-emerald-600",
      "dark:bg-emerald-500/15",
      "dark:text-emerald-400",
    ),
  },
  error: {
    icon: <CircleAlert className={cn("h-5", "w-5")} strokeWidth={2.25} />,
    badgeClassName: cn(
      "bg-red-100",
      "text-red-600",
      "dark:bg-red-500/15",
      "dark:text-red-400",
    ),
  },
  progress: {
    icon: <Clock className={cn("h-5", "w-5")} strokeWidth={2.25} />,
    badgeClassName: cn(
      "bg-amber-100",
      "text-amber-600",
      "dark:bg-amber-500/15",
      "dark:text-amber-400",
    ),
  },
};

function getIconVariant(notification: Notification): IconVariant {
  return TYPE_ICON[notification.type];
}

export default function NotificationHeader() {
  const notifications = useNotifications();
  const translate = useTranslate();
  const { i18n } = useTranslation();

  const notificationsList = notifications.getNotifications();
  const unreadCount = notificationsList.filter(
    (notification) => !notification.read,
  ).length;

  const dateLocale = i18n.language === "id" ? idLocale : enUS;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "relative",
            "rounded-full",
            "border-sidebar-border",
            "bg-transparent",
            "h-10",
            "w-10",
          )}
        >
          <Bell />
          {unreadCount > 0 && (
            <span
              className={cn(
                "absolute",
                "top-0.5",
                "right-0.5",
                "h-2.5",
                "w-2.5",
                "rounded-full",
                "bg-destructive",
              )}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn("w-80", "p-0", "overflow-y-scroll")}
      >
        <div
          className={cn(
            "flex",
            "items-center",
            "justify-between",
            "px-4",
            "py-3",
            "border-b",
            "border-border",
          )}
        >
          <div className={cn("flex", "items-center", "gap-2")}>
            <span className={cn("font-semibold")}>
              {translate("notifications.panel.title", "Notifications")}
            </span>
            {unreadCount > 0 && (
              <span
                className={cn(
                  "flex",
                  "items-center",
                  "justify-center",
                  "h-5",
                  "min-w-5",
                  "px-1",
                  "rounded-full",
                  "bg-destructive",
                  "text-destructive-foreground",
                  "text-xs",
                  "font-medium",
                )}
              >
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => notifications.markAllAsRead()}
              className={cn(
                "text-xs",
                "font-medium",
                "text-primary",
                "hover:underline",
              )}
            >
              {translate("notifications.panel.mark_all_read", "Mark all read")}
            </button>
          )}
        </div>

        <ScrollArea className={cn("max-h-80")}>
          {notificationsList.length === 0 ? (
            <div
              className={cn(
                "px-4",
                "py-8",
                "text-center",
                "text-sm",
                "text-muted-foreground",
              )}
            >
              {translate("notifications.panel.empty", "No notifications")}
            </div>
          ) : (
            notificationsList.map((notification) => {
              const variant = getIconVariant(notification);

              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => notifications.markAsRead(notification.id)}
                  className={cn(
                    "w-full",
                    "flex",
                    "items-start",
                    "gap-3",
                    "px-4",
                    "py-3",
                    "text-left",
                    "border-b",
                    "border-border",
                    "last:border-b-0",
                    "hover:bg-accent",
                    !notification.read && "bg-accent/50",
                  )}
                >
                  <span
                    className={cn(
                      "flex",
                      "items-center",
                      "justify-center",
                      "shrink-0",
                      "h-11",
                      "w-11",
                      "rounded-full",
                      variant.badgeClassName,
                    )}
                  >
                    {variant.icon}
                  </span>
                  <span className={cn("flex-1", "min-w-0")}>
                    <span
                      className={cn(
                        "block",
                        "text-sm",
                        "font-medium",
                        "text-foreground",
                      )}
                    >
                      {notification.message}
                    </span>
                    {notification.description && (
                      <span
                        className={cn(
                          "block",
                          "text-sm",
                          "text-muted-foreground",
                        )}
                      >
                        {notification.description}
                      </span>
                    )}
                    <span
                      className={cn(
                        "block",
                        "text-xs",
                        "text-muted-foreground",
                        "mt-1",
                      )}
                    >
                      {formatDistanceToNow(notification.createdAt, {
                        addSuffix: true,
                        locale: dateLocale,
                      })}
                    </span>
                  </span>
                  {!notification.read && (
                    <span
                      className={cn(
                        "shrink-0",
                        "mt-1.5",
                        "h-2",
                        "w-2",
                        "rounded-full",
                        "bg-destructive",
                      )}
                    />
                  )}
                </button>
              );
            })
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
