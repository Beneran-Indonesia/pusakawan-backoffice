import type { NotificationProvider } from "@refinedev/core";
import { toast } from "sonner";
import { UndoableNotification } from "@/components/refine-ui/notification/undoable-notification";
import { notificationStore } from "./notifications-store";

export function useNotificationProvider(): NotificationProvider {
  return {
    open: ({
      key,
      type,
      message,
      description,
      undoableTimeout,
      cancelMutation,
    }) => {
      notificationStore.add({
        id:
          (key && String(key + notificationStore.getLength())) ||
          String(new Date().getTime()),
        message: String(message),
        description: description ? String(description) : "",
        type,
      });

      switch (type) {
        case "success":
          toast.success(message, {
            id: key,
            description,
            richColors: true,
          });
          return;

        case "error":
          toast.error(message, {
            id: key,
            description,
            richColors: true,
          });
          return;

        case "progress": {
          const toastId = key || Date.now();

          toast(
            () => (
              <UndoableNotification
                message={message}
                description={description}
                undoableTimeout={undoableTimeout}
                cancelMutation={cancelMutation}
                onClose={() => toast.dismiss(toastId)}
              />
            ),
            {
              id: toastId,
              duration: (undoableTimeout || 5) * 1000,
              unstyled: true,
            },
          );
          return;
        }

        default:
          return;
      }
    },
    close: (id) => {
      toast.dismiss(id);
    },
  };
}
