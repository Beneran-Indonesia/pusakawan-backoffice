import {
  useRefineOptions,
  useActiveAuthProvider,
  useLogout,
  useTranslation,
} from "@refinedev/core";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/refine-ui/theme/theme-toggle";
import { UserAvatar } from "@/components/refine-ui/layout/user-avatar";
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, LogOutIcon, UserPen } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { Separator } from "@/components/ui/separator";

export const Header = () => {
  const { isMobile } = useSidebar();

  return <>{isMobile ? <MobileHeader /> : <DesktopHeader />}</>;
};

function DesktopHeader() {
  return (
    <header
      className={cn(
        "sticky",
        "top-0",
        "flex",
        "h-20",
        "shrink-0",
        "items-center",
        "gap-4",
        "border-b",
        "border-border",
        "bg-sidebar",
        "pr-3",
        "justify-end",
        "z-40",
        "shadow-md",
      )}
    >
      <ThemeToggle />
      <LanguageSwitcher />
      <Bell />
      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-1/2"
      />
      <UserDropdown desktopSize={true} />
    </header>
  );
}

function MobileHeader() {
  const { open, isMobile } = useSidebar();

  const { title } = useRefineOptions();

  return (
    <header
      className={cn(
        "sticky",
        "top-0",
        "flex",
        "h-16",
        "shrink-0",
        "items-center",
        "gap-4",
        "border-b",
        "border-border",
        "bg-sidebar",
        "pr-3",
        "justify-end",
        "z-40",
      )}
    >
      <SidebarTrigger
        className={cn(
          "text-muted-foreground",
          "rotate-180",
          "ml-1",
          "mr-auto",
          {
            "opacity-0": open,
            "opacity-100": !open || isMobile,
            "pointer-events-auto": !open || isMobile,
            "pointer-events-none": open && !isMobile,
          },
        )}
      />

      <ThemeToggle className={cn("h-8", "w-8")} />
      <LanguageSwitcher />
      <Bell className={cn("h-8", "w-8")} />
      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-1/2"
      />
      <UserDropdown desktopSize={false} />
    </header>
  );
}

type UserDropdownProps = {
  desktopSize: boolean;
};

const UserDropdown = ({ desktopSize }: UserDropdownProps) => {
  const { translate } = useTranslation();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const authProvider = useActiveAuthProvider();

  if (!authProvider?.getIdentity) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar desktopSize={desktopSize} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            // redirect to edit profile
          }}
        >
          <UserPen
            className={cn("text-destructive", "hover:text-destructive")}
          />
          <span className={cn("text-destructive", "hover:text-destructive")}>
            {translate("header.profile_dropdown.edit_profile")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
        >
          <LogOutIcon
            className={cn("text-destructive", "hover:text-destructive")}
          />
          <span className={cn("text-destructive", "hover:text-destructive")}>
            {isLoggingOut ? "Logging out..." : translate("header.profile_dropdown.logout")}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Header.displayName = "Header";
MobileHeader.displayName = "MobileHeader";
DesktopHeader.displayName = "DesktopHeader";
