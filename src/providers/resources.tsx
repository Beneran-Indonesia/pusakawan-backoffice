import {
  LayoutDashboard,
  BookOpen,
  Gamepad2,
  Trophy,
  ShoppingBag,
  Users,
} from "lucide-react";
import { UserToken } from "@/types/users-type";
import { ResourceProps } from "@refinedev/core";
import { TFunction } from "i18next";
import {
  APP_GAMES_NEW_ROUTE,
  APP_GAMES_ROUTE,
  APP_HOME_ROUTE,
  APP_PROGRAM_ROUTE,
} from "@/lib/urls";

export const createResources = (t: TFunction): ResourceProps[] => {
  const lmsNavItems: ResourceProps[] = [
    {
      list: "/lms/programs",
      name: t("menu_bar.lms.programs"),
      create: "",
      edit: "",
      meta: {
        parent: "LMS",
        key: "programs",
        label: t("menu_bar.lms.programs"),
        icon: <BookOpen className="w-5 h-5" />,
        allowedRoles: ["SUPER_ADMIN", "ADMIN", "LMS"],
      },
    },
    {
      list: "/lms/products",
      name: t("menu_bar.lms.our_products"),
      create: "",
      edit: "",
      meta: {
        parent: "LMS",
        key: "products",
        label: t("menu_bar.lms.our_products"),
        icon: <ShoppingBag className="w-5 h-5" />,
        allowedRoles: ["SUPER_ADMIN"],
      },
    },
    {
      list: "/lms/challenge",
      name: t("menu_bar.lms.challenge"),
      create: "",
      edit: "",
      meta: {
        parent: "LMS",
        key: "challenge",
        label: t("menu_bar.lms.challenge"),
        icon: <Trophy className="w-5 h-5" />,
        allowedRoles: ["SUPER_ADMIN", "ADMIN", "LMS"],
      },
    },
  ];

  const appNavItems: ResourceProps[] = [
    {
      list: APP_GAMES_ROUTE,
      name: "games",
      create: APP_GAMES_NEW_ROUTE,
      edit: APP_GAMES_ROUTE,
      meta: {
        parent: "APP",
        key: "games",
        label: t("menu_bar.app.games"),
        icon: <Gamepad2 className="w-5 h-5" />,
        allowedRoles: ["SUPER_ADMIN", "ADMIN", "APP"],
        dataProviderName: "appHomeData",
      },
    },
    {
      list: APP_HOME_ROUTE,
      name: "home",
      create: "/app/home",
      edit: "/app/edit",
      meta: {
        parent: "APP",
        key: "home",
        label: t("menu_bar.app.home"),
        icon: <LayoutDashboard className="w-5 h-5" />,
        allowedRoles: ["SUPER_ADMIN", "ADMIN", "APP"],
      },
    },
    {
      list: APP_PROGRAM_ROUTE,
      name: "programs",
      create: "",
      edit: "",
      meta: {
        parent: "APP",
        key: "programs",
        label: t("menu_bar.app.programs"),
        icon: <BookOpen className="w-5 h-5" />,
        allowedRoles: ["SUPER_ADMIN", "ADMIN", "APP"],
      },
    },
  ];

  const manageUserNavItem: ResourceProps = {
    list: "/manage-users",
    name: "Manage Users",
    create: "",
    edit: "",
    meta: {
      parent: "MANAGE_USERS",
      key: "manage-users",
      label: "Manage Users",
      icon: <Users className="w-5 h-5" />,
      allowedRoles: ["SUPER_ADMIN"],
    },
  };

  return [...lmsNavItems, ...appNavItems, manageUserNavItem];
};

export const filterResources = (
  resources: ResourceProps[],
  user: UserToken | null,
) => {
  if (!user) return resources;

  return resources.filter((resource) =>
    resource.meta?.allowedRoles.includes(user.user.role),
  );
};
